import React, { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent } from '../../components/ui/Card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function SettingsEmailPage() {
  const [resendApiKey, setResendApiKey] = useState('')
  const [fromName, setFromName] = useState('Lead Forge')
  const [fromEmail, setFromEmail] = useState('no-reply@leadforge.app')
  const [replyTo, setReplyTo] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, save settings
    console.log('Saving email settings:', { resendApiKey, fromName, fromEmail, replyTo })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Resend Configuration</h2>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-amber-500">
                    Your Resend API key is stored securely. Never share it with anyone.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get your API key from <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">resend.com</a>
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resendApiKey">Resend API Key</Label>
                <Input
                  id="resendApiKey"
                  type="password"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  placeholder="re_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Your Name or Company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="from@yourdomain.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To (Optional)</Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  placeholder="reply@yourdomain.com"
                />
              </div>
              <Button type="submit">Save Email Settings</Button>
            </form>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Email Status</h2>
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              {resendApiKey ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">Resend Connected</p>
                <p className="text-sm text-muted-foreground">
                  {resendApiKey ? 'API key is configured' : 'No API key configured'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
