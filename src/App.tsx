import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useActivationStore } from './store/activation'
import { ActivationScreen } from './pages/activation/ActivationScreen'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { LeadsPage } from './pages/leads/LeadsPage'
import { LeadDetailPage } from './pages/leads/LeadDetailPage'
import { LeadSearchPage } from './pages/lead-search/LeadSearchPage'
import { CampaignsPage } from './pages/campaigns/CampaignsPage'
import { CampaignCreatePage } from './pages/campaigns/CampaignCreatePage'
import { CampaignDetailPage } from './pages/campaigns/CampaignDetailPage'
import { EmailReviewPage } from './pages/emails/EmailReviewPage'
import { ActivityPage } from './pages/activity/ActivityPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { SettingsGeneralPage } from './pages/settings/SettingsGeneralPage'
import { SettingsAIPage } from './pages/settings/SettingsAIPage'
import { SettingsEmailPage } from './pages/settings/SettingsEmailPage'
import { SettingsNotificationsPage } from './pages/settings/SettingsNotificationsPage'
import { SettingsIntegrationsPage } from './pages/settings/SettingsIntegrationsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { DemoBanner } from './layouts/DashboardLayout'

function App() {
  const { status, checkActivation } = useActivationStore()

  useEffect(() => {
    checkActivation()
  }, [checkActivation])

  if (!status) {
    return (
      <Routes>
        <Route path="/" element={<ActivationScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Check if activation is still valid
  if (!status.isActive) {
    return (
      <Routes>
        <Route path="/" element={<ActivationScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <DemoBanner />
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/find" element={<LeadSearchPage />} />
          <Route path="/leads/new" element={<LeadDetailPage createMode />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/new" element={<CampaignCreatePage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          
          <Route path="/emails/:id" element={<EmailReviewPage />} />
          
          <Route path="/activity" element={<ActivityPage />} />
          
          <Route path="/settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="/settings/general" replace />} />
            <Route path="general" element={<SettingsGeneralPage />} />
            <Route path="ai" element={<SettingsAIPage />} />
            <Route path="email" element={<SettingsEmailPage />} />
            <Route path="notifications" element={<SettingsNotificationsPage />} />
            <Route path="integrations" element={<SettingsIntegrationsPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </DashboardLayout>
    </>
  )
}

export default App
