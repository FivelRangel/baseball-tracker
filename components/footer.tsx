import { BeerIcon as Baseball } from "lucide-react"

export default function Footer() {
  return (
    <div className="mt-8 text-center text-gray-500 text-sm pb-4 flex flex-col items-center">
      <div className="flex items-center justify-center mb-2">
        <Baseball className="h-4 w-4 text-baseball-red mr-1" />
        <span className="font-bebas">STRIKES & BALLS</span>
      </div>
      <div>Tu pizarra digital</div>
    </div>
  )
}
