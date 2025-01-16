import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MultiLineChart from "../components/MultiLineChart"
import MultiBarChart from "../components/MultiBarChart"
import PieChart from "../components/PieChart"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-200">Price Trends</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] aspect-square">
            <MultiLineChart className="w-full h-[300px] sm:h-[400px]" />
          </CardContent>
        </Card>
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-200">Volume Comparison</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] aspect-square">
            <MultiBarChart className="w-full h-[300px] sm:h-[400px]" />
          </CardContent>
        </Card>
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-200">Market Share</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] aspect-square">
            <PieChart className="w-full h-[300px] sm:h-[400px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

