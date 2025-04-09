"use client"

import type React from "react"
import { createContext, useContext, useState, useRef } from "react"
import { useGameStore } from "./game-store"
import { fetchGameState, updateGameStatePolling, generateGameId } from "./polling-service"

type GameContextType = {
  gameId: string | null
  createGame: () => void
  joinGame: (id: string) => void
  updateGame: () => Promise<void>
  lastUpdate: Date | null
  isPolling: boolean
  setIsPolling: (polling: boolean) => void
}

const GameContext = createContext<GameContextType>({
  gameId: null,
  createGame: () => {},
  joinGame: () => {},
  updateGame: async () => {},
  lastUpdate: null,
  isPolling: true,
  setIsPolling: () => {},
})

export const useGame = () => useContext(GameContext)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameId, setGameId] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const { updateGameState, gameState } = useGameStore()
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const previousGameId = useRef<string | null>(null)

  // Función para crear un nuevo juego
  const createGame = () => {
    const newGameId = generateGameId()
    console.log("[POLLING] Creating new game with ID:", newGameId)
    setGameId(newGameId)

    // Guardar el gameId en el store
    if (gameState.gameId !== newGameId) {
      updateGameState({ gameId: newGameId })
    }
  }

  // Función para unirse a un juego existente
  const joinGame = (id: string) => {
    // Evitar unirse al mismo juego múltiples veces
    if (previousGameId.current === id) {
      return
    }

    console.log("[POLLING] Joining game with ID:", id)
    previousGameId.current = id
    setGameId(id)

    // Guardar el gameId en el store
    if (gameState.gameId !== id) {
      updateGameState({ gameId: id })
    }
  }

  // Función para actualizar manualmente el estado del juego
  const updateGame = async () => {
    if (!gameId) return

    try {
      if (gameState.isGameActive) {
        // Si el juego está activo y somos el administrador, enviamos actualizaciones
        await updateGameStatePolling(gameId, gameState)
      } else {
        // Si somos espectador o el juego no está activo, solicitamos actualizaciones
        const updatedState = await fetchGameState(gameId)
        if (updatedState) {
          updateGameState(updatedState)
        }
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error("[POLLING] Error updating game:", error)
    }
  }

  return (
    <GameContext.Provider
      value={{
        gameId,
        createGame,
        joinGame,
        updateGame,
        lastUpdate,
        isPolling,
        setIsPolling,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
