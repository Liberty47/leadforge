// Activation service - verifies activation keys server-side
// No credentials are stored here, this is just the API client

export interface ActivationStatus {
  isValid: boolean
  isActive: boolean
  isExpired: boolean
  isRevoked: boolean
  message: string
  activatedAt?: string
  expiresAt?: string
}

export class ActivationService {
  private baseUrl: string

  constructor() {
    // Use relative URL to let the dev server handle proxying to backend
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
  }

  async verifyActivation(key: string): Promise<ActivationStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/activation/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          isValid: false,
          isActive: false,
          isExpired: false,
          isRevoked: false,
          message: error.message || 'Invalid activation key',
        }
      }

      const data = await response.json()
      
      return {
        isValid: true,
        isActive: data.status === 'active',
        isExpired: data.status === 'expired',
        isRevoked: data.status === 'revoked',
        message: 'Activation successful',
        activatedAt: data.activated_at,
        expiresAt: data.expires_at,
      }
    } catch (error) {
      return {
        isValid: false,
        isActive: false,
        isExpired: false,
        isRevoked: false,
        message: 'Network error. Please try again.',
      }
    }
  }

  async getActivationStatus(): Promise<ActivationStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/activation/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('activation_token') || ''}`,
        },
      })

      if (!response.ok) {
        return {
          isValid: false,
          isActive: false,
          isExpired: false,
          isRevoked: false,
          message: 'Session expired. Please reactivate.',
        }
      }

      const data = await response.json()
      
      return {
        isValid: true,
        isActive: data.status === 'active',
        isExpired: data.status === 'expired',
        isRevoked: data.status === 'revoked',
        message: data.status === 'active' ? 'Active' : data.message,
        activatedAt: data.activated_at,
        expiresAt: data.expires_at,
      }
    } catch (error) {
      return {
        isValid: false,
        isActive: false,
        isExpired: false,
        isRevoked: false,
        message: 'Network error. Please try again.',
      }
    }
  }

  async clearActivation(): Promise<void> {
    localStorage.removeItem('activation_token')
    localStorage.removeItem('activation_status')
    window.location.href = '/'
  }
}

export const activationService = new ActivationService()
