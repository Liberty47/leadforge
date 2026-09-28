-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Leads policies
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON leads FOR DELETE
  USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Campaign leads policies
CREATE POLICY "Users can view own campaign leads"
  ON campaign_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_leads.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own campaign leads"
  ON campaign_leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_leads.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own campaign leads"
  ON campaign_leads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_leads.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Email drafts policies
CREATE POLICY "Users can view own email drafts"
  ON email_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email drafts"
  ON email_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email drafts"
  ON email_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own email drafts"
  ON email_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Email events policies
CREATE POLICY "Users can view own email events"
  ON email_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM email_drafts
      WHERE email_drafts.id = email_events.email_draft_id
      AND email_drafts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own email events"
  ON email_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM email_drafts
      WHERE email_drafts.id = email_events.email_draft_id
      AND email_drafts.user_id = auth.uid()
    )
  );

-- Notification settings policies
CREATE POLICY "Users can view own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
  ON notification_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
  ON notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notification events policies
CREATE POLICY "Users can view own notification events"
  ON notification_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notification events"
  ON notification_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Integration settings policies
CREATE POLICY "Users can view own integration settings"
  ON integration_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own integration settings"
  ON integration_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integration settings"
  ON integration_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Activity policies
CREATE POLICY "Users can view own activity"
  ON activity FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activity"
  ON activity FOR INSERT
  WITH CHECK (user_id = auth.uid());
