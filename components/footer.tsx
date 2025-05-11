import { BeerIcon as Baseball } from "lucide-react"

export default function Footer() {
  return (
    <div className="mt-8 text-center text-gray-500 text-sm pb-4 flex flex-col items-center">
      <div className="flex items-center justify-center mb-2">
        <span className="text-baseball-red text-xl mr-1">🥎</span>
        <span className="font-bebas">STRIKES & BALLS</span>
      </div>
      <div>Tu pizarra digital</div>
    </div>
  )
}
