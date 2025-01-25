export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] py-4 mt-8">
      <div className="container mx-auto px-4">
        <p className="text-sm text-center mb-2">
          Disclaimer: This dashboard is for informational purposes only. Cryptocurrency investments carry high risk.
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}

