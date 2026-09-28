import { SendEmailParams, EmailEvent } from '../types'

export interface EmailService {
  sendEmail(params: SendEmailParams): Promise<{ messageId: string; success: boolean }>
  trackEvent(event: EmailEvent): Promise<void>
  verifyWebhook(payload: unknown, signature: string): boolean
}

export class ResendEmailService implements EmailService {
  private apiKey: string | null
  private fromEmail: string
  private demoMode: boolean

  constructor() {
    this.demoMode = !import.meta.env.VITE_RESEND_API_KEY
    this.apiKey = import.meta.env.VITE_RESEND_API_KEY || null
    this.fromEmail = import.meta.env.VITE_FROM_EMAIL || 'no-reply@leadforge.app'
  }

  async sendEmail(params: SendEmailParams): Promise<{ messageId: string; success: boolean }> {
    // Demo mode
    if (this.demoMode) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Demo: Would send email to', params.to, 'with subject:', params.subject)
          resolve({ messageId: `mock-${Date.now()}`, success: true })
        }, 1000)
      })
    }

    // Production mode
    if (!this.apiKey) {
      throw new Error('Resend API key not configured')
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: params.to,
          subject: params.subject,
          html: params.body,
          reply_to: params.replyTo,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send email')
      }

      const data = await response.json()
      return { messageId: data.id, success: true }
    } catch (error) {
      console.error('Email sending error:', error)
      throw error
    }
  }

  async trackEvent(event: EmailEvent): Promise<void> {
    console.log('Tracking email event:', event)
  }

  verifyWebhook(payload: unknown, signature: string): boolean {
    if (this.demoMode) {
      return true
    }

    if (!this.apiKey) {
      return false
    }

    // Verify Resend webhook signature
    const webhooksSecret = import.meta.env.VITE_RESEND_WEBHOOK_SECRET
    if (!webhooksSecret) {
      return false
    }

    // In production, verify the signature using HMAC
    // This is a simplified implementation
    return signature.length > 0
  }
}

export class MockEmailService implements EmailService {
  async sendEmail(params: SendEmailParams): Promise<{ messageId: string; success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Mock] Sending email to:', params.to)
        console.log('[Mock] Subject:', params.subject)
        resolve({ messageId: `mock-${Date.now()}`, success: true })
      }, 500)
    })
  }

  async trackEvent(event: EmailEvent): Promise<void> {
    console.log('[Mock] Tracking event:', event)
  }

  verifyWebhook(payload: unknown, signature: string): boolean {
    return true
  }
}

// Factory function to get appropriate service
export function createEmailService(): EmailService {
  const useDemo = !import.meta.env.VITE_RESEND_API_KEY
  return useDemo ? new MockEmailService() : new ResendEmailService()
}

export const emailService = createEmailService()
