import { OpenRouterProvider } from './openrouter';
import { AIMessage } from '../ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const hasApiKey = !!process.env.OPENROUTER_API_KEY;
const describeWithApiKey = hasApiKey ? describe : describe.skip;

describe('OpenRouterProvider', () => {

  it('should throw an error if no API token is provided', () => {
    // @ts-ignore
    expect(() => new OpenRouterProvider({})).toThrow('OpenRouter API token is required');
  });

  it('should initialize with default options', () => {
    const provider = new OpenRouterProvider({ token: 'test-key' });
    // @ts-ignore
    expect(provider.options.model).toBe('deepseek/deepseek-chat-v3-0324:free');
  });

  it('should initialize with rate limiting enabled by default', () => {
    const provider = new OpenRouterProvider({ token: 'test-key' });
    // @ts-ignore
    expect(provider.options.enableRateLimit).toBe(true);
  });

  it('should allow disabling rate limiting', () => {
    const provider = new OpenRouterProvider({ 
      token: 'test-key',
      enableRateLimit: false
    });
    // @ts-ignore
    expect(provider.options.enableRateLimit).toBe(false);
  });

  it('should use promise queue for sequential requests', () => {
    const provider = new OpenRouterProvider({ token: 'test-key' });
    
    // @ts-ignore
    expect(provider.promising).toBeDefined();
    // @ts-ignore
    expect(provider.promising.id).toContain('openrouter');
  });

  describeWithApiKey('Integration Tests with Rate Limiting', () => {
    let provider: OpenRouterProvider;

    beforeEach(() => {
      // Use rate limiting to prevent 429 errors
      provider = new OpenRouterProvider({ 
        token: process.env.OPENROUTER_API_KEY!,
        enableRateLimit: true
      });
    });

    it('should get a valid response from query() with rate limiting', async () => {
      const messages: AIMessage[] = [{ role: 'user', content: 'Say "hello"' }];
      const response = await provider.query(messages);

      expect(response.role).toBe('assistant');
      expect(typeof response.content).toBe('string');
      expect(response.content.toLowerCase()).toContain('hello');
    }, 60000);

    it('should get a valid stream from stream() with rate limiting', async () => {
      const messages: AIMessage[] = [{ role: 'user', content: 'Say "hello"' }];
      const stream = await provider.stream(messages);
      const reader = stream.getReader();

      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          fullResponse += value;
        }
      }

      expect(fullResponse.toLowerCase()).toContain('hello');
    }, 60000);

    it('should handle multiple sequential requests without rate limit errors', async () => {
      const messages: AIMessage[] = [{ role: 'user', content: 'Count: 1' }];
      
      // Make multiple requests that should be queued and rate limited
      const promises: Promise<AIMessage>[] = [];
      for (let i = 1; i <= 3; i++) {
        const testMessages: AIMessage[] = [{ role: 'user', content: `Count: ${i}` }];
        promises.push(provider.query(testMessages));
      }

      const responses = await Promise.all(promises);
      
      // All requests should succeed
      expect(responses).toHaveLength(3);
      responses.forEach(response => {
        expect(response.role).toBe('assistant');
        expect(typeof response.content).toBe('string');
      });
    }, 120000);

    it('should handle API errors gracefully', async () => {
      const invalidProvider = new OpenRouterProvider({ 
        token: 'invalid-token',
        enableRateLimit: true
      });
      const messages: AIMessage[] = [{ role: 'user', content: 'Test' }];

      await expect(invalidProvider.query(messages)).rejects.toThrow();
    }, 60000);

    it('should fetch and use real rate limit info from OpenRouter API', async () => {
      // @ts-ignore
      const rateLimitInfo = await provider.fetchRateLimitInfo();
      
      // Should have valid rate limit info
      expect(typeof rateLimitInfo.requestsPerMinute).toBe('number');
      expect(rateLimitInfo.requestsPerMinute).toBeGreaterThan(0);
      expect(typeof rateLimitInfo.dailyLimit).toBe('number');
      expect(rateLimitInfo.dailyLimit).toBeGreaterThan(0);
    }, 30000);

    it('should calculate appropriate delays based on real rate limits', async () => {
      // @ts-ignore
      const rateLimitInfo = await provider.getRateLimitInfo();
      // @ts-ignore
      const delay = await provider.calculateRateLimit(rateLimitInfo);
      
      // Should calculate a reasonable delay (> 0 when rate limiting enabled)
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThan(10000); // Should be less than 10 seconds
    }, 30000);
  });
});