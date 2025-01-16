import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-[#2C3E50] py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            <Link href="/" className="text-gray-200 hover:text-gray-300">
              Crypto Quant Metrics Dashboard
            </Link>
          </h1>
          <nav className="flex space-x-4 mb-4 md:mb-0">
            <Button variant="ghost" asChild>
              <Link href="/">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/analytics">Analytics</Link>
            </Button>
            <Button variant="ghost">Documentation</Button>
            <Button variant="ghost">Settings</Button>
          </nav>
          <div className="w-full md:w-auto">
            <Input type="search" placeholder="Search tokens..." className="w-full md:w-64" />
          </div>
        </div>
      </div>
    </header>
  )
}

