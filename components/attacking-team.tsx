"use client"

import { useGameStore } from "@/lib/game-store"

export default function AttackingTeam() {
  const { gameState } = useGameStore()

  const attackingTeam = gameState.isTopInning ? gameState.awayTeam : gameState.homeTeam

  return (
    <div className="bg-baseball-red text-white p-3 rounded-md text-center">
      <div className="text-sm uppercase font-medium">Al Bate</div>
      <div className="text-3xl font-bebas">{attackingTeam.name}</div>
    </div>
  )
}
