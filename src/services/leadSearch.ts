import { LeadSearchResult } from '../types'

const DEMO_RESULTS: LeadSearchResult[] = [
  {
    business_name: 'Royal Stitch',
    website: 'https://royalstitch.com',
    source_url: 'https://google.com/search?q=fashion+brands+in+benin',
    location: 'Benin City, Nigeria',
    industry: 'Fashion',
    description: 'Premium fashion brand specializing in traditional and contemporary African attire',
    email: 'hello@royalstitch.com',
  },
  {
    business_name: 'Bella Couture',
    website: 'https://bellacouture.com',
    source_url: 'https://google.com/search?q=fashion+designers+lagos',
    location: 'Lagos, Nigeria',
    industry: 'Fashion',
    description: 'High-end couture house offering custom wedding and event attire',
    email: 'contact@bellacouture.com',
  },
  {
    business_name: 'Prime Fashion',
    website: 'https://primefashion.ng',
    source_url: 'https://google.com/search?q=fashion+retailers+nigeria',
    location: 'Abuja, Nigeria',
    industry: 'Retail',
    description: 'Leading fashion retailer with multiple stores across Nigeria',
  },
  {
    business_name: 'Urban Thread',
    website: 'https://urbanthread.com',
    source_url: 'https://google.com/search?q=urban+african+fashion',
    location: 'Port Harcourt, Nigeria',
    industry: 'Fashion',
    description: 'Contemporary African fashion with urban influences',
    email: 'team@urbanthread.com',
  },
  {
    business_name: 'Elegant Styles',
    website: 'https://elegantstyles.com',
    source_url: 'https://google.com/search?q=fashion+stylists+nigeria',
    location: 'Ibadan, Nigeria',
    industry: 'Fashion',
    description: 'Boutique styling and fashion consulting services',
    email: 'styling@elegantstyles.com',
  },
]

export class LeadSearchService {
  private demoMode: boolean
  private serperApiKey: string | null

  constructor() {
    this.demoMode = !import.meta.env.VITE_SERPER_API_KEY
    this.serperApiKey = import.meta.env.VITE_SERPER_API_KEY || null
  }

  async searchLeads(query: string, filters?: {
    location?: string
    industry?: string
    limit?: number
  }): Promise<LeadSearchResult[]> {
    // Demo mode - return mock results
    if (this.demoMode) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const results = DEMO_RESULTS.filter((r) => {
            if (filters?.location && r.location?.toLowerCase().includes(filters.location.toLowerCase())) {
              return true
            }
            if (filters?.industry && r.industry?.toLowerCase().includes(filters.industry.toLowerCase())) {
              return true
            }
            return true
          })
          resolve(results.slice(0, filters?.limit || 10))
        }, 1500)
      })
    }

    // Production mode - use Serper API
    if (!this.serperApiKey) {
      throw new Error('Serper API key not configured')
    }

    const searchQuery = `${query}${filters?.location ? ` ${filters.location}` : ''}${filters?.industry ? ` ${filters.industry}` : ''}`

    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          num: filters?.limit || 10,
        }),
      })

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.status}`)
      }

      const data = await response.json()

      // Extract results from Serper response
      const results: LeadSearchResult[] = (data.organic || []).map((item: any) => ({
        business_name: item.title,
        website: new URL(item.link).hostname,
        source_url: item.link,
        location: filters?.location,
        industry: filters?.industry,
        description: item.snippet,
      }))

      // Add phone numbers from people results if available
      if (data.knowledgeGraph) {
        results.forEach((r) => {
          if (data.knowledgeGraph.phone) {
            r.phone = data.knowledgeGraph.phone
          }
        })
      }

      return results
    } catch (error) {
      console.error('Lead search error:', error)
      // Fallback to demo data if API fails
      return DEMO_RESULTS.slice(0, 5)
    }
  }

  async getEmailFromWebsite(website: string): Promise<string | null> {
    // In demo mode, return mock emails
    if (this.demoMode) {
      const domains: Record<string, string> = {
        'royalstitch.com': 'hello@royalstitch.com',
        'bellacouture.com': 'contact@bellacouture.com',
        'primefashion.ng': 'info@primefashion.ng',
        'urbanthread.com': 'team@urbanthread.com',
        'elegantstyles.com': 'styling@elegantstyles.com',
      }
      return domains[website] || null
    }

    // Production mode - try to find email
    if (!this.serperApiKey) {
      return null
    }

    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: `contact ${website} email`,
        }),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      const firstResult = data.organic?.[0]

      if (firstResult?.snippet) {
        // Simple email regex - in production use a more robust solution
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
        const match = firstResult.snippet.match(emailRegex)
        return match?.[0] || null
      }

      return null
    } catch (error) {
      return null
    }
  }
}

export const leadSearchService = new LeadSearchService()
