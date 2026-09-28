import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { ArrowLeft, Mail, Phone, Globe, MapPin, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'

interface LeadDetailPageProps {
  createMode?: boolean
}

export function LeadDetailPage({ createMode = false }: LeadDetailPageProps) {
  void createMode
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<typeof lead>) => {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => navigate('/leads'),
  })

  const handleStatusChange = async (newStatus: string) => {
    await updateMutation.mutateAsync({ status: newStatus })
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteMutation.mutateAsync()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Lead not found</h2>
        <Button asChild variant="outline">
          <Link to="/leads">Back to Leads</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/leads">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{lead.business_name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDelete} disabled={deleteMutation.isPending}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.email || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.phone || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Website</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {lead.website}
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.location || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              {lead.industry && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Industry</Label>
                  <span>{lead.industry}</span>
                </div>
              )}
              
              {lead.description && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Description</Label>
                  <p className="text-sm">{lead.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Status</Label>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="new">New</option>
                  <option value="selected">Selected</option>
                  <option value="contacted">Contacted</option>
                  <option value="delivered">Delivered</option>
                  <option value="opened">Opened</option>
                  <option value="clicked">Clicked</option>
                  <option value="replied">Replied</option>
                  <option value="bounced">Bounced</option>
                  <option value="opted_out">Opted Out</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outreach History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Campaign: Fashion Brands - Benin</p>
                    <p className="text-sm text-muted-foreground">✓ Sent - 3:42 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email delivered</p>
                    <p className="text-sm text-muted-foreground">✓ Delivered - 3:43 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      👁
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email opened</p>
                    <p className="text-sm text-muted-foreground">Open detected - 3:51 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                      🔗
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Link clicked</p>
                    <p className="text-sm text-muted-foreground">Clicked - 3:53 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reply received</p>
                    <p className="text-sm text-muted-foreground">↩ Replied - 4:07 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
