"use client"

import { type BaseState, useGameStore } from "@/lib/game-store"

type BasesDiamondProps = {
  bases: BaseState
  size?: "small" | "medium" | "large"
  showPlayerInfo?: boolean
}

export default function BasesDiamond({ bases, size = "medium", showPlayerInfo = false }: BasesDiamondProps) {
  const { gameState } = useGameStore()

  const sizeClass = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  }[size]

  // Función para obtener el nombre del jugador por ID
  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return null

    const homePlayer = gameState.homeTeam.players.find((p) => p.id === playerId)
    const awayPlayer = gameState.awayTeam.players.find((p) => p.id === playerId)

    return homePlayer?.name || awayPlayer?.name || null
  }

  return (
    <div className={`relative ${sizeClass}`}>
      {/* Campo de béisbol con césped */}
      <div className="absolute inset-0 bg-green-600 rounded-full opacity-20"></div>

      {/* Infield (tierra) */}
      <div className="absolute inset-[15%] bg-amber-200 rounded-sm opacity-40 rotate-45"></div>

      {/* Home plate */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-2 border-baseball-blue z-10"></div>

      {/* First base */}
      <div
        className={`base absolute top-1/2 right-0 transform translate-x-1/2 translate-y-[-50%] ${bases.first ? "base-occupied" : "base-empty"} z-10`}
      >
        {showPlayerInfo && bases.first && (
          <div className="absolute top-full right-0 mt-1 -rotate-45 bg-white text-xs px-1 py-0.5 rounded whitespace-nowrap shadow-md border border-gray-200">
            {getPlayerName(bases.first)}
          </div>
        )}
      </div>

      {/* Second base */}
      <div
        className={`base absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${bases.second ? "base-occupied" : "base-empty"} z-10`}
      >
        {showPlayerInfo && bases.second && (
          <div className="absolute top-full left-0 mt-1 -rotate-45 bg-white text-xs px-1 py-0.5 rounded whitespace-nowrap shadow-md border border-gray-200">
            {getPlayerName(bases.second)}
          </div>
        )}
      </div>

      {/* Third base */}
      <div
        className={`base absolute top-1/2 left-0 transform -translate-x-1/2 translate-y-[-50%] ${bases.third ? "base-occupied" : "base-empty"} z-10`}
      >
        {showPlayerInfo && bases.third && (
          <div className="absolute bottom-full left-0 mb-1 -rotate-45 bg-white text-xs px-1 py-0.5 rounded whitespace-nowrap shadow-md border border-gray-200">
            {getPlayerName(bases.third)}
          </div>
        )}
      </div>

      {/* Base lines */}
      <div className="absolute w-full h-0.5 top-1/2 transform -translate-y-1/2 bg-baseball-blue z-0"></div>
      <div className="absolute h-full w-0.5 left-1/2 transform -translate-x-1/2 bg-baseball-blue z-0"></div>

      {/* Pitcher's mound */}
      <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-amber-300 border border-baseball-blue z-5"></div>

      {/* Outfield fence */}
      <div className="absolute -inset-4 border-2 border-dashed border-gray-400 rounded-full opacity-30 z-0"></div>
    </div>
  )
}
