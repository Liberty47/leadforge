import { AIPersonalizationInput, AIPersonalizationOutput } from '../types'

const DEMO_RESPONSES: Record<string, AIPersonalizationOutput> = {
  'Royal Stitch-light': {
    subject: 'Elevate Royal Stitch with Our Services',
    body: 'Hello Royal Stitch,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
    personalizationSummary: 'Light personalization applied to business name',
    confidence: 'high',
    model: 'gpt-3.5-turbo',
  },
  'Royal Stitch-balanced': {
    subject: 'Fashion Partnerships for Royal Stitch',
    body: 'Hello Royal Stitch,\n\nI\'ve been following your work in the fashion industry. Your approach to combining traditional and contemporary African attire is impressive. We offer specialized services that could help take your brand to the next level.\n\nWould you be open to a brief conversation to explore potential collaboration?\n\nBest regards,\nLead Forge Team',
    personalizationSummary: 'Balanced personalization with business context',
    confidence: 'high',
    model: 'gpt-3.5-turbo',
  },
  'Royal Stitch-deep': {
    subject: 'Premium Fashion Brand Growth Opportunity',
    body: 'Hello Royal Stitch team,\n\nAs a premium fashion brand specializing in traditional and contemporary African attire based in Benin City, Royal Stitch is making an impact in the industry. We work with leading fashion brands to enhance their digital presence and customer engagement.\n\nI believe our services could help Royal Stitch reach even more customers. Would you be available for a brief call next week?\n\nBest regards,\nLead Forge Team',
    personalizationSummary: 'Deep personalization using business description and location',
    confidence: 'high',
    model: 'gpt-3.5-turbo',
  },
}

export class AIPersonalizationService {
  private demoMode: boolean
  private openrouterApiKey: string | null

  constructor() {
    this.demoMode = !import.meta.env.VITE_OPENROUTER_API_KEY
    this.openrouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY || null
  }

  async personalizeEmail(input: AIPersonalizationInput): Promise<AIPersonalizationOutput> {
    const { baseSubject, baseEmail, businessName, personalizationLevel } = input
    
    // Demo mode - return mock responses
    if (this.demoMode) {
      const key = `${businessName}-${personalizationLevel}`
      if (DEMO_RESPONSES[key]) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(DEMO_RESPONSES[key])
          }, 1500)
        })
      }
      
      // Generic response for unknown business
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            subject: `Update: ${baseSubject.replace('{}', businessName)}`,
            body: baseEmail.replace(/{business_name}/g, businessName).replace(/{your_name}/g, 'Lead Forge Team'),
            personalizationSummary: `Light personalization applied to business name: ${businessName}`,
            confidence: 'high',
            model: 'gpt-3.5-turbo',
          })
        }, 1500)
      })
    }

    // Production mode - use OpenRouter API
    if (!this.openrouterApiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    const systemPrompt = `You are an expert email personalization assistant. Your task is to personalize a cold email for a business lead.

IMPORTANT RULES:
- Never invent facts about the business
- Never fabricate achievements, products, or services
- Never claim a website feature exists unless you can verify it
- Never claim the user personally researched something
- Never generate fake testimonials or statistics
- Keep the tone natural and professional
- Avoid spammy language and excessive compliments
- Maintain the intent of the original email
- Use the personalization level requested

Personalization Levels:
- light: Keep original email almost unchanged, just replace {business_name} with actual name
- balanced: Rewrite naturally while maintaining intent and tone, add relevant details about the business
- deep: Use available business information to create strongly personalized email

Return your response as JSON with: subject, body, personalization_summary, confidence (high/medium/low)`

    const userPrompt = `Base Subject: ${baseSubject}
Base Email: ${baseEmail}
Business Name: ${businessName}
Industry: ${input.industry}
Location: ${input.location}
Website: ${input.website || 'Not provided'}
Business Description: ${input.description || 'Not provided'}
Personalization Level: ${personalizationLevel}`

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Lead Forge',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || '{}'
      const result = JSON.parse(content)

      return {
        subject: result.subject,
        body: result.body,
        personalizationSummary: result.personalization_summary,
        confidence: result.confidence as 'high' | 'medium' | 'low',
        model: data.model || 'unknown',
      }
    } catch (error) {
      console.error('AI personalization error:', error)
      // Fallback to demo response
      const key = `${businessName}-${personalizationLevel}`
      return DEMO_RESPONSES[key] || {
        subject: baseSubject,
        body: baseEmail.replace(/{business_name}/g, businessName).replace(/{your_name}/g, 'Lead Forge Team'),
        personalizationSummary: 'No personalization available',
        confidence: 'low',
        model: 'fallback',
      }
    }
  }
}

export const aiPersonalizationService = new AIPersonalizationService()
