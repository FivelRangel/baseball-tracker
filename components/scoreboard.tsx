"use client"

import { useGameStore } from "@/lib/game-store"

export default function Scoreboard() {
  const { gameState } = useGameStore()

  // Calculate totals
  const homeTotalRuns = gameState.score.home.reduce((sum, runs) => sum + runs, 0)
  const awayTotalRuns = gameState.score.away.reduce((sum, runs) => sum + runs, 0)

  // Determinar la entrada actual para resaltarla
  const currentInning = gameState.inning - 1 // Índice basado en 0

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="bg-baseball-blue text-white p-2 text-center">
        <h2 className="font-bebas text-2xl">SCOREBOARD</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left font-bebas">TEAM</th>
              {gameState.score.home.map((_, i) => (
                <th key={i} className={`p-2 text-center w-10 font-bebas ${i === currentInning ? "bg-amber-100" : ""}`}>
                  {i + 1}
                </th>
              ))}
              <th className="p-2 text-center w-14 font-bebas bg-gray-200">R</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="p-2 font-medium">{gameState.awayTeam.name}</td>
              {gameState.score.away.map((runs, i) => (
                <td
                  key={i}
                  className={`p-2 text-center ${i === currentInning && gameState.isTopInning ? "bg-amber-50" : ""}`}
                >
                  <div className="scoreboard-digit">{runs}</div>
                </td>
              ))}
              <td className="p-2 text-center bg-gray-100">
                <div className="scoreboard-digit bg-baseball-red">{awayTotalRuns}</div>
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="p-2 font-medium">{gameState.homeTeam.name}</td>
              {gameState.score.home.map((runs, i) => (
                <td
                  key={i}
                  className={`p-2 text-center ${i === currentInning && !gameState.isTopInning ? "bg-amber-50" : ""}`}
                >
                  <div className="scoreboard-digit">{runs}</div>
                </td>
              ))}
              <td className="p-2 text-center bg-gray-100">
                <div className="scoreboard-digit bg-baseball-red">{homeTotalRuns}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
