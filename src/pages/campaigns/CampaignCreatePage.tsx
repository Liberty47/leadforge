import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent } from '../../components/ui/Card'
import { ArrowLeft, Users, Mail, Sparkles, CheckCircle2 } from 'lucide-react'

export function CampaignCreatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    baseSubject: '',
    baseEmail: '',
    personalizationLevel: 'balanced' as 'light' | 'balanced' | 'deep',
  })

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 7))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleCreate = async () => {
    // In a real app, this would create the campaign
    console.log('Creating campaign:', formData)
    navigate('/campaigns')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create Campaign</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Step {step} of 7</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`w-8 h-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Step 1: Campaign Name */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Campaign Name</h3>
                    <p className="text-sm text-muted-foreground">Give your campaign a descriptive name</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Fashion Brands - Benin"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Select Leads */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Select Leads</h3>
                    <p className="text-sm text-muted-foreground">Choose which leads to include in this campaign</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg text-center text-muted-foreground">
                  <p>Lead selection will be available in the next iteration</p>
                </div>
              </div>
            )}

            {/* Step 3: Write Email */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email Content</h3>
                    <p className="text-sm text-muted-foreground">Write your base email content</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.baseSubject}
                    onChange={(e) => setFormData({ ...formData, baseSubject: e.target.value })}
                    placeholder="Email subject line"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Body</Label>
                  <textarea
                    id="email"
                    className="w-full min-h-40 p-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.baseEmail}
                    onChange={(e) => setFormData({ ...formData, baseEmail: e.target.value })}
                    placeholder="Hello {business_name},&#10;&#10;..."
                  />
                  <div className="text-sm text-muted-foreground">
                    Use <code className="bg-muted px-1 rounded">{'{business_name}'}</code> for personalization
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Personalization Settings */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Personalization Level</h3>
                    <p className="text-sm text-muted-foreground">How much AI should personalize the emails</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'light', label: 'Light', desc: 'Keep original email almost unchanged' },
                    { value: 'balanced', label: 'Balanced', desc: 'Rewrite naturally while maintaining intent' },
                    { value: 'deep', label: 'Deep', desc: 'Use business info for strongly personalized emails' },
                  ].map((level) => (
                    <div
                      key={level.value}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.personalizationLevel === level.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary'
                      }`}
                      onClick={() => setFormData({ ...formData, personalizationLevel: level.value as any })}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.personalizationLevel === level.value
                              ? 'border-primary'
                              : 'border-input'
                          }`}
                        >
                          {formData.personalizationLevel === level.value && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{level.label}</p>
                          <p className="text-sm text-muted-foreground">{level.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Generate */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Generating Personalized Emails</h3>
                    <p className="text-sm text-muted-foreground">AI is creating personalized emails for each lead</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="animate-pulse w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="text-muted-foreground">This may take a moment...</p>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Review Emails</h3>
                    <p className="text-sm text-muted-foreground">Review and approve emails before sending</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg text-center text-muted-foreground">
                  <p>Review interface will be available in the next iteration</p>
                </div>
              </div>
            )}

            {/* Step 7: Approve & Send */}
            {step === 7 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Ready to Send</h3>
                    <p className="text-sm text-muted-foreground">Approve emails to start sending</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg text-center text-muted-foreground">
                  <p>Campaign ready for final approval</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <div className="flex gap-2">
            {step < 7 && (
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                Back
              </Button>
            )}
            {step < 7 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleCreate}>Create Campaign</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

