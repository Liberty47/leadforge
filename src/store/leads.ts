import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { ApiResponse, Lead, SearchParams } from '../types'

interface LeadsState {
  leads: Lead[]
  selectedLeads: string[]
  loading: boolean
  error: Error | null
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  searchParams: SearchParams
  
  fetchLeads: (params?: SearchParams) => Promise<ApiResponse<Lead[]>>
  getLeadById: (id: string) => Promise<ApiResponse<Lead | null>>
  createLead: (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<ApiResponse<Lead | null>>
  updateLead: (id: string, lead: Partial<Lead>) => Promise<ApiResponse<Lead | null>>
  deleteLead: (id: string) => Promise<ApiResponse<void>>
  bulkDeleteLeads: (ids: string[]) => Promise<ApiResponse<void>>
  
  selectLead: (id: string) => void
  deselectLead: (id: string) => void
  selectAllLeads: () => void
  deselectAllLeads: () => void
  
  setSearchParams: (params: Partial<SearchParams>) => void
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  selectedLeads: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
  },
  searchParams: {
    page: 1,
    per_page: 20,
  },
  
  fetchLeads: async (params) => {
    const { searchParams } = get()
    const mergedParams = { ...searchParams, ...params }
    
    set({ loading: true, error: null })
    
    try {
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
      
      // Filter by search term
      if (mergedParams.search) {
        query = query.or(`business_name.ilike.%${mergedParams.search}%,email.ilike.%${mergedParams.search}%,website.ilike.%${mergedParams.search}%`)
      }
      
      // Filter by status
      if (mergedParams.status) {
        query = query.eq('status', mergedParams.status)
      }
      
      // Filter by industry
      if (mergedParams.industry) {
        query = query.eq('industry', mergedParams.industry)
      }
      
      // Filter by location
      if (mergedParams.location) {
        query = query.ilike('location', `%${mergedParams.location}%`)
      }
      
      // Filter by has email
      if (mergedParams.has_email === true) {
        query = query.not('email', 'is', null)
      }
      
      // Filter by campaign
      if (mergedParams.campaign_id) {
        query = query.eq('campaign_id', mergedParams.campaign_id)
      }
      
      // Date filters
      if (mergedParams.date_from) {
        query = query.gte('created_at', mergedParams.date_from)
      }
      if (mergedParams.date_to) {
        query = query.lte('created_at', mergedParams.date_to)
      }
      
      // Sort
      if (mergedParams.sort_by) {
        const order = mergedParams.sort_order || 'asc'
        query = query.order(mergedParams.sort_by, { ascending: order === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }
      
      // Pagination
      const page = mergedParams.page || 1
      const perPage = mergedParams.per_page || 20
      const start = (page - 1) * perPage
      const end = start + perPage - 1
      
      const { data, error, count } = await query.range(start, end)
      
      if (error) throw error
      
      set({
        leads: data || [],
        pagination: {
          page,
          per_page: perPage,
          total: count || 0,
          total_pages: count ? Math.ceil(count / perPage) : 0,
        },
      })
      
      return { data: data || [], error: null }
    } catch (error) {
      set({ error: error as Error })
      return { data: null, error: error as Error }
    } finally {
      set({ loading: false })
    }
  },
  
  getLeadById: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    } finally {
      set({ loading: false })
    }
  },
  
  createLead: async (lead) => {
    set({ loading: true, error: null })
    
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...lead,
          user_id: user.id,
        })
        .select()
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    } finally {
      set({ loading: false })
    }
  },
  
  updateLead: async (id: string, lead) => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    } finally {
      set({ loading: false })
    }
  },
  
  deleteLead: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      set({ leads: get().leads.filter((l) => l.id !== id) })
      return { data: undefined, error: null }
    } catch (error) {
      return { data: undefined, error: error as Error }
    } finally {
      set({ loading: false })
    }
  },
  
  bulkDeleteLeads: async (ids: string[]) => {
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .in('id', ids)
      
      if (error) throw error
      
      set({ leads: get().leads.filter((l) => !ids.includes(l.id)) })
      set({ selectedLeads: [] })
      
      return { data: undefined, error: null }
    } catch (error) {
      return { data: undefined, error: error as Error }
    } finally {
      set({ loading: false })
    }
  },
  
  selectLead: (id: string) => {
    const selected = get().selectedLeads
    if (!selected.includes(id)) {
      set({ selectedLeads: [...selected, id] })
    }
  },
  
  deselectLead: (id: string) => {
    set({ selectedLeads: get().selectedLeads.filter((i) => i !== id) })
  },
  
  selectAllLeads: () => {
    set({ selectedLeads: get().leads.map((l) => l.id) })
  },
  
  deselectAllLeads: () => {
    set({ selectedLeads: [] })
  },
  
  setSearchParams: (params) => {
    set({ searchParams: { ...get().searchParams, ...params } })
  },
}))
