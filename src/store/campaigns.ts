import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Campaign, CampaignStatus, Lead } from '../types'

interface CampaignState {
  campaigns: Campaign[]
  selectedCampaign: Campaign | null
  leadsForCampaign: Lead[]
  loading: boolean
  error: Error | null
  
  fetchCampaigns: () => Promise<void>
  getCampaignById: (id: string) => Promise<Campaign | null>
  createCampaign: (campaign: Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateCampaign: (id: string, campaign: Partial<Campaign>) => Promise<void>
  deleteCampaign: (id: string) => Promise<void>
  
  selectCampaign: (campaign: Campaign) => void
  deselectCampaign: () => void
  
  addLeadsToCampaign: (campaignId: string, leadIds: string[]) => Promise<void>
  removeLeadFromCampaign: (campaignId: string, leadId: string) => Promise<void>
}

export const useCampaignsStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  leadsForCampaign: [],
  loading: false,
  error: null,
  
  fetchCampaigns: async () => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      set({ campaigns: data || [] })
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false })
    }
  },
  
  getCampaignById: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return data
    } catch (error) {
      return null
    } finally {
      set({ loading: false })
    }
  },
  
  createCampaign: async (campaign) => {
    set({ loading: true, error: null })
    
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaign,
          user_id: user.id,
        })
        .select()
        .single()
      
      if (error) throw error
      
      set((state) => ({ campaigns: [data!, ...state.campaigns] }))
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false })
    }
  },
  
  updateCampaign: async (id: string, campaign) => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(campaign)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.id === id ? data! : c)),
        selectedCampaign: state.selectedCampaign?.id === id ? data! : state.selectedCampaign,
      }))
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false })
    }
  },
  
  deleteCampaign: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
        selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign,
      }))
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false })
    }
  },
  
  selectCampaign: (campaign) => {
    set({ selectedCampaign: campaign })
  },
  
  deselectCampaign: () => {
    set({ selectedCampaign: null })
  },
  
  addLeadsToCampaign: async (campaignId: string, leadIds: string[]) => {
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase
        .from('campaign_leads')
        .insert(
          leadIds.map((leadId) => ({
            campaign_id: campaignId,
            lead_id: leadId,
          }))
        )
      
      if (error) throw error
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false })
    }
  },
  
  removeLeadFromCampaign: async (campaignId: string, leadId: string) => {
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase
        .from('campaign_leads')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('lead_id', leadId)
      
      if (error) throw error
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false })
    }
  },
}))
