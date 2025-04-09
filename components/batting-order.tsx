"use client"

import { useGameStore } from "@/lib/game-store"

export default function BattingOrder() {
  const { gameState } = useGameStore()

  const currentTeam = gameState.isTopInning ? gameState.awayTeam : gameState.homeTeam

  return (
    <div className="space-y-1">
      {currentTeam.battingOrder.map((playerId, index) => {
        const player = currentTeam.players.find((p) => p.id === playerId)
        if (!player) return null

        const isCurrent = index === currentTeam.currentBatterIndex

        return (
          <div
            key={player.id}
            className={`flex items-center p-2 rounded-md ${isCurrent ? "bg-baseball-red text-white" : "bg-white"}`}
          >
            <div className="w-6 text-center font-medium">{index + 1}</div>
            <div className="ml-2 flex-1">
              <div className="font-medium">{player.name}</div>
              {player.number && (
                <div className={`text-xs ${isCurrent ? "text-white/80" : "text-gray-500"}`}>#{player.number}</div>
              )}
            </div>
            {isCurrent && (
              <div className="text-xs font-medium bg-white text-baseball-red px-2 py-1 rounded-full">AT BAT</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
