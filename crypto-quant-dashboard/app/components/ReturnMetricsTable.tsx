import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const tokens = [
  { name: "Bitcoin", symbol: "BTC", return24h: 2.5, return7d: -1.2, return30d: 5.8 },
  { name: "Ethereum", symbol: "ETH", return24h: -1.8, return7d: 3.5, return30d: -2.1 },
  { name: "Binance Coin", symbol: "BNB", return24h: 0.7, return7d: -0.5, return30d: 4.2 },
]

function ReturnCell({ value }: { value: number }) {
  const color = value >= 0 ? 'text-green-400' : 'text-red-400'
  return <span className={color}>{value.toFixed(2)}%</span>
}

export default function ReturnMetricsTable() {
  return (
    <Card className="bg-gray-900 h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-gray-200">Return Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-auto">
        <Table className="text-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>24h</TableHead>
              <TableHead>7d</TableHead>
              <TableHead>30d</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.symbol} className="border-gray-800">
                <TableCell>{token.symbol}</TableCell>
                <TableCell><ReturnCell value={token.return24h} /></TableCell>
                <TableCell><ReturnCell value={token.return7d} /></TableCell>
                <TableCell><ReturnCell value={token.return30d} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

