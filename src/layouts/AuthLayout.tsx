import React from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-2">
            <Zap className="w-8 h-8 text-primary" />
            Lead Forge
          </Link>
          <p className="text-muted-foreground">Find leads. Personalize outreach. Stay in control.</p>
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-xl border border-border shadow-lg p-6 sm:p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Lead Forge. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
