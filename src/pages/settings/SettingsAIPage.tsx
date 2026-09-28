import React, { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent } from '../../components/ui/Card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function SettingsAIPage() {
  const [api_key, set_api_key] = useState('')
  const [defaultModel, setDefaultModel] = useState('openai/gpt-3.5-turbo')
  const [personalizationLevel, setPersonalizationLevel] = useState<'light' | 'balanced' | 'deep'>('balanced')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, save settings
    console.log('Saving AI settings:', { api_key, defaultModel, personalizationLevel })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">OpenRouter Configuration</h2>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-amber-500">
                    Your OpenRouter API key is stored securely. Never share it with anyone.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get your API key from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai</a>
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api_key">OpenRouter API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={api_key}
                  onChange={(e) => set_api_key(e.target.value)}
                  placeholder="sk-or-..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Default Model</Label>
                <select
                  id="model"
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="openai/gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
                  <option value="openai/gpt-4">OpenAI GPT-4</option>
                  <option value="anthropic/claude-2">Anthropic Claude 2</option>
                  <option value="anthropic/claude-instant-v1">Anthropic Claude Instant</option>
                  <option value="google/palm-2">Google PaLM 2</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Default Personalization Level</Label>
                <div className="space-y-2">
                  {[
                    { value: 'light', label: 'Light', desc: 'Minimal changes to original email' },
                    { value: 'balanced', label: 'Balanced', desc: 'Natural rewriting with moderate personalization' },
                    { value: 'deep', label: 'Deep', desc: 'Strong personalization using business info' },
                  ].map((level) => (
                    <label key={level.value} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                      <div className="flex items-center gap-2 mt-0.5">
                        <input
                          type="radio"
                          name="level"
                          value={level.value}
                          checked={personalizationLevel === level.value as any}
                          onChange={() => setPersonalizationLevel(level.value as any)}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{level.label}</p>
                        <p className="text-sm text-muted-foreground">{level.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit">Save AI Settings</Button>
            </form>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">AI Status</h2>
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              {api_key ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">OpenRouter Connected</p>
                <p className="text-sm text-muted-foreground">
                  {api_key ? 'API key is configured' : 'No API key configured'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
