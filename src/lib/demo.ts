// Demo data and mock services for development without API keys

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
  categories?: string[]
}

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

export interface Activity {
  id: string
  user_id: string
  event_type: ActivityEventType
  metadata: Record<string, unknown>
  created_at: string
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

export type CampaignStatus =
  | 'draft'
  | 'generating'
  | 'pending_review'
  | 'partially_approved'
  | 'approved'
  | 'sending'
  | 'completed'
  | 'paused'

export type EmailStatus =
  | 'pending'
  | 'generating'
  | 'generated'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'sent'
  | 'failed'

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

// Demo lead data
export const demoLeads: Lead[] = [
  {
    id: 'lead-1',
    user_id: 'demo-user',
    business_name: 'Royal Stitch',
    email: 'hello@royalstitch.com',
    phone: '+234 801 234 5678',
    website: 'royalstitch.com',
    industry: 'Fashion',
    location: 'Benin City, Nigeria',
    description: 'Premium fashion brand specializing in traditional and contemporary African attire',
    source: 'serper',
    source_url: 'https://google.com/search?q=fashion+brands+in+benin',
    status: 'new',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    user_id: 'demo-user',
    business_name: 'Bella Couture',
    email: 'contact@bellacouture.com',
    phone: '+234 802 345 6789',
    website: 'bellacouture.com',
    industry: 'Fashion',
    location: 'Lagos, Nigeria',
    description: 'High-end couture house offering custom wedding and event attire',
    source: 'serper',
    source_url: 'https://google.com/search?q=fashion+designers+lagos',
    status: 'selected',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 72000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-3',
    user_id: 'demo-user',
    business_name: 'Prime Fashion',
    email: 'info@primefashion.ng',
    phone: '+234 803 456 7890',
    website: 'primefashion.ng',
    industry: 'Retail',
    location: 'Abuja, Nigeria',
    description: 'Leading fashion retailer with multiple stores across Nigeria',
    source: 'serper',
    source_url: 'https://google.com/search?q=fashion+retailers+nigeria',
    status: 'new',
    categories: ['retail', 'fashion'],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-4',
    user_id: 'demo-user',
    business_name: 'Urban Thread',
    email: 'team@urbanthread.com',
    phone: '+234 804 567 8901',
    website: 'urbanthread.com',
    industry: 'Fashion',
    location: 'Port Harcourt, Nigeria',
    description: 'Contemporary African fashion with urban influences',
    source: 'serper',
    source_url: 'https://google.com/search?q=urban+african+fashion',
    status: 'opted_out',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-5',
    user_id: 'demo-user',
    business_name: 'Elegant Styles',
    email: 'styling@elegantstyles.com',
    phone: '+234 805 678 9012',
    website: 'elegantstyles.com',
    industry: 'Fashion',
    location: 'Ibadan, Nigeria',
    description: 'Boutique styling and fashion consulting services',
    source: 'serper',
    source_url: 'https://google.com/search?q=fashion+stylists+nigeria',
    status: 'new',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-6',
    user_id: 'demo-user',
    business_name: 'Fashion Hub Nigeria',
    email: 'info@fashionhubng.com',
    phone: '+234 806 789 0123',
    website: 'fashionhubng.com',
    industry: 'Retail',
    location: 'Lagos, Nigeria',
    description: 'One-stop fashion destination with international and local brands',
    source: 'serper',
    source_url: 'https://google.com/search?q=fashion+hub+nigeria',
    status: 'new',
    categories: ['retail', 'fashion'],
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-7',
    user_id: 'demo-user',
    business_name: 'Trendy Threads',
    email: 'orders@trendythreads.ng',
    phone: '+234 807 890 1234',
    website: 'trendythreads.ng',
    industry: 'Fashion',
    location: 'Benin City, Nigeria',
    description: 'Trendy African fashion for modern consumers',
    source: 'serper',
    source_url: 'https://google.com/search?q=trendy+threads+nigeria',
    status: 'new',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-8',
    user_id: 'demo-user',
    business_name: 'African Fashion International',
    email: 'contact@afifashion.com',
    phone: '+234 808 901 2345',
    website: 'afifashion.com',
    industry: 'Fashion',
    location: 'Lagos, Nigeria',
    description: 'Promoting African fashion on the global stage',
    source: 'serper',
    source_url: 'https://google.com/search?q=african+fashion+international',
    status: 'selected',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-9',
    user_id: 'demo-user',
    business_name: 'Style Africa',
    email: 'hello@styleafrica.com',
    phone: '+234 809 012 3456',
    website: 'styleafrica.com',
    industry: 'Fashion',
    location: 'Abuja, Nigeria',
    description: 'Modern African fashion with international appeal',
    source: 'serper',
    source_url: 'https://google.com/search?q=style+africa+nigeria',
    status: 'new',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 691200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-10',
    user_id: 'demo-user',
    business_name: 'Chic African',
    email: 'info@chicafrican.com',
    phone: '+234 810 123 4567',
    website: 'chicafrican.com',
    industry: 'Fashion',
    location: 'Port Harcourt, Nigeria',
    description: 'Elegant African fashion for special occasions',
    source: 'serper',
    source_url: 'https://google.com/search?q=chic+african+nigeria',
    status: 'new',
    categories: ['fashion'],
    created_at: new Date(Date.now() - 777600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Demo campaign data
export const demoCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    user_id: 'demo-user',
    name: 'Fashion Brands - Benin',
    base_subject: 'Elevate Your Fashion Brand with Our Services',
    base_email: 'Hello {business_name},\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\n{your_name}',
    personalization_level: 'balanced',
    status: 'pending_review',
    created_at: new Date(Date.now() - 43200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'camp-2',
    user_id: 'demo-user',
    name: 'Retail Stores - Lagos',
    base_subject: 'Grow Your Retail Business',
    base_email: 'Hello {business_name},\n\nI noticed your work in the retail industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\n{your_name}',
    personalization_level: 'balanced',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Demo email drafts
export const demoEmailDrafts: EmailDraft[] = [
  {
    id: 'email-1',
    user_id: 'demo-user',
    campaign_id: 'camp-1',
    lead_id: 'lead-1',
    subject: 'Elevate Royal Stitch with Our Services',
    body: 'Hello Royal Stitch,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
    personalization_summary: 'Light personalization applied to business name',
    ai_model: 'gpt-3.5-turbo',
    status: 'pending_review',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'email-2',
    user_id: 'demo-user',
    campaign_id: 'camp-1',
    lead_id: 'lead-2',
    subject: 'Partner Opportunity for Bella Couture',
    body: 'Hello Bella Couture,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
    personalization_summary: 'Light personalization applied to business name',
    ai_model: 'gpt-3.5-turbo',
    status: 'pending_review',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'email-3',
    user_id: 'demo-user',
    campaign_id: 'camp-1',
    lead_id: 'lead-3',
    subject: 'Fashion Growth for Prime Fashion',
    body: 'Hello Prime Fashion,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
    personalization_summary: 'Light personalization applied to business name',
    ai_model: 'gpt-3.5-turbo',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'email-4',
    user_id: 'demo-user',
    campaign_id: 'camp-1',
    lead_id: 'lead-5',
    subject: 'Fashion Services for Elegant Styles',
    body: 'Hello Elegant Styles,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
    personalization_summary: 'Light personalization applied to business name',
    ai_model: 'gpt-3.5-turbo',
    status: 'pending_review',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Demo activity
export const demoActivity: Activity[] = [
  {
    id: 'act-1',
    user_id: 'demo-user',
    event_type: 'email_delivered',
    metadata: { lead_id: 'lead-1', campaign_id: 'camp-1' },
    created_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'act-2',
    user_id: 'demo-user',
    event_type: 'email_opened',
    metadata: { lead_id: 'lead-2', campaign_id: 'camp-1' },
    created_at: new Date(Date.now() - 480000).toISOString(),
  },
  {
    id: 'act-3',
    user_id: 'demo-user',
    event_type: 'email_bounced',
    metadata: { lead_id: 'lead-3', campaign_id: 'camp-1' },
    created_at: new Date(Date.now() - 1320000).toISOString(),
  },
  {
    id: 'act-4',
    user_id: 'demo-user',
    event_type: 'email_sent',
    metadata: { lead_id: 'lead-6', campaign_id: 'camp-2' },
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'act-5',
    user_id: 'demo-user',
    event_type: 'email_delivered',
    metadata: { lead_id: 'lead-6', campaign_id: 'camp-2' },
    created_at: new Date(Date.now() - 3540000).toISOString(),
  },
]

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