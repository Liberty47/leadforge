import { create } from 'zustand'
import { activationService } from '../services/activation'
import { ActivationStatus } from '../services/activation'

interface ActivationState {
  status: ActivationStatus | null
  loading: boolean
  error: Error | null
  verifyActivation: (key: string) => Promise<boolean>
  checkActivation: () => Promise<void>
  clearActivation: () => Promise<void>
}

export const useActivationStore = create<ActivationState>((set) => ({
  status: null,
  loading: false,
  error: null,

  verifyActivation: async (key: string) => {
    set({ loading: true, error: null })
    
    try {
      const result = await activationService.verifyActivation(key)
      
      if (result.isValid && result.isActive) {
        // Store activation token
        localStorage.setItem('activation_token', 'valid_token_placeholder')
        localStorage.setItem('activation_status', JSON.stringify(result))
        
        set({ status: result, loading: false })
        return true
      } else {
        set({ 
          status: result, 
          error: new Error(result.message),
          loading: false 
        })
        return false
      }
    } catch (error) {
      set({ 
        error: error as Error,
        loading: false 
      })
      return false
    }
  },

  checkActivation: async () => {
    set({ loading: true, error: null })
    
    try {
      const result = await activationService.getActivationStatus()
      set({ status: result, loading: false })
      
      // If not active, clear the session
      if (!result.isActive) {
        localStorage.removeItem('activation_token')
        localStorage.removeItem('activation_status')
      }
    } catch (error) {
      set({ 
        error: error as Error,
        loading: false 
      })
    }
  },

  clearActivation: async () => {
    await activationService.clearActivation()
    set({ status: null, error: null })
  },
}))
