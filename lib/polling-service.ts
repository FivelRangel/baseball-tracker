import { mockSocketService } from "./mock-socket-service"
import type { GameState } from "./game-store"

// Intervalo de polling en milisegundos (5 segundos)
export const POLLING_INTERVAL = 5000

// Función para determinar si estamos en producción
const isProduction = process.env.NODE_ENV === "production"

// Función para obtener el estado del juego mediante polling
export async function fetchGameState(gameId: string): Promise<GameState | null> {
  try {
    console.log(`[POLLING] Fetching game state for game ${gameId}`)

    if (isProduction) {
      // En producción, usar la API
      const response = await fetch(`/api/games?gameId=${gameId}`)

      if (!response.ok) {
        console.error(`[POLLING] API error: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()

      if (!data.success) {
        console.error(`[POLLING] API error: ${data.error}`)
        return null
      }

      return data.gameState
    } else {
      // En desarrollo, usar el servicio mock
      const gameState = mockSocketService.getGameState(gameId)

      // Simular un pequeño retraso como en una llamada de red real
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!gameState) {
        console.log(`[POLLING] No game state found for game ${gameId}`)
      }

      return gameState
    }
  } catch (error) {
    console.error("[POLLING] Error fetching game state:", error)
    return null
  }
}

// Función para unirse a un juego (simulación)
export async function joinGamePolling(gameId: string): Promise<GameState | null> {
  try {
    console.log(`[POLLING] Joining game ${gameId}`)

    if (isProduction) {
      // En producción, usar la API
      return await fetchGameState(gameId)
    } else {
      // En desarrollo, usar el servicio mock
      const gameState = mockSocketService.joinGame(gameId)

      // Simular un pequeño retraso como en una llamada de red real
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!gameState) {
        console.log(`[POLLING] No game state found when joining game ${gameId}`)
      }

      return gameState
    }
  } catch (error) {
    console.error("[POLLING] Error joining game:", error)
    return null
  }
}

// Función para crear un nuevo juego (simulación)
export async function createGamePolling(gameId: string, initialState: GameState): Promise<boolean> {
  try {
    console.log(`[POLLING] Creating game ${gameId}`)

    if (isProduction) {
      // En producción, usar la API
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, gameState: initialState }),
      })

      if (!response.ok) {
        console.error(`[POLLING] API error: ${response.status} ${response.statusText}`)
        return false
      }

      const data = await response.json()
      return data.success
    } else {
      // En desarrollo, usar el servicio mock
      mockSocketService.createGame(gameId, initialState)

      // Simular un pequeño retraso como en una llamada de red real
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    }
  } catch (error) {
    console.error("[POLLING] Error creating game:", error)
    return false
  }
}

// Función para actualizar el estado del juego (simulación)
export async function updateGameStatePolling(gameId: string, gameState: GameState): Promise<boolean> {
  try {
    console.log(`[POLLING] Updating game state for game ${gameId}`)

    if (isProduction) {
      // En producción, usar la API
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, gameState }),
      })

      if (!response.ok) {
        console.error(`[POLLING] API error: ${response.status} ${response.statusText}`)
        return false
      }

      const data = await response.json()
      return data.success
    } else {
      // En desarrollo, usar el servicio mock
      mockSocketService.broadcastGameState(gameId, gameState)

      // Simular un pequeño retraso como en una llamada de red real
      await new Promise((resolve) => setTimeout(resolve, 300))

      return true
    }
  } catch (error) {
    console.error("[POLLING] Error updating game state:", error)
    return false
  }
}

// Generar un ID de juego aleatorio
export function generateGameId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Verificar si un juego existe (simulación)
export async function checkGameExists(gameId: string): Promise<boolean> {
  try {
    console.log(`[POLLING] Checking if game ${gameId} exists`)

    if (isProduction) {
      // En producción, usar la API
      const response = await fetch(`/api/games/exists?gameId=${gameId}`)

      if (!response.ok) {
        console.error(`[POLLING] API error: ${response.status} ${response.statusText}`)
        return false
      }

      const data = await response.json()
      return data.success && data.exists
    } else {
      // Para nuestra demo, usamos el servicio mock
      const gameState = mockSocketService.getGameState(gameId)

      // Simular un pequeño retraso como en una llamada de red real
      await new Promise((resolve) => setTimeout(resolve, 200))

      return gameState !== null
    }
  } catch (error) {
    console.error("[POLLING] Error checking if game exists:", error)
    return false
  }
}
