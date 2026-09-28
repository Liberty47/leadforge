import React, { useState } from 'react'
import { Zap } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { useActivationStore } from '../../store/activation'

export function ActivationScreen() {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const verifyActivation = useActivationStore((state) => state.verifyActivation)

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const success = await verifyActivation(key)

    if (!success) {
      setError('Invalid activation key')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 font-bold text-3xl mb-4">
            <Zap className="w-10 h-10 text-primary" />
            Lead Forge
          </div>
          <p className="text-muted-foreground">Find leads. Personalize outreach. Stay in control.</p>
        </div>

        {/* Activation Form */}
        <div className="bg-card rounded-xl border border-border shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Activate Lead Forge</h2>
            <p className="text-muted-foreground mt-2">
              Enter your activation key to unlock the application
            </p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleActivate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="key">Activation Key</Label>
              <Input
                id="key"
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
                placeholder="Enter your activation key"
                className="text-center text-lg tracking-wider"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Activating...' : 'Activate'}
            </Button>
          </form>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            <p>Lead Forge requires an activation key.</p>
            <p>Contact your administrator for access.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Lead Forge. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
