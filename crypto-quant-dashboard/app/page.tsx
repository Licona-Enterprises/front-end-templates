import TokenPriceTable from './components/TokenPriceTable'
import WeekHighLowVisual from './components/WeekHighLowVisual'
import ReturnMetricsTable from './components/ReturnMetricsTable'
import Heatmap from './components/Heatmap'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-1">
        <TokenPriceTable />
      </div>
      <div className="lg:col-span-1">
        <WeekHighLowVisual />
      </div>
      <div className="lg:col-span-1">
        <ReturnMetricsTable />
      </div>
      <div className="lg:col-span-1">
        <Heatmap />
      </div>
    </div>
  )
}

