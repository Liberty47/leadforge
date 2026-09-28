import { createHmac } from 'crypto'

/**
 * Verify Resend webhook signature
 * @param rawBody - The raw request body
 * @param signature - The Resend-Webhook-Signature header value
 * @param secret - The webhook secret from environment variables
 * @returns boolean - True if signature is valid
 */
export function verifyResendWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!rawBody || !signature || !secret) {
    return false
  }

  try {
    // Resend signature format: t={timestamp},s={signature}
    const parts = signature.split(',')
    if (parts.length !== 2) {
      return false
    }

    const timestampPart = parts[0]
    const providedSignature = parts[1]

    if (!timestampPart.startsWith('t=') || !providedSignature.startsWith('s=')) {
      return false
    }

    const timestamp = timestampPart.substring(2)
    const expectedSignature = createHmac('sha256', secret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex')

    // Use constant-time comparison to prevent timing attacks
    if (expectedSignature.length !== providedSignature.length) {
      return false
    }

    let diff = 0
    for (let i = 0; i < expectedSignature.length; i++) {
      diff |= expectedSignature.charCodeAt(i) ^ providedSignature.charCodeAt(i)
    }

    return diff === 0
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return false
  }
}

/**
 * Get timestamp from signature
 * @param signature - The Resend-Webhook-Signature header value
 * @returns number | null - Unix timestamp or null if invalid
 */
export function getWebhookTimestamp(signature: string): number | null {
  try {
    const parts = signature.split(',')
    if (parts.length !== 2) {
      return null
    }

    const timestampPart = parts[0]
    if (!timestampPart.startsWith('t=')) {
      return null
    }

    return parseInt(timestampPart.substring(2), 10)
  } catch (error) {
    return null
  }
}

/**
 * Check if webhook timestamp is within acceptable range
 * @param timestamp - Unix timestamp from webhook signature
 * @param toleranceSeconds - How old the webhook can be (default: 5 minutes)
 * @returns boolean
 */
export function isWebhookTimestampValid(
  timestamp: number,
  toleranceSeconds: number = 300
): boolean {
  const now = Math.floor(Date.now() / 1000)
  const diff = Math.abs(now - timestamp)
  return diff <= toleranceSeconds
}
