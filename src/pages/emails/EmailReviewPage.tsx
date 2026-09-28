import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLeadsStore } from '../../store/leads'
import { useCampaignsStore } from '../../store/campaigns'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ArrowLeft, Mail, CheckCircle2, XCircle, RefreshCw, Edit3 } from 'lucide-react'

export function EmailReviewPage() {
  const navigate = useNavigate()
  const { leads } = useLeadsStore()
  const { campaigns } = useCampaignsStore()

  // Demo emails for review
  const demoEmails = [
    {
      id: 'email-1',
      leadId: 'lead-1',
      leadName: 'Royal Stitch',
      leadEmail: 'hello@royalstitch.com',
      campaignId: 'camp-1',
      campaignName: 'Fashion Brands - Benin',
      subject: 'Elevate Royal Stitch with Our Services',
      body: 'Hello Royal Stitch,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
      status: 'pending_review',
      aiSummary: 'Light personalization applied to business name',
    },
    {
      id: 'email-2',
      leadId: 'lead-2',
      leadName: 'Bella Couture',
      leadEmail: 'contact@bellacouture.com',
      campaignId: 'camp-1',
      campaignName: 'Fashion Brands - Benin',
      subject: 'Partner Opportunity for Bella Couture',
      body: 'Hello Bella Couture,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
      status: 'pending_review',
      aiSummary: 'Light personalization applied to business name',
    },
    {
      id: 'email-3',
      leadId: 'lead-3',
      leadName: 'Prime Fashion',
      leadEmail: 'info@primefashion.ng',
      campaignId: 'camp-1',
      campaignName: 'Fashion Brands - Benin',
      subject: 'Fashion Growth for Prime Fashion',
      body: 'Hello Prime Fashion,\n\nI noticed your work in the fashion industry and wanted to connect. We offer specialized services that could help grow your brand.\n\nWould you be open to a brief conversation?\n\nBest regards,\nLead Forge Team',
      status: 'pending_review',
      aiSummary: 'Light personalization applied to business name',
    },
  ]

  const [selectedEmail, setSelectedEmail] = useState(demoEmails[0])
  const [reviewedCount, setReviewedCount] = useState(0)
  const [totalEmails] = useState(demoEmails.length)

  const handleApprove = () => {
    setReviewedCount((prev) => prev + 1)
    // In real app, mark email as approved
    const currentIndex = demoEmails.findIndex((e) => e.id === selectedEmail.id)
    if (currentIndex < demoEmails.length - 1) {
      setSelectedEmail(demoEmails[currentIndex + 1])
    }
  }

  const handleReject = () => {
    setReviewedCount((prev) => prev + 1)
    // In real app, mark email as rejected
    const currentIndex = demoEmails.findIndex((e) => e.id === selectedEmail.id)
    if (currentIndex < demoEmails.length - 1) {
      setSelectedEmail(demoEmails[currentIndex + 1])
    }
  }

  const handleRegenerate = () => {
    // In real app, regenerate email with AI
    console.log('Regenerating email:', selectedEmail.id)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Review Emails</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {reviewedCount} / {totalEmails} reviewed
          </div>
          <Button variant="outline" size="sm">Approve All</Button>
          <Button variant="outline" size="sm">Reject All</Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Lead List */}
        <div className="w-1/3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Leads ({demoEmails.length})</h2>
          </div>
          <div className="space-y-2">
            {demoEmails.map((email) => (
              <div
                key={email.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedEmail.id === email.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{email.leadName}</span>
                  <Badge variant={email.status === 'approved' ? 'success' : 'warning'}>
                    {email.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{email.leadEmail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email Preview */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-medium">{selectedEmail.leadEmail}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedEmail.leadName}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedEmail.campaignName}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Subject</label>
                <div className="p-3 rounded-lg border bg-background">
                  <p className="font-medium">{selectedEmail.subject}</p>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase">Email Body</label>
                <div className="p-3 rounded-lg border bg-background whitespace-pre-wrap flex-1 overflow-auto">
                  {selectedEmail.body}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">AI Personalization Summary</label>
                <p className="text-sm">{selectedEmail.aiSummary}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleRegenerate} disabled>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button variant="outline" onClick={handleReject}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <div className="flex-1" />
                <Button onClick={handleApprove} disabled={reviewedCount === totalEmails}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
