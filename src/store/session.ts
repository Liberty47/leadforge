import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface SessionState {
  session: Session | null
  user: User | null
  loading: boolean
  checkSession: () => Promise<void>
  signOut: () => Promise<void>
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  user: null,
  loading: true,
  
  checkSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })
  },
  
  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null })
  },
}))
