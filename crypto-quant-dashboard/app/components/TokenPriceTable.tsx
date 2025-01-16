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
  { name: "Bitcoin", symbol: "BTC", price: 50000, marketCap: 1000000000000, volume: 50000000000, low: 40000, high: 60000 },
  { name: "Ethereum", symbol: "ETH", price: 3000, marketCap: 400000000000, volume: 20000000000, low: 2000, high: 4000 },
  { name: "Binance Coin", symbol: "BNB", price: 400, marketCap: 100000000000, volume: 5000000000, low: 300, high: 500 },
]

export default function TokenPriceTable() {
  return (
    <Card className="bg-gray-900 h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-gray-200">Token Prices</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-auto">
        <Table className="text-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.symbol} className="hover:bg-gray-800">
                <TableCell>{token.name}</TableCell>
                <TableCell>${token.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export { tokens }

