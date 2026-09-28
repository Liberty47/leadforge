import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

export function SettingsIntegrationsPage() {
  const integrations = [
    {
      name: 'Supabase',
      description: 'Database and authentication',
      connected: true,
      url: 'https://supabase.com',
    },
    {
      name: 'Serper',
      description: 'Lead discovery via Google search',
      connected: false,
      url: 'https://serper.dev',
    },
    {
      name: 'OpenRouter',
      description: 'AI email personalization',
      connected: false,
      url: 'https://openrouter.ai',
    },
    {
      name: 'Resend',
      description: 'Email sending',
      connected: false,
      url: 'https://resend.com',
    },
    {
      name: 'Telegram',
      description: 'External notifications',
      connected: false,
      url: 'https://telegram.org',
    },
    {
      name: 'WhatsApp',
      description: 'External notifications',
      connected: false,
      url: 'https://whatsapp.com/business',
    },
    {
      name: 'TikTok',
      description: 'Notifications (not available)',
      connected: false,
      disabled: true,
      url: 'https://tiktok.com',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your third-party services to enable full functionality
        </p>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {integration.name === 'Supabase' && <span className="text-primary font-bold">S</span>}
                    {integration.name === 'Serper' && <span className="text-primary font-bold">S</span>}
                    {integration.name === 'OpenRouter' && <span className="text-primary font-bold">O</span>}
                    {integration.name === 'Resend' && <span className="text-primary font-bold">R</span>}
                    {integration.name === 'Telegram' && <span className="text-primary font-bold">T</span>}
                    {integration.name === 'WhatsApp' && <span className="text-primary font-bold">W</span>}
                    {integration.name === 'TikTok' && <span className="text-primary font-bold">T</span>}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {integration.connected ? (
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Connected</span>
                    </div>
                  ) : integration.disabled ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Not available</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">Not connected</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-end gap-2">
                {integration.connected ? (
                  <Button variant="outline" asChild>
                    <a href={integration.url} target="_blank" rel="noopener noreferrer">
                      Manage
                    </a>
                  </Button>
                ) : integration.disabled ? (
                  <Button variant="outline" disabled>
                    Configure
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to={integration.name === 'Serper' ? '/settings/email' : integration.name === 'OpenRouter' ? '/settings/ai' : integration.name === 'Resend' ? '/settings/email' : '/settings/notifications'}>
                      Configure
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Demo Mode</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center mt-1">
              <span className="text-amber-500 font-bold">!</span>
            </div>
            <div className="space-y-2 flex-1">
              <p className="text-sm">
                Lead Forge is currently running in demo mode because not all API keys are configured.
                <br />
                The application will use mock data for testing purposes.
              </p>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link to="/settings">Configure Integrations</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
