import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tokens } from "./TokenPriceTable"

function HighLowBar({ token }: { token: typeof tokens[0] }) {
  const percentage = ((token.price - token.low) / (token.high - token.low)) * 100

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{token.symbol}</span>
        <span>${token.price.toLocaleString()}</span>
      </div>
      <div className="relative h-2 bg-gray-700 rounded">
        <div
          className="absolute h-full bg-[#2A9D8F] rounded"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>${token.low.toLocaleString()}</span>
        <span>${token.high.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function WeekHighLowVisual() {
  return (
    <Card className="bg-gray-900 h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-gray-200">52-Week High/Low</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {tokens.map((token) => (
          <HighLowBar key={token.symbol} token={token} />
        ))}
      </CardContent>
    </Card>
  )
}

