"use client"

type BallsStrikesOutsProps = {
  balls: number
  strikes: number
  outs: number
}

export default function BallsStrikesOuts({ balls, strikes, outs }: BallsStrikesOutsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-white p-2 rounded-md border">
        <div className="text-xs text-gray-500 mb-1">Balls</div>
        <div className="flex space-x-1">
          <div className={`count-indicator ${balls >= 1 ? "count-active" : "count-inactive"}`}></div>
          <div className={`count-indicator ${balls >= 2 ? "count-active" : "count-inactive"}`}></div>
          <div className={`count-indicator ${balls >= 3 ? "count-active" : "count-inactive"}`}></div>
          <div className={`count-indicator ${balls >= 4 ? "count-active" : "count-inactive"}`}></div>
        </div>
      </div>

      <div className="bg-white p-2 rounded-md border">
        <div className="text-xs text-gray-500 mb-1">Strikes</div>
        <div className="flex space-x-1">
          <div className={`count-indicator ${strikes >= 1 ? "count-active" : "count-inactive"}`}></div>
          <div className={`count-indicator ${strikes >= 2 ? "count-active" : "count-inactive"}`}></div>
          <div className={`count-indicator ${strikes >= 3 ? "count-active" : "count-inactive"}`}></div>
        </div>
      </div>

      <div className="bg-white p-2 rounded-md border">
        <div className="text-xs text-gray-500 mb-1">Outs</div>
        <div className="flex space-x-1">
          <div className={`count-indicator ${outs >= 1 ? "count-active" : "count-inactive"}`}></div>
          <div className={`count-indicator ${outs >= 2 ? "count-active" : "count-inactive"}`}></div>
          <div className={`count-indicator ${outs >= 3 ? "count-active" : "count-inactive"}`}></div>
        </div>
      </div>
    </div>
  )
}
