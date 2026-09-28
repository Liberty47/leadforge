import { supabase } from '../lib/supabase'
import { BusinessCategory } from '../types'

// Default categories for Lead Forge
export const defaultCategories: BusinessCategory[] = [
  { id: '1', name: 'Fashion & Tailoring', description: 'Clothing, fashion brands, tailors', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '2', name: 'Restaurants', description: 'Restaurants, cafes, food services', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '3', name: 'Hotels', description: 'Hotels, resorts, accommodations', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '4', name: 'Beauty & Skincare', description: 'Salons, spas, beauty products', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '5', name: 'Barbershops', description: 'Barbershops, grooming services', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '6', name: 'Real Estate', description: 'Property, real estate agencies', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '7', name: 'Schools', description: 'Schools, academies, education', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '8', name: 'Bookstores', description: 'Bookstores, publishing', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '9', name: 'Gyms & Fitness', description: 'Gyms, fitness centers', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '10', name: 'Photography', description: 'Photography services', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '11', name: 'Event Planning', description: 'Event planning, venues', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '12', name: 'Logistics', description: 'Logistics, shipping, delivery', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '13', name: 'Construction', description: 'Construction, building', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '14', name: 'Auto Services', description: 'Auto repair, car washes', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '15', name: 'Electronics', description: 'Electronics, gadgets', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '16', name: 'Furniture', description: 'Furniture stores', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '17', name: 'Supermarkets', description: 'Supermarkets, grocery stores', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '18', name: 'Retail', description: 'Retail stores', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '19', name: 'Healthcare', description: 'Clinics, hospitals, pharmacies', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '20', name: 'Professional Services', description: 'Consulting, legal, accounting', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '21', name: 'Digital Agencies', description: 'Marketing, web design', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '22', name: 'Travel & Tourism', description: 'Travel agencies, tourism', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '23', name: 'Agriculture', description: 'Farming, agriculture', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '24', name: 'Manufacturing', description: 'Manufacturing, production', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
  { id: '25', name: 'Entertainment', description: 'Entertainment, events', is_system: true, is_favorite: false, created_at: '', updated_at: '' },
]

export class CategoryService {
  async getCategories(): Promise<BusinessCategory[]> {
    // Return default categories if Supabase not configured
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return defaultCategories
    }

    try {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      return data || defaultCategories
    } catch (error) {
      console.error('Error fetching categories:', error)
      return defaultCategories
    }
  }

  async getCategoryById(id: string): Promise<BusinessCategory | null> {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return defaultCategories.find(c => c.id === id) || null
    }

    try {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return null
    }
  }

  async addCategory(name: string, description?: string): Promise<BusinessCategory> {
    // In demo mode, add to default list
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const newCategory: BusinessCategory = {
        id: `custom-${Date.now()}`,
        name,
        description,
        is_system: false,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return newCategory
    }

    const { data, error } = await supabase
      .from('business_categories')
      .insert({
        name,
        description,
        is_system: false,
        is_favorite: false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCategory(id: string, updates: Partial<BusinessCategory>): Promise<BusinessCategory> {
    const { data, error } = await supabase
      .from('business_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteCategory(id: string): Promise<void> {
    await supabase
      .from('business_categories')
      .delete()
      .eq('id', id)
  }

  async toggleFavorite(id: string): Promise<void> {
    const category = await this.getCategoryById(id)
    if (!category) return

    await supabase
      .from('business_categories')
      .update({ is_favorite: !category.is_favorite })
      .eq('id', id)
  }

  async addCategoryToLead(leadId: string, categoryId: string): Promise<void> {
    await supabase
      .from('lead_categories')
      .upsert(
        {
          lead_id: leadId,
          category_id: categoryId,
        },
        { onConflict: 'lead_id,category_id', ignoreDuplicates: true },
      )
  }

  async removeCategoryFromLead(leadId: string, categoryId: string): Promise<void> {
    await supabase
      .from('lead_categories')
      .delete()
      .eq('lead_id', leadId)
      .eq('category_id', categoryId)
  }

  async getCategoriesForLead(leadId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('lead_categories')
      .select('category_id')
      .eq('lead_id', leadId)

    if (error) throw error
    return data.map(item => item.category_id)
  }

  async getLeadsByCategory(categoryId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('lead_categories')
      .select('lead_id')
      .eq('category_id', categoryId)

    if (error) throw error
    return data.map(item => item.lead_id)
  }
}

export const categoryService = new CategoryService()
