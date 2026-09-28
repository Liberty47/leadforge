// Lead Types
export interface Lead {
  id: string
  user_id: string
  business_name: string
  email?: string
  phone?: string
  website?: string
  industry: string
  location: string
  description?: string
  source?: string
  source_url?: string
  status: LeadStatus
  notes?: string
  created_at: string
  updated_at: string
}

export type LeadStatus =
  | 'new'
  | 'selected'
  | 'contacted'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'replied'
  | 'bounced'
  | 'opted_out'

// Campaign Types
export interface Campaign {
  id: string
  user_id: string
  name: string
  base_subject: string
  base_email: string
  personalization_level: 'light' | 'balanced' | 'deep'
  status: CampaignStatus
  created_at: string
  updated_at: string
}

export type CampaignStatus =
  | 'draft'
  | 'generating'
  | 'pending_review'
  | 'partially_approved'
  | 'approved'
  | 'sending'
  | 'completed'
  | 'paused'

// Email Draft Types
export interface EmailDraft {
  id: string
  user_id: string
  campaign_id: string
  lead_id: string
  subject: string
  body: string
  personalization_summary: string
  ai_model?: string
  status: EmailStatus
  provider_message_id?: string
  approved_at?: string
  sent_at?: string
  delivered_at?: string
  opened_at?: string
  clicked_at?: string
  replied_at?: string
  created_at: string
  updated_at: string
}

export type EmailStatus =
  | 'pending'
  | 'generating'
  | 'generated'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'sent'
  | 'failed'

// Activity Types
export interface Activity {
  id: string
  user_id: string
  event_type: ActivityEventType
  metadata: Record<string, unknown>
  created_at: string
}

export type ActivityEventType =
  | 'lead_created'
  | 'campaign_created'
  | 'email_generated'
  | 'email_approved'
  | 'email_rejected'
  | 'email_sent'
  | 'email_delivered'
  | 'email_opened'
  | 'email_clicked'
  | 'email_replied'
  | 'email_bounced'
  | 'email_failed'
  | 'lead_opted_out'
  | 'notification_sent'

// Notification Types
export interface NotificationSettings {
  id: string
  user_id: string
  telegram_enabled: boolean
  whatsapp_enabled: boolean
  tiktok_enabled: boolean
  notify_on_delivered: boolean
  notify_on_opened: boolean
  notify_on_clicked: boolean
  notify_on_replied: boolean
  notify_on_bounced: boolean
  created_at: string
  updated_at: string
}

// Profile Types
export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  timezone: string
  created_at: string
  updated_at: string
}

// Settings Types
export interface IntegrationSettings {
  id: string
  user_id: string
  serper_connected: boolean
  openrouter_connected: boolean
  resend_connected: boolean
  telegram_connected: boolean
  whatsapp_connected: boolean
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null
  error: Error | null
}

export interface Pagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface SearchParams {
  search?: string
  status?: LeadStatus
  industry?: string
  location?: string
  has_email?: boolean
  campaign_id?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Email Provider Types
export interface SendEmailParams {
  to: string
  from: string
  subject: string
  body: string
  replyTo?: string
}

export interface EmailEvent {
  id: string
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'complained'
  email_id: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Resend Webhook Payload Types
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

// AI Personalization Types
export interface AIPersonalizationInput {
  baseSubject: string
  baseEmail: string
  businessName: string
  categories?: string[]
  industry: string
  location: string
  website?: string
  description?: string
  personalizationLevel: 'light' | 'balanced' | 'deep'
  instructions?: string
}

export interface AIPersonalizationOutput {
  subject: string
  body: string
  personalizationSummary: string
  confidence: 'high' | 'medium' | 'low'
  model: string
}

// Mock Services
export interface LeadSearchResult {
  business_name: string
  website?: string
  source_url: string
  location?: string
  industry?: string
  description?: string
  email?: string
  phone?: string
}

// Business Category Types
export interface BusinessCategory {
  id: string
  name: string
  description?: string
  is_system: boolean
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface LeadCategory {
  id: string
  lead_id: string
  category_id: string
  created_at: string
}

export interface ActivationStatus {
  isValid: boolean
  isActive: boolean
  isExpired: boolean
  isRevoked: boolean
  message: string
  activatedAt?: string
  expiresAt?: string
}
