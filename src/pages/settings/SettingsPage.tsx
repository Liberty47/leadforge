import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Activity, Mail, Sparkles, Bell, Settings as SettingsIcon, Globe } from 'lucide-react'

export function SettingsPage() {
  const location = useLocation()

  const settingsTabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'ai', label: 'AI', icon: Sparkles },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {settingsTabs.map((tab) => {
            const isActive = location.pathname === `/settings/${tab.id}` || (tab.id === 'general' && location.pathname === '/settings')
            return (
              <Link
                key={tab.id}
                to={`/settings/${tab.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {settingsTabs.find((t) => location.pathname === `/settings/${t.id}` || (t.id === 'general' && location.pathname === '/settings'))?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
