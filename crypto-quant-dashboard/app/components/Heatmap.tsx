import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const tokens = [
  { name: "Bitcoin", symbol: "BTC", marketCap: 1000000000000, trend: 2.5 },
  { name: "Ethereum", symbol: "ETH", marketCap: 400000000000, trend: -1.8 },
  { name: "Binance Coin", symbol: "BNB", marketCap: 100000000000, trend: 0.5 },
  { name: "Cardano", symbol: "ADA", marketCap: 50000000000, trend: -3.2 },
  { name: "XRP", symbol: "XRP", marketCap: 40000000000, trend: 1.7 },
  { name: "Solana", symbol: "SOL", marketCap: 30000000000, trend: -2.1 },
  { name: "Polkadot", symbol: "DOT", marketCap: 25000000000, trend: 0.8 },
  { name: "Dogecoin", symbol: "DOGE", marketCap: 20000000000, trend: -1.5 },
  { name: "Avalanche", symbol: "AVAX", marketCap: 15000000000, trend: 3.2 },
  { name: "Chainlink", symbol: "LINK", marketCap: 10000000000, trend: -0.7 },
]

function HeatmapBox({ token }: { token: typeof tokens[0] }) {
  const size = Math.sqrt(token.marketCap) / 5000000 // Adjusted for better visibility
  const color = token.trend >= 0 
    ? `rgba(42, 157, 143, ${Math.min(0.8, Math.abs(token.trend) / 5 + 0.2)})`
    : `rgba(230, 57, 70, ${Math.min(0.8, Math.abs(token.trend) / 5 + 0.2)})`

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div 
            className="rounded"
            style={{ 
              width: `${size}px`, 
              height: `${size}px`, 
              backgroundColor: color 
            }}
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{token.name} ({token.symbol})</p>
          <p>Market Cap: ${token.marketCap.toLocaleString()}</p>
          <p>Trend: {token.trend.toFixed(2)}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function Heatmap() {
  return (
    <Card className="bg-gray-900 h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-gray-200">Market Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <div className="flex flex-wrap gap-1 justify-center items-center h-full">
          {tokens.map((token) => (
            <HeatmapBox key={token.symbol} token={token} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

