import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Plus, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { CategorySelector } from '../../components/category/CategorySelector'
import { leadSearchService } from '../../services/leadSearch'
import { demoLeads } from '../../lib/demo'

const DEFAULT_CATEGORIES = ['fashion', 'retail', 'beauty', 'restaurants', 'real_estate']

export function LeadSearchPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [resultCount, setResultCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [savedLeads, setSavedLeads] = useState<string[]>([])
  const [selectedForSave, setSelectedForSave] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    
    try {
      const results = await leadSearchService.searchLeads(searchQuery, {
        location: location || undefined,
        limit: resultCount,
      })
      
      setResults(results)
      setShowPreview(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSelection = (businessName: string) => {
    if (selectedForSave.includes(businessName)) {
      setSelectedForSave(selectedForSave.filter(name => name !== businessName))
    } else {
      setSelectedForSave([...selectedForSave, businessName])
    }
  }

  const toggleAll = () => {
    if (selectedForSave.length === results.length) {
      setSelectedForSave([])
    } else {
      setSelectedForSave(results.map(r => r.business_name))
    }
  }

  const handleSaveLeads = async () => {
    // In real app, save to Supabase with duplicate detection
    console.log('Saving leads:', selectedForSave)
    setSavedLeads([...savedLeads, ...selectedForSave])
    setSelectedForSave([])
    setResults([])
    setShowPreview(false)
    
    // Show success message
    alert(`Saved ${selectedForSave.length} leads!`)
    navigate('/leads')
  }

  // Generate search variations
  const generateSearchVariations = (query: string, location: string): string[] => {
    const variations: string[] = []
    const terms = query.toLowerCase().split(' ')
    
    if (terms.length === 0) return variations
    
    // Generate variations based on terms
    const templates = [
      (t: string[]) => `${t.join(' ')} in ${location}`,
      (t: string[]) => `${t[0]} brands in ${location}`,
      (t: string[]) => `${t[0]} businesses in ${location}`,
      (t: string[]) => `${t[0]} companies in ${location}`,
    ]
    
    templates.forEach(template => {
      variations.push(template(terms))
    })
    
    return variations
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/leads">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Find Leads</h1>
        </div>
        <Button variant="outline" asChild>
          <Link to="/leads">Back to Leads</Link>
        </Button>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Search Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Query</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., fashion brands"
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Benin City"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="results">Number of Results</Label>
              <Input
                id="results"
                type="number"
                min="1"
                max="100"
                value={resultCount}
                onChange={(e) => setResultCount(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business Categories</Label>
            <CategorySelector
              selectedCategories={selectedCategories}
              onSelect={setSelectedCategories}
            />
          </div>

          {searchQuery && location && (
            <div className="p-3 bg-muted/30 rounded-lg text-sm">
              <p className="font-medium mb-2">Generated Search Queries:</p>
              <div className="flex flex-wrap gap-2">
                {generateSearchVariations(searchQuery, location).map((q, i) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-xs">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Preview */}
      {showPreview && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results ({results.length})</span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={toggleAll}
                  disabled={results.length === 0}
                >
                  {selectedForSave.length === results.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveLeads}
                  disabled={selectedForSave.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Selected ({selectedForSave.length})
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => {
                const isSaved = savedLeads.includes(result.business_name)
                const isSelected = selectedForSave.includes(result.business_name)

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-colors ${
                      isSelected ? 'bg-primary/5 border-primary' : 'hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(result.business_name)}
                        className="mt-1 rounded border-input"
                        disabled={isSaved}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{result.business_name}</h4>
                          {isSaved && (
                            <Badge variant="success">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Saved
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {result.email && (
                            <div>
                              <span className="text-muted-foreground">Email: </span>
                              <span>{result.email}</span>
                            </div>
                          )}
                          {result.phone && (
                            <div>
                              <span className="text-muted-foreground">Phone: </span>
                              <span>{result.phone}</span>
                            </div>
                          )}
                          {result.website && (
                            <div>
                              <span className="text-muted-foreground">Website: </span>
                              <a href={`https://${result.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {result.website}
                              </a>
                            </div>
                          )}
                          {result.location && (
                            <div>
                              <span className="text-muted-foreground">Location: </span>
                              <span>{result.location}</span>
                            </div>
                          )}
                          {result.industry && (
                            <div>
                              <span className="text-muted-foreground">Industry: </span>
                              <span>{result.industry}</span>
                            </div>
                          )}
                        </div>
                        
                        {result.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {result.description}
                          </p>
                        )}
                        
                        {result.source_url && (
                          <div className="mt-2">
                            <a 
                              href={result.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                            >
                              <Search className="w-3 h-3" />
                              Source
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showPreview && results.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search query or location to find more leads.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
