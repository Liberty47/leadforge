import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useLeadsStore } from '../../store/leads'
import { Link } from 'react-router-dom'
import { demoLeads, demoCampaigns, demoEmailDrafts, demoActivity } from '../../lib/demo'

interface DashboardStats {
  totalLeads: number
  emailsSent: number
  delivered: number
  opened: number
  clicked: number
  replies: number
}

export function DashboardPage() {
  const fetchLeads = useLeadsStore((state) => state.fetchLeads)

  // Demo data if Supabase not configured
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Return demo stats
        return {
          totalLeads: 1250,
          emailsSent: 486,
          delivered: 451,
          opened: 218,
          clicked: 64,
          replies: 31,
        }
      }

      const user = (await supabase.auth.getUser()).data.user
      if (!user) return null

      // Get leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      // Get emails sent
      const { count: emailsSent } = await supabase
        .from('email_drafts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['sent', 'delivered', 'opened'])

      // Get delivered count
      const { count: delivered } = await supabase
        .from('email_drafts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'delivered')

      // Get opened count
      const { count: opened } = await supabase
        .from('email_drafts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('opened_at', 'is', null)

      // Get clicked count
      const { count: clicked } = await supabase
        .from('email_drafts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('clicked_at', 'is', null)

      // Get replied count
      const { count: replies } = await supabase
        .from('email_drafts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('replied_at', 'is', null)

      return {
        totalLeads: totalLeads || 0,
        emailsSent: emailsSent || 0,
        delivered: delivered || 0,
        opened: opened || 0,
        clicked: clicked || 0,
        replies: replies || 0,
      }
    },
  })

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emailsSent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opened</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.opened}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.replies}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button variant="outline" asChild>
            <Link to="/activity">View All</Link>
          </Button>
        </div>

        <div className="space-y-3">
          {demoActivity.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {activity.event_type === 'email_delivered' && '📧'}
                {activity.event_type === 'email_opened' && '👁'}
                {activity.event_type === 'email_bounced' && '❌'}
              </div>
              <div className="flex-1">
                <p className="font-medium">Royal Stitch</p>
                <p className="text-sm text-muted-foreground">
                  {activity.event_type === 'email_delivered' && 'Email delivered'}
                  {activity.event_type === 'email_opened' && 'Email opened'}
                  {activity.event_type === 'email_bounced' && 'Email bounced'}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">2 minutes ago</span>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <Button asChild>
            <Link to="/campaigns/new">New Campaign</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {demoCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge>{campaign.status.replace('_', ' ')}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leads</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Review</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Approved</span>
                  <span>0</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild size="lg" variant="outline">
            <Link to="/leads/find">Find Leads</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/campaigns/new">Create Campaign</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/emails/review">Review Emails</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
