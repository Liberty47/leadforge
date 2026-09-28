// Duplicate detection utilities

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function normalizeDomain(emailOrWebsite: string): string {
  try {
    let url = emailOrWebsite
    if (!url.includes('://')) {
      url = `https://${url}`
    }
    return new URL(url).hostname.toLowerCase().trim()
  } catch {
    return emailOrWebsite.toLowerCase().trim()
  }
}

export function normalizeBusinessName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

// Check if a lead is likely a duplicate
export function isDuplicateLead(lead: {
  business_name: string
  email?: string
  website?: string
}, existingLeads: {
  business_name: string
  email?: string
  website?: string
}[]): boolean {
  if (!lead.email && !lead.website) return false

  // Check by email
  if (lead.email) {
    const normalizedEmail = normalizeEmail(lead.email)
    const normalizedDomain = normalizeDomain(lead.email)
    
    const duplicate = existingLeads.find(existing => {
      if (existing.email && normalizeEmail(existing.email) === normalizedEmail) {
        return true
      }
      if (existing.website && normalizeDomain(existing.website) === normalizedDomain) {
        return true
      }
      return false
    })
    
    if (duplicate) return true
  }

  // Check by website
  if (lead.website) {
    const normalizedDomain = normalizeDomain(lead.website)
    
    const duplicate = existingLeads.find(existing => {
      if (existing.website && normalizeDomain(existing.website) === normalizedDomain) {
        return true
      }
      return false
    })
    
    if (duplicate) return true
  }

  // Check by business name + location
  if (lead.business_name) {
    const normalizedBusinessName = normalizeBusinessName(lead.business_name)
    
    const duplicate = existingLeads.find(existing => {
      if (existing.business_name && 
          normalizeBusinessName(existing.business_name) === normalizedBusinessName &&
          existing.email && lead.email &&
          normalizeEmail(existing.email) === normalizeEmail(lead.email)) {
        return true
      }
      if (existing.business_name && 
          normalizeBusinessName(existing.business_name) === normalizedBusinessName &&
          existing.website && lead.website &&
          normalizeDomain(existing.website) === normalizeDomain(lead.website)) {
        return true
      }
      return false
    })
    
    if (duplicate) return true
  }

  return false
}
