import { Request, Response } from 'express'
import { verifyResendWebhookSignature } from '../utils/verifyWebhook.js'

export interface ResendWebhookPayload {
  type: string
  data: {
    id: string
    to: string[]
    from: string
    subject: string
    text: string
    html: string
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed'
    createdAt: string
    sentAt?: string
    deliveredAt?: string
    openedAt?: string
    clickedAt?: string
    bouncedAt?: string
    complainedAt?: string
    failedAt?: string
    tags?: { name: string; value: string }[]
    errorCode?: string
    errorMessage?: string
    metadata?: Record<string, string>
  }
  created_at: string
}

export class WebhookHandler {
  private webhookSecret: string | null
  private demoMode: boolean

  constructor() {
    this.webhookSecret = process.env.RESEND_WEBHOOK_SECRET || null
    this.demoMode = !process.env.RESEND_WEBHOOK_SECRET
  }

  async handleResendWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['resend-webhook-signature'] as string
    const rawBody = (req as any).rawBody || JSON.stringify(req.body)

    // Verify webhook signature
    if (!this.verifyWebhookSignature(rawBody, signature)) {
      res.status(401).json({ 
        error: 'Invalid signature',
        message: 'The webhook signature could not be verified'
      })
      return
    }

    const payload: ResendWebhookPayload = req.body

    console.log('Received Resend webhook:', {
      type: payload.type,
      emailId: payload.data.id,
      to: payload.data.to,
      status: payload.data.status
    })

    // Handle different event types
    switch (payload.type) {
      case 'email.sent':
        await this.handleEmailSent(payload.data)
        break
      case 'email.delivered':
        await this.handleEmailDelivered(payload.data)
        break
      case 'email.opened':
        await this.handleEmailOpened(payload.data)
        break
      case 'email.clicked':
        await this.handleEmailClicked(payload.data)
        break
      case 'email.bounced':
        await this.handleEmailBounced(payload.data)
        break
      case 'email.complained':
        await this.handleEmailComplained(payload.data)
        break
      case 'email.failed':
        await this.handleEmailFailed(payload.data)
        break
    }

    res.status(200).json({ success: true })
  }

  private async handleEmailSent(data: any): Promise<void> {
    console.log('Email sent:', data.id)
    // Update email_drafts SET status = 'sent', sent_at = NOW() WHERE provider_message_id = data.id
  }

  private async handleEmailDelivered(data: any): Promise<void> {
    console.log('Email delivered:', data.id)
    // Update email_drafts SET status = 'delivered', delivered_at = NOW() WHERE provider_message_id = data.id
  }

  private async handleEmailOpened(data: any): Promise<void> {
    console.log('Email opened:', data.id)
    // Update email_drafts 
    // SET opened_at = NOW(), open_count = COALESCE(open_count, 0) + 1
    // WHERE provider_message_id = data.id
  }

  private async handleEmailClicked(data: any): Promise<void> {
    console.log('Email clicked:', data.id)
    // Update email_drafts 
    // SET clicked_at = NOW(), click_count = COALESCE(click_count, 0) + 1
    // WHERE provider_message_id = data.id
  }

  private async handleEmailBounced(data: any): Promise<void> {
    console.log('Email bounced:', data.id)
    // Update email_drafts SET status = 'bounced', bounced_at = NOW() WHERE provider_message_id = data.id
  }

  private async handleEmailFailed(data: any): Promise<void> {
    console.log('Email failed:', data.id)
    // Update email_drafts SET status = 'failed', failed_at = NOW() WHERE provider_message_id = data.id
  }

  private async handleEmailComplained(data: any): Promise<void> {
    console.log('Email complained (spam):', data.id)
    // Update email_drafts SET status = 'bounced', bounced_at = NOW() WHERE provider_message_id = data.id
  }

  private verifyWebhookSignature(rawBody: string, signature: string): boolean {
    // In demo mode, skip verification
    if (this.demoMode) {
      return true
    }

    if (!this.webhookSecret) {
      console.warn('RESEND_WEBHOOK_SECRET not configured - signature verification disabled')
      return false
    }

    if (!signature) {
      console.warn('Missing Resend-Webhook-Signature header')
      return false
    }

    return verifyResendWebhookSignature(rawBody, signature, this.webhookSecret)
  }
}

export const webhookHandler = new WebhookHandler()
