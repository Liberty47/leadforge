import React, { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent } from '../../components/ui/Card'
import { AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react'

export function SettingsNotificationsPage() {
  const [telegramEnabled, setTelegramEnabled] = useState(false)
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  
  const [whatsappEnabled, setWhatsAppEnabled] = useState(false)
  const [whatsappToken, setWhatsAppToken] = useState('')
  const [whatsappPhoneNumberId, setWhatsAppPhoneNumberId] = useState('')
  
  const [tiktokEnabled, setTikTokEnabled] = useState(false)
  
  const [notifyOnDelivered, setNotifyOnDelivered] = useState(true)
  const [notifyOnOpened, setNotifyOnOpened] = useState(true)
  const [notifyOnClicked, setNotifyOnClicked] = useState(true)
  const [notifyOnReplied, setNotifyOnReplied] = useState(true)
  const [notifyOnBounced, setNotifyOnBounced] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving notification settings:', {
      telegramEnabled,
      telegramToken,
      telegramChatId,
      whatsappEnabled,
      whatsappToken,
      whatsappPhoneNumberId,
      tiktokEnabled,
      notifyOnDelivered,
      notifyOnOpened,
      notifyOnClicked,
      notifyOnReplied,
      notifyOnBounced,
    })
  }

  const testTelegram = () => {
    console.log('Testing Telegram notification')
    // In real app, send test message
    alert('Test notification sent! Check your Telegram.')
  }

  const testWhatsApp = () => {
    console.log('Testing WhatsApp notification')
    // In real app, send test message
    alert('Test notification sent! Check your WhatsApp.')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Telegram */}
          <div className="space-y-4 border-b pb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Telegram
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={telegramEnabled}
                onChange={(e) => setTelegramEnabled(e.target.checked)}
                className="rounded border-input"
              />
              <span>Enable Telegram Notifications</span>
            </div>
            {telegramEnabled && (
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="telegramToken">Bot Token</Label>
                  <Input
                    id="telegramToken"
                    type="password"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegramChatId">Chat ID</Label>
                  <Input
                    id="telegramChatId"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="-100123456789"
                  />
                </div>
                <Button type="button" variant="outline" onClick={testTelegram}>
                  Test Telegram Notification
                </Button>
              </div>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-4 border-b pb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              WhatsApp
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsAppEnabled(e.target.checked)}
                className="rounded border-input"
              />
              <span>Enable WhatsApp Notifications</span>
            </div>
            {whatsappEnabled && (
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="whatsappToken">Access Token</Label>
                  <Input
                    id="whatsappToken"
                    type="password"
                    value={whatsappToken}
                    onChange={(e) => setWhatsAppToken(e.target.value)}
                    placeholder="EAAG..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappPhoneNumberId">Phone Number ID</Label>
                  <Input
                    id="whatsappPhoneNumberId"
                    value={whatsappPhoneNumberId}
                    onChange={(e) => setWhatsAppPhoneNumberId(e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                <Button type="button" variant="outline" onClick={testWhatsApp}>
                  Test WhatsApp Notification
                </Button>
              </div>
            )}
          </div>

          {/* TikTok */}
          <div className="space-y-4 border-b pb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-black" />
              TikTok
            </h2>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  TikTok notifications are not yet available. The official TikTok API does not provide notification capabilities for this use case.
                </p>
              </div>
            </div>
          </div>

          {/* Event Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Event Preferences</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnDelivered}
                  onChange={(e) => setNotifyOnDelivered(e.target.checked)}
                  className="rounded border-input"
                />
                <span>Email delivered</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnOpened}
                  onChange={(e) => setNotifyOnOpened(e.target.checked)}
                  className="rounded border-input"
                />
                <span>Email opened</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnClicked}
                  onChange={(e) => setNotifyOnClicked(e.target.checked)}
                  className="rounded border-input"
                />
                <span>Link clicked</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnReplied}
                  onChange={(e) => setNotifyOnReplied(e.target.checked)}
                  className="rounded border-input"
                />
                <span>Reply received</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnBounced}
                  onChange={(e) => setNotifyOnBounced(e.target.checked)}
                  className="rounded border-input"
                />
                <span>Email bounced</span>
              </label>
            </div>
          </div>

          <Button type="submit" onClick={handleSave}>Save Notification Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
