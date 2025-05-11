import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BeerIcon as Baseball } from "lucide-react"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-baseball-white to-baseball-gray">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <span className="text-6xl">🥎</span>
          </div>
          <h1 className="text-5xl font-bebas text-baseball-blue mb-2">STRIKES & BALLS</h1>
          <p className="text-xl text-baseball-red font-bebas mb-4">Tu pizarra digital</p>
          <p className="text-gray-600 mb-8">
            Track children's baseball games in real-time with a dedicated admin panel and spectator view
          </p>

          <div className="space-y-4">
            <Link href="/admin/setup" className="block w-full">
              <Button className="w-full bg-baseball-red hover:bg-red-700 text-lg py-6">Start New Game (Admin)</Button>
            </Link>

            <Link href="/spectator" className="block w-full">
              <Button
                variant="outline"
                className="w-full border-baseball-blue text-baseball-blue hover:bg-baseball-gray text-lg py-6"
              >
                Join as Spectator
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-baseball-blue text-white p-4 text-center text-sm">
          Real-time updates • No login required • Mobile friendly
        </div>
      </div>

      <Footer />
    </main>
  )
}
