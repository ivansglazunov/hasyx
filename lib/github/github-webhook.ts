import crypto from 'crypto';
import Debug from '../debug';

const debug = Debug('github:webhook');

/**
 * Verify GitHub webhook signature
 * @param body - Raw request body
 * @param signature - GitHub signature header
 * @param secret - Webhook secret
 * @returns true if signature is valid
 */
export function verifyGitHubWebhook(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    if (!signature || !secret) {
      debug('Missing signature or secret');
      return false;
    }

    // GitHub uses HMAC SHA256 with the secret as the key
    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('hex')}`;

    // Use crypto.timingSafeEqual to prevent timing attacks
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      debug('Signature length mismatch');
      return false;
    }

    const isValid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    
    if (!isValid) {
      debug('Invalid webhook signature');
    }

    return isValid;
  } catch (error) {
    debug('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Parse GitHub webhook payload
 * @param body - Raw request body
 * @returns Parsed payload or null if invalid
 */
export function parseGitHubWebhook(body: string): any {
  try {
    return JSON.parse(body);
  } catch (error) {
    debug('Error parsing webhook payload:', error);
    return null;
  }
}

/**
 * Extract GitHub event type from headers
 * @param headers - Request headers
 * @returns Event type or null
 */
export function getGitHubEventType(headers: Record<string, string | string[] | undefined>): string | null {
  const eventHeader = headers['x-github-event'];
  if (Array.isArray(eventHeader)) {
    return eventHeader[0] || null;
  }
  return eventHeader || null;
}

/**
 * Extract GitHub signature from headers
 * @param headers - Request headers
 * @returns Signature or null
 */
export function getGitHubSignature(headers: Record<string, string | string[] | undefined>): string | null {
  const signatureHeader = headers['x-hub-signature-256'];
  if (Array.isArray(signatureHeader)) {
    return signatureHeader[0] || null;
  }
  return signatureHeader || null;
}

/**
 * Validate GitHub webhook request
 * @param body - Raw request body
 * @param headers - Request headers
 * @param secret - Webhook secret
 * @returns Validation result
 */
export function validateGitHubWebhook(
  body: string,
  headers: Record<string, string | string[] | undefined>,
  secret: string
): {
  isValid: boolean;
  eventType: string | null;
  payload: any;
  error?: string;
} {
  // Check if it's a GitHub webhook
  const eventType = getGitHubEventType(headers);
  if (!eventType) {
    return {
      isValid: false,
      eventType: null,
      payload: null,
      error: 'Missing GitHub event type'
    };
  }

  // Verify signature
  const signature = getGitHubSignature(headers);
  if (!signature) {
    return {
      isValid: false,
      eventType,
      payload: null,
      error: 'Missing GitHub signature'
    };
  }

  if (!verifyGitHubWebhook(body, signature, secret)) {
    return {
      isValid: false,
      eventType,
      payload: null,
      error: 'Invalid webhook signature'
    };
  }

  // Parse payload
  const payload = parseGitHubWebhook(body);
  if (!payload) {
    return {
      isValid: false,
      eventType,
      payload: null,
      error: 'Invalid JSON payload'
    };
  }

  return {
    isValid: true,
    eventType,
    payload
  };
} 