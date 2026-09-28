import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Search, Filter } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

const demoActivity = [
  {
    id: 'act-1',
    eventType: 'email_delivered',
    leadName: 'Royal Stitch',
    campaignName: 'Fashion Brands - Benin',
    email: 'hello@royalstitch.com',
    timestamp: '2 minutes ago',
    metadata: {},
  },
  {
    id: 'act-2',
    eventType: 'email_opened',
    leadName: 'Bella Couture',
    campaignName: 'Fashion Brands - Benin',
    email: 'contact@bellacouture.com',
    timestamp: '8 minutes ago',
    metadata: {},
  },
  {
    id: 'act-3',
    eventType: 'email_bounced',
    leadName: 'Prime Fashion',
    campaignName: 'Fashion Brands - Benin',
    email: 'info@primefashion.ng',
    timestamp: '22 minutes ago',
    metadata: {},
  },
  {
    id: 'act-4',
    eventType: 'email_sent',
    leadName: 'Urban Thread',
    campaignName: 'Fashion Brands - Benin',
    email: 'team@urbanthread.com',
    timestamp: '1 hour ago',
    metadata: {},
  },
  {
    id: 'act-5',
    eventType: 'lead_created',
    leadName: 'Elegant Styles',
    campaignName: 'New Lead',
    email: 'styling@elegantstyles.com',
    timestamp: '2 hours ago',
    metadata: {},
  },
]

const eventTypes = [
  { value: 'all', label: 'All Events' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'opened', label: 'Opened' },
  { value: 'clicked', label: 'Clicked' },
  { value: 'replied', label: 'Replied' },
  { value: 'bounced', label: 'Bounced' },
  { value: 'failed', label: 'Failed' },
]

export function ActivityPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredActivity = demoActivity.filter((item) => {
    const matchesType = selectedType === 'all' || item.eventType === selectedType
    const matchesSearch = item.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'email_sent': return '📤'
      case 'email_delivered': return '📧'
      case 'email_opened': return '👁'
      case 'email_clicked': return '🔗'
      case 'email_replied': return '↩'
      case 'email_bounced': return '❌'
      case 'email_failed': return '⚠️'
      case 'lead_created': return '👤'
      default: return '📝'
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'email_delivered': return 'success'
      case 'email_opened': return 'warning'
      case 'email_replied': return 'success'
      case 'email_bounced': return 'error'
      case 'email_failed': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activity</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity..."
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-10 pl-10 pr-8 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-3">
            {filteredActivity.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No activity found
              </div>
            ) : (
              filteredActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="mt-1">
                    {getEventIcon(activity.eventType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.leadName}</span>
                        <Badge variant={getEventColor(activity.eventType)}>
                          {activity.eventType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{activity.campaignName}</span>
                      <span>•</span>
                      <span>{activity.email}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredActivity.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredActivity.length} events
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled size="sm">Previous</Button>
                <Button variant="outline" disabled size="sm">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
