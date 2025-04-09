"use client"

import { useGameStore } from "@/lib/game-store"

export default function ScoreSummary() {
  const { gameState } = useGameStore()

  // Calculate totals
  const homeTotalRuns = gameState.score.home.reduce((sum, runs) => sum + runs, 0)
  const awayTotalRuns = gameState.score.away.reduce((sum, runs) => sum + runs, 0)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4">
      <div className="bg-baseball-blue text-white p-2 text-center">
        <h2 className="font-bebas text-2xl">MARCADOR ACTUAL</h2>
      </div>

      <div className="grid grid-cols-2 divide-x">
        <div className="p-4 text-center">
          <div className="text-sm text-gray-500">LOCAL</div>
          <div className="text-3xl font-bebas text-baseball-blue">{gameState.homeTeam.name}</div>
          <div className="text-5xl font-bebas text-baseball-red mt-2">{homeTotalRuns}</div>
        </div>

        <div className="p-4 text-center">
          <div className="text-sm text-gray-500">VISITANTE</div>
          <div className="text-3xl font-bebas text-baseball-blue">{gameState.awayTeam.name}</div>
          <div className="text-5xl font-bebas text-baseball-red mt-2">{awayTotalRuns}</div>
        </div>
      </div>
    </div>
  )
}
