import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSessionStore } from '../../store/session'
import { Spinner } from './Spinner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSessionStore()

  if (loading) {
    return <Spinner />
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
