import React, { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent } from '../../components/ui/Card'
import { AlertCircle } from 'lucide-react'

export function SettingsGeneralPage() {
  const [fullName, setFullName] = useState('User')
  const [email, setEmail] = useState('user@example.com')
  const [timezone, setTimezone] = useState('UTC')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, save settings
    console.log('Saving general settings:', { fullName, email, timezone })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  To change your email, please contact support
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                </select>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Danger Zone</h2>
            <div className="flex items-start gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-red-500">
                  Changes made here cannot be undone. Please proceed with caution.
                </p>
                <Button variant="danger" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
