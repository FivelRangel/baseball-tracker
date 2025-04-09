// Este servicio simula un servidor Socket.IO para la demo
// En una aplicación real, esto sería reemplazado por un servidor real

import type { GameState } from "./game-store"

// Almacén de estados de juego
const gameStates: Record<string, GameState> = {}

// Función para simular la emisión de eventos a todos los clientes
export function broadcastGameState(gameId: string, gameState: GameState): void {
  // En un servidor real, esto emitiría a todos los clientes en la sala del juego
  console.log(`[MOCK SERVER] Broadcasting game state for game ${gameId}`)

  // Almacenar el estado del juego (deep clone para evitar referencias)
  gameStates[gameId] = JSON.parse(JSON.stringify(gameState))

  // Guardar en localStorage para persistencia entre recargas
  try {
    if (typeof window !== "undefined") {
      const storedGames = JSON.parse(localStorage.getItem("baseballGames") || "{}")
      storedGames[gameId] = JSON.parse(JSON.stringify(gameState))
      localStorage.setItem("baseballGames", JSON.stringify(storedGames))
      console.log(`[MOCK SERVER] Game ${gameId} saved to localStorage`)
    }
  } catch (error) {
    console.error("[MOCK SERVER] Error saving to localStorage:", error)
  }
}

// Función para obtener el estado del juego
export function getGameState(gameId: string): GameState | null {
  // Primero intentar obtener del almacén en memoria
  let gameState = gameStates[gameId] || null

  // Si no está en memoria, intentar recuperar de localStorage
  if (!gameState && typeof window !== "undefined") {
    try {
      const storedGames = JSON.parse(localStorage.getItem("baseballGames") || "{}")
      if (storedGames[gameId]) {
        gameState = storedGames[gameId]
        // Guardar en memoria para futuros accesos
        gameStates[gameId] = gameState
        console.log(`[MOCK SERVER] Game ${gameId} loaded from localStorage`)
      }
    } catch (error) {
      console.error("[MOCK SERVER] Error loading from localStorage:", error)
    }
  }

  if (!gameState) {
    console.log(`[MOCK SERVER] Game ${gameId} not found in storage`)
    console.log(`[MOCK SERVER] Available games in memory: ${Object.keys(gameStates).join(", ") || "none"}`)

    // Log localStorage games if available
    if (typeof window !== "undefined") {
      try {
        const storedGames = JSON.parse(localStorage.getItem("baseballGames") || "{}")
        console.log(`[MOCK SERVER] Available games in localStorage: ${Object.keys(storedGames).join(", ") || "none"}`)
      } catch (error) {
        console.error("[MOCK SERVER] Error checking localStorage:", error)
      }
    }
  }

  return gameState
}

// Función para simular la creación de un juego
export function createGame(gameId: string, initialState: GameState): void {
  console.log(`[MOCK SERVER] Creating game ${gameId}`)

  // Deep clone para evitar referencias
  const gameState = JSON.parse(JSON.stringify(initialState))
  gameStates[gameId] = gameState

  // Guardar en localStorage para persistencia
  try {
    if (typeof window !== "undefined") {
      const storedGames = JSON.parse(localStorage.getItem("baseballGames") || "{}")
      storedGames[gameId] = gameState
      localStorage.setItem("baseballGames", JSON.stringify(storedGames))
      console.log(`[MOCK SERVER] Game ${gameId} created and saved to localStorage`)
    }
  } catch (error) {
    console.error("[MOCK SERVER] Error saving to localStorage:", error)
  }
}

// Función para simular la unión a un juego
export function joinGame(gameId: string): GameState | null {
  console.log(`[MOCK SERVER] Joining game ${gameId}`)
  return getGameState(gameId)
}

// Exportar funciones para uso en la aplicación
export const mockSocketService = {
  broadcastGameState,
  getGameState,
  createGame,
  joinGame,
}
