import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useLeadsStore } from '../../store/leads'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Card, CardContent } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Search, Filter, Plus, MoreVertical, Trash2, Mail } from 'lucide-react'

export function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '')
  const [filterIndustry, setFilterIndustry] = useState(searchParams.get('industry') || '')
  const navigate = useNavigate()

  const { leads, loading, selectedLeads, setSearchParams: setStoreSearchParams, selectLead, deselectLead, selectAllLeads, deselectAllLeads, deleteLead, bulkDeleteLeads } = useLeadsStore()

  useEffect(() => {
    const params: Record<string, string> = {}
    if (searchQuery) params.search = searchQuery
    if (filterStatus) params.status = filterStatus
    if (filterIndustry) params.industry = filterIndustry
    setSearchParams(params)
    setStoreSearchParams({ search: searchQuery, status: filterStatus || undefined, industry: filterIndustry || undefined })
  }, [searchQuery, filterStatus, filterIndustry, setSearchParams, setStoreSearchParams])

  const handleDelete = async (id: string) => {
    await deleteLead(id)
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
      await bulkDeleteLeads(selectedLeads)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const statuses = ['new', 'selected', 'contacted', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'opted_out']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBulkDelete} disabled={selectedLeads.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
          <Button variant="outline" asChild>
            <Link to="/leads/find">Find Leads</Link>
          </Button>
          <Button asChild>
            <Link to="/leads/new">Add Lead</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 pl-10 pr-8 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                placeholder="Industry..."
                className="w-32"
              />
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={leads.length > 0 && selectedLeads.length === leads.length}
                      onChange={(e) => e.target.checked ? selectAllLeads() : deselectAllLeads()}
                      className="rounded border-input"
                    />
                  </th>
                  <th className="p-3">Business</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Website</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      No leads found. Try adjusting your filters or add a new lead.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-accent/50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => e.target.checked ? selectLead(lead.id) : deselectLead(lead.id)}
                          className="rounded border-input"
                        />
                      </td>
                      <td className="p-3">
                        <Link to={`/leads/${lead.id}`} className="font-medium hover:underline">
                          {lead.business_name}
                        </Link>
                      </td>
                      <td className="p-3">{lead.email || '—'}</td>
                      <td className="p-3">{lead.industry || '—'}</td>
                      <td className="p-3">{lead.location || '—'}</td>
                      <td className="p-3">
                        {lead.website ? (
                          <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {lead.website}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="p-3">
                        <Badge variant={
                          lead.status === 'delivered' ? 'success' :
                          lead.status === 'opened' ? 'warning' :
                          lead.status === 'replied' ? 'success' :
                          lead.status === 'bounced' ? 'error' :
                          lead.status === 'opted_out' ? 'error' :
                          'default'
                        }>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/leads/${lead.id}`} className="p-2 hover:bg-accent rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {leads.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {leads.length} of {leads.length} leads
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
