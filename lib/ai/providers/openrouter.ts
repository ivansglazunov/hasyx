import { AIMessage, AIProvider, ProviderOptions } from '../ai';
import { Promising } from '../../promising';

// Rate limit information from OpenRouter API
interface RateLimitInfo {
  /** Remaining requests in the current minute (header X-RateLimit-Requests-Remaining) */
  remainingRequests?: number;
  /** Requests-per-minute limit (header X-RateLimit-Requests-Limit) */
  limitPerMinute?: number;
  /** Epoch ms when the bucket resets (derived from X-RateLimit-Requests-Reset or Reset-After) */
  resetAt?: number;

  // Legacy fields from the /auth/key fallback (still useful if a Provisioning key is provided)
  usage?: number;
  limit?: number | null;
  is_free_tier?: boolean;

  /** Timestamp when we updated this struct */
  lastUpdated: number;
  /** Calculated rpm when we only have model info */
  requestsPerMinute?: number;
  dailyLimit?: number;
}

// Subset of options relevant to OpenRouter API calls
export interface OpenRouterProviderOptions extends ProviderOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  user?: string;
  token: string;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  tool_choice?: string;
  timeout?: number; // Timeout in milliseconds
  enableRateLimit?: boolean; // Enable rate limiting (default: true)
  rateLimitCacheTTL?: number; // Cache TTL in ms (default: 60000)
}

export class OpenRouterProvider implements AIProvider {
  private options: OpenRouterProviderOptions;
  private rateLimitInfo: RateLimitInfo | null = null;
  private promising: Promising;
  private static instanceCounter = 0;

  constructor(options: OpenRouterProviderOptions) {
    if (!options.token) {
      throw new Error('OpenRouter API token is required');
    }
    this.options = {
      model: 'deepseek/deepseek-chat-v3-0324:free',
      temperature: 0.7,
      top_p: 1,
      top_k: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
      timeout: 60000, // 60 seconds default timeout
      enableRateLimit: true,
      rateLimitCacheTTL: 60000, // 1 minute cache
      ...options
    };
    
    // Create unique queue for this instance
    OpenRouterProvider.instanceCounter++;
    this.promising = new Promising(`openrouter-${OpenRouterProvider.instanceCounter}`);
  }

  /**
   * Fetch rate limit information from OpenRouter API
   */
  private async fetchRateLimitInfo(): Promise<RateLimitInfo> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.options.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rate limit info: ${response.status}`);
      }

      const data = await response.json();
      const now = Date.now();
      
      // Calculate rate limits based on model type and tier
      const isFreeTier = data.data.is_free_tier;
      const hasPaidCredits = data.data.limit === null || data.data.usage < data.data.limit;
      
      let requestsPerMinute = 60; // Default for paid models
      let dailyLimit = Infinity;
      
      // Check if using free model
      if (this.options.model?.endsWith(':free')) {
        requestsPerMinute = 20; // Free models: 20 requests per minute
        dailyLimit = hasPaidCredits && !isFreeTier ? 1000 : 50; // 1000 if paid, 50 if not
      }

      return {
        usage: data.data.usage,
        limit: data.data.limit,
        is_free_tier: isFreeTier,
        lastUpdated: now,
        requestsPerMinute,
        dailyLimit
      };
    } catch (error) {
      console.warn('Failed to fetch rate limit info, using defaults:', error);
      // Return conservative defaults if API call fails
      return {
        usage: 0,
        limit: null,
        is_free_tier: true,
        lastUpdated: Date.now(),
        requestsPerMinute: 20,
        dailyLimit: 50
      };
    }
  }

  /**
   * Update internal rate-limit information based on X-RateLimit response headers.
   */
  private updateRateLimitFromHeaders(response: Response) {
    const remainingStr = response.headers.get('x-ratelimit-requests-remaining');
    const limitStr = response.headers.get('x-ratelimit-requests-limit');

    // Some versions use seconds-until-reset; others supply epoch timestamp.
    const resetAfterStr = response.headers.get('x-ratelimit-requests-reset') || response.headers.get('x-ratelimit-reset-after');

    if (remainingStr || limitStr || resetAfterStr) {
      const now = Date.now();
      const remaining = remainingStr !== null ? parseInt(remainingStr, 10) : undefined;
      const limitPerMinute = limitStr !== null ? parseInt(limitStr, 10) : undefined;

      let resetAt: number | undefined = this.rateLimitInfo?.resetAt;
      if (resetAfterStr !== null) {
        const seconds = parseInt(resetAfterStr, 10);
        if (!isNaN(seconds)) {
          resetAt = now + seconds * 1000;
        } else {
          const epoch = parseInt(resetAfterStr, 10);
          if (!isNaN(epoch)) {
            resetAt = epoch * 1000; // assume seconds epoch
          }
        }
      }

      this.rateLimitInfo = {
        ...this.rateLimitInfo,
        lastUpdated: now,
        remainingRequests: isNaN(remaining!) ? this.rateLimitInfo?.remainingRequests : remaining,
        limitPerMinute: isNaN(limitPerMinute!) ? this.rateLimitInfo?.limitPerMinute : limitPerMinute,
        resetAt
      } as RateLimitInfo;
    }
  }

  /**
   * Get current rate limit info. Previously we fetched it with a separate call,
   * but now we rely primarily on headers; this remains for Provisioning keys
   * or fallback behaviour.
   */
  private async getRateLimitInfo(): Promise<RateLimitInfo> {
    const now = Date.now();
    const cacheExpired = !this.rateLimitInfo || 
      (now - this.rateLimitInfo.lastUpdated) > this.options.rateLimitCacheTTL!;
    
    if (cacheExpired) {
      this.rateLimitInfo = await this.fetchRateLimitInfo();
    }
    
    return this.rateLimitInfo!;
  }

  /**
   * Calculate delay needed based on rate limits
   */
  /**
   * Determine how long we should wait before the next request, based on the most
   * recent X-RateLimit headers. Falls back to conservative defaults if we do not
   * have any information yet.
   */
  private async calculateRateLimit(): Promise<number> {
    if (!this.options.enableRateLimit) {
      return 0;
    }

    const info = this.rateLimitInfo;

    // If we parsed headers from a previous response
    if (info?.remainingRequests !== undefined) {
      if (info.remainingRequests > 0) {
        return 0; // still have allowance in this window
      }
      if (info.resetAt) {
        // Wait until the reset moment plus a small buffer
        return Math.max(info.resetAt - Date.now(), 0) + 100;
      }
    }

    // Fallback: use requestsPerMinute if available
    const rpm = info?.requestsPerMinute ?? 20; // conservative default
    return Math.ceil(60000 / rpm) + 100;
  }

  /**
   * Apply rate limiting with promise queue
   */
  private async _rateLimit(): Promise<void> {
    const delay = await this.calculateRateLimit();
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * Handle 429 rate limit errors with exponential backoff
   */
  private async handleRateLimit(error: Error, retryCount: number = 0): Promise<void> {
    const maxRetries = 3;
    
    if (retryCount >= maxRetries) {
      throw error;
    }
    
    // Extract retry-after from error message if available
    const retryAfterMatch = error.message.match(/retry.*?(\d+).*?second/i);
    const retryAfterSeconds = retryAfterMatch ? parseInt(retryAfterMatch[1]) : null;
    
    // Use exponential backoff: 2^retryCount * 1000ms, max 30 seconds
    const backoffMs = retryAfterSeconds 
      ? retryAfterSeconds * 1000 
      : Math.min(Math.pow(2, retryCount) * 1000, 30000);
    
    console.warn(`Rate limited, retrying in ${backoffMs}ms (attempt ${retryCount + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, backoffMs));
    
    // Invalidate rate limit cache to fetch fresh info
    this.rateLimitInfo = null;
  }

  /**
   * Execute a function with retry logic for rate limit errors
   */
  private async executeWithRetry<T>(fn: () => Promise<T>, retryCount: number = 0): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (error.isRateLimit && retryCount < 3) {
        await this.handleRateLimit(error, retryCount);
        return this.executeWithRetry(fn, retryCount + 1);
      }
      throw error;
    }
  }

  private async fetchAPI(body: any, options: { timeout: number }): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.options.token}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/ivansglazunov/hasyx',
          'X-Title': 'Hasyx Framework'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error(`OpenRouter API request timed out after ${options.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async query(messages: AIMessage[], options: OpenRouterProviderOptions = this.options): Promise<AIMessage> {
    return this.promising.execute(async () => {
      await this._rateLimit();
      
      const finalOptions = { ...this.options, ...options };
      const requestBody = {
        model: finalOptions.model,
        messages: messages,
        temperature: finalOptions.temperature,
        max_tokens: finalOptions.max_tokens,
        user: finalOptions.user,
        top_p: finalOptions.top_p,
        top_k: finalOptions.top_k,
        frequency_penalty: finalOptions.frequency_penalty,
        presence_penalty: finalOptions.presence_penalty,
        ...(finalOptions.tool_choice && { tool_choice: finalOptions.tool_choice }),
      };

      return this.executeWithRetry(async () => {
        const response = await this.fetchAPI(requestBody, { timeout: finalOptions.timeout! });

        // Update internal rate-limit cache from response headers (if present)
        this.updateRateLimitFromHeaders(response);

        if (!response.ok) {
          const errorText = await response.text();
          const error = new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
          
          // Check if it's a rate limit error
          if (response.status === 429) {
            (error as any).isRateLimit = true;
          }
          
          throw error;
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';

        return { role: 'assistant', content };
      });
    });
  }

  async stream(messages: AIMessage[], options: OpenRouterProviderOptions = this.options): Promise<ReadableStream<string>> {
    return this.promising.execute(async () => {
      await this._rateLimit();
      
      const finalOptions = { ...this.options, ...options };
      const requestBody = {
        model: finalOptions.model,
        messages: messages,
        stream: true,
        temperature: finalOptions.temperature,
        max_tokens: finalOptions.max_tokens,
        user: finalOptions.user,
        top_p: finalOptions.top_p,
        top_k: finalOptions.top_k,
        frequency_penalty: finalOptions.frequency_penalty,
        presence_penalty: finalOptions.presence_penalty,
        ...(finalOptions.tool_choice && { tool_choice: finalOptions.tool_choice }),
      };

      return this.executeWithRetry(async () => {
        const response = await this.fetchAPI(requestBody, { timeout: finalOptions.timeout! });

        // Update internal rate-limit cache from response headers (if present)
        this.updateRateLimitFromHeaders(response);

        if (!response.ok) {
          const errorText = await response.text();
          const error = new Error(`OpenRouter API stream error: ${response.status} ${response.statusText} - ${errorText}`);
          
          // Check if it's a rate limit error
          if (response.status === 429) {
            (error as any).isRateLimit = true;
          }
          
          throw error;
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        const decoder = new TextDecoder();

        return new ReadableStream<string>({
          async start(controller) {
            const reader = response.body!.getReader();
            let buffer = '';
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                  if (line.trim().startsWith('data: ')) {
                    const data = line.trim().slice(6);
                    if (data === '[DONE]') {
                      controller.close();
                      return;
                    }
                    try {
                      const parsed = JSON.parse(data);
                      const content = parsed.choices?.[0]?.delta?.content;
                      if (content) {
                        controller.enqueue(content);
                      }
                    } catch (e) {
                      // Ignore parsing errors for non-json lines
                    }
                  }
                }
              }
            } catch (error) {
              controller.error(error);
            } finally {
              controller.close();
            }
          }
        });
      });
    });
  }
} 