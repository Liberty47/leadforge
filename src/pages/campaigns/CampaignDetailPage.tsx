import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

export function CampaignDetailPage() {
  const { id } = useParams()

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Campaign ID: {id}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignDetailPage
