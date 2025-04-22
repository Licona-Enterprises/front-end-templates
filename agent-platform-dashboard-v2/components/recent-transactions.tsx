"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"

const transactions = [
  {
    id: "1",
    asset: "ETH",
    type: "buy",
    amount: "1.25 ETH",
    value: "$2,450.75",
    time: "2h ago",
    agent: "DeFi Optimizer",
  },
  {
    id: "2",
    asset: "USDC",
    type: "sell",
    amount: "5,000 USDC",
    value: "$5,000.00",
    time: "5h ago",
    agent: "Stablecoin Manager",
  },
  {
    id: "3",
    asset: "BTC",
    type: "buy",
    amount: "0.15 BTC",
    value: "$4,875.30",
    time: "1d ago",
    agent: "Bitcoin Accumulator",
  },
  {
    id: "4",
    asset: "SOL",
    type: "sell",
    amount: "25 SOL",
    value: "$1,250.00",
    time: "1d ago",
    agent: "Altcoin Trader",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                transaction.type === "buy" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {transaction.type === "buy" ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{transaction.amount}</p>
              <p className="text-xs text-gray-400">{transaction.time}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{transaction.value}</p>
            <p className="text-xs text-gray-400">{transaction.asset}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
