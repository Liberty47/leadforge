import { supabase } from '../lib/supabase'
import { ActivityEventType, Lead, Campaign, EmailDraft } from '../types'

interface NotificationEvent {
  id: string
  email_event_id?: string
  channel: 'telegram' | 'whatsapp' | 'tiktok'
  status?: string
  error_message?: string
  sent_at?: string
  created_at: string
}

export class NotificationService {
  async sendNotification(
    eventType: ActivityEventType,
    lead: Lead,
    campaign?: Campaign,
    email?: EmailDraft
  ): Promise<void> {
    // Get user's notification settings
    const { data: settings } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', lead.user_id)
      .single()

    if (!settings) return

    // Check if notification is enabled for this event type
    let notify = false
    switch (eventType) {
      case 'email_delivered':
        notify = settings.notify_on_delivered
        break
      case 'email_opened':
        notify = settings.notify_on_opened
        break
      case 'email_clicked':
        notify = settings.notify_on_clicked
        break
      case 'email_replied':
        notify = settings.notify_on_replied
        break
      case 'email_bounced':
        notify = settings.notify_on_bounced
        break
    }

    if (!notify) return

    // Build notification message
    const message = this.buildMessage(eventType, lead, campaign, email)

    // Send to enabled channels
    const channels: ('telegram' | 'whatsapp' | 'tiktok')[] = []
    if (settings.telegram_enabled) channels.push('telegram')
    if (settings.whatsapp_enabled) channels.push('whatsapp')
    if (settings.tiktok_enabled) channels.push('tiktok')

    // Send notifications
    for (const channel of channels) {
      await this.sendToChannel(channel, message, lead, eventType)
    }
  }

  private buildMessage(
    eventType: ActivityEventType,
    lead: Lead,
    campaign?: Campaign,
    email?: EmailDraft
  ): string {
    let title = 'Lead Forge'
    let body = ''

    const leadInfo = `${lead.business_name} (${lead.email || 'No email'})`
    const campaignInfo = campaign ? `Campaign: ${campaign.name}` : ''

    switch (eventType) {
      case 'email_delivered':
        body = `📧 Email delivered\n\n${leadInfo}\n${campaignInfo}`
        break
      case 'email_opened':
        body = `👁 Open detected\n\n${leadInfo}\n${campaignInfo}`
        break
      case 'email_clicked':
        body = `🔗 Link clicked\n\n${leadInfo}\n${campaignInfo}`
        break
      case 'email_replied':
        body = `↩ Reply received\n\n${leadInfo}\n${campaignInfo}`
        break
      case 'email_bounced':
        body = `❌ Email bounced\n\n${leadInfo}\n${campaignInfo}`
        break
      case 'email_failed':
        body = `⚠️ Email failed\n\n${leadInfo}\n${campaignInfo}`
        break
      default:
        body = `New event: ${eventType}\n\n${leadInfo}`
    }

    return `${title}\n\n${body}`
  }

  private async sendToChannel(
    channel: 'telegram' | 'whatsapp' | 'tiktok',
    message: string,
    lead: Lead,
    eventType: ActivityEventType
  ): Promise<void> {
    try {
      // Get user's integration settings for this channel
      const { data: integration } = await supabase
        .from('integration_settings')
        .select('*')
        .eq('user_id', lead.user_id)
        .single()

      if (!integration) return

      // Check if channel is connected
      let isConnected = false
      switch (channel) {
        case 'telegram':
          isConnected = integration.telegram_connected
          break
        case 'whatsapp':
          isConnected = integration.whatsapp_connected
          break
        case 'tiktok':
          isConnected = integration.tiktok_enabled && false // TikTok not yet implemented
          break
      }

      if (!isConnected) return

      // Record notification attempt
      await supabase.from('notification_events').insert({
        user_id: lead.user_id,
        channel,
        status: 'pending',
      })

      // In production, send to the actual channel
      // This is where you would integrate with Telegram Bot API, WhatsApp Business API, etc.
      console.log(`[Notification] Sending to ${channel}:`, message)

      // Mark as sent
      await supabase
        .from('notification_events')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('user_id', lead.user_id)
        .eq('channel', channel)
        .eq('status', 'pending')
        .eq('created_at', (await supabase.from('notification_events').select('created_at').order('created_at', { ascending: false }).limit(1)).data?.[0]?.created_at)
    } catch (error) {
      console.error(`[Notification] Error sending to ${channel}:`, error)
    }
  }
}

export const notificationService = new NotificationService()
