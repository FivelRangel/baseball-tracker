"use client"

import { create } from "zustand"
import { mockSocketService } from "./mock-socket-service"

export type Player = {
  id: string
  name: string
  number?: string
}

export type Team = {
  name: string
  players: Player[]
  battingOrder: string[] // Player IDs in batting order
  currentBatterIndex: number
}

export type BaseState = {
  first: string | null
  second: string | null
  third: string | null
}

export type LastAction = {
  type: string
  previousState: Partial<GameState>
  timestamp: number
}

export type GameState = {
  homeTeam: Team
  awayTeam: Team
  inning: number
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  bases: BaseState
  score: {
    home: number[]
    away: number[]
  }
  isGameActive: boolean
  gameId: string | null
  lastUpdated?: number // Timestamp de la última actualización
  lastAction?: LastAction // Última acción realizada para poder deshacerla
  totalInnings: number // Número total de entradas a jugar
}

type GameStore = {
  gameState: GameState
  updateGameState: (newState: Partial<GameState>) => void
  initializeGame: (homeTeam: Team, awayTeam: Team, totalInnings: number, awayTeamBatsFirst?: boolean) => void
  addBall: () => void
  addStrike: () => void
  addOut: () => void
  resetCount: () => void
  advanceRunner: (from: keyof BaseState | "home", to: keyof BaseState | "home") => void
  returnRunner: (from: keyof BaseState, to: keyof BaseState) => void
  clearBases: () => void
  addRun: () => void
  nextBatter: () => void
  switchSides: () => void
  endGame: () => void
  getCurrentBatterId: () => string | null
  undoLastAction: () => void
  endTeamTurn: () => void // Nueva función para terminar el turno del equipo
  strikeOutRunner: (base: keyof BaseState) => void // Nueva función para ponchar a un corredor específico
  isGameOver: () => boolean // Nueva función para verificar si el juego ha terminado
}

const initialGameState: GameState = {
  homeTeam: {
    name: "",
    players: [],
    battingOrder: [],
    currentBatterIndex: 0,
  },
  awayTeam: {
    name: "",
    players: [],
    battingOrder: [],
    currentBatterIndex: 0,
  },
  inning: 1,
  isTopInning: true,
  balls: 0,
  strikes: 0,
  outs: 0,
  bases: {
    first: null,
    second: null,
    third: null,
  },
  score: {
    home: [0, 0, 0, 0, 0, 0, 0, 0, 0], // Por defecto 9 entradas
    away: [0, 0, 0, 0, 0, 0, 0, 0, 0], // Por defecto 9 entradas
  },
  isGameActive: false,
  gameId: null,
  lastUpdated: Date.now(),
  lastAction: undefined,
  totalInnings: 9, // Por defecto 9 entradas
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialGameState,

  updateGameState: (newState) => {
    set((state) => {
      const updatedState = {
        ...state.gameState,
        ...newState,
        lastUpdated: Date.now(),
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (updatedState.gameId) {
        mockSocketService.broadcastGameState(updatedState.gameId, updatedState)
      }

      return { gameState: updatedState }
    })
  },

  initializeGame: (homeTeam, awayTeam, totalInnings = 9, awayTeamBatsFirst = true) => {
    // Ensure totalInnings doesn't exceed 9
    totalInnings = Math.min(totalInnings, 9)
    set((state) => {
      // Crear arrays de score con la longitud correcta
      const scoreArray = Array(totalInnings).fill(0)

      const updatedState = {
        ...state.gameState,
        homeTeam,
        awayTeam,
        isGameActive: true,
        // Establecer quién batea primero
        isTopInning: awayTeamBatsFirst,
        totalInnings,
        score: {
          home: [...scoreArray],
          away: [...scoreArray],
        },
        lastUpdated: Date.now(),
      }

      // Si tenemos un gameId, simular la creación del juego
      if (updatedState.gameId) {
        mockSocketService.createGame(updatedState.gameId, updatedState)
      }

      return { gameState: updatedState }
    })
  },

  getCurrentBatterId: () => {
    const { gameState } = get()
    const teamKey = gameState.isTopInning ? "awayTeam" : "homeTeam"
    const team = gameState[teamKey]

    if (team.battingOrder.length === 0) return null

    return team.battingOrder[team.currentBatterIndex]
  },

  addBall: () => {
    const { gameState } = get()
    const newBalls = gameState.balls + 1

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      balls: gameState.balls,
      bases: { ...gameState.bases },
      lastAction: gameState.lastAction,
    }

    if (newBalls >= 4) {
      // Walk
      set((state) => {
        const newState = {
          ...state.gameState,
          balls: 0,
          strikes: 0,
          lastUpdated: Date.now(),
          lastAction: {
            type: "Ball (Walk)",
            previousState,
            timestamp: Date.now(),
          },
        }
        const currentBatterId = get().getCurrentBatterId()

        // Move runners if needed
        if (newState.bases.first !== null) {
          if (newState.bases.second !== null) {
            if (newState.bases.third !== null) {
              // Bases loaded, force in a run
              const teamKey = newState.isTopInning ? "away" : "home"
              newState.score[teamKey][newState.inning - 1]++

              // El corredor de tercera anota
              const scoringRunnerId = newState.bases.third
              console.log(`Runner ${scoringRunnerId} scored from third base`)
            } else {
              // First and second occupied, move to third
              newState.bases.third = newState.bases.second
            }
          } else {
            // Only first occupied, move to second
            newState.bases.second = newState.bases.first
          }
        }

        // Batter to first
        newState.bases.first = currentBatterId

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })

      // Advance to next batter (which will also reset the count)
      get().nextBatter()
    } else {
      set((state) => {
        const newState = {
          ...state.gameState,
          balls: newBalls,
          lastUpdated: Date.now(),
          lastAction: {
            type: "Ball",
            previousState,
            timestamp: Date.now(),
          },
        }

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })
    }
  },

  addStrike: () => {
    const { gameState } = get()
    const newStrikes = gameState.strikes + 1

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      strikes: gameState.strikes,
      balls: gameState.balls,
      outs: gameState.outs,
      lastAction: gameState.lastAction,
    }

    if (newStrikes >= 3) {
      // Strikeout
      set((state) => {
        const newState = {
          ...state.gameState,
          strikes: 0,
          balls: 0,
          lastUpdated: Date.now(),
          lastAction: {
            type: "Strike (Strikeout)",
            previousState,
            timestamp: Date.now(),
          },
        }

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })

      get().addOut()
      // This will also reset the count since nextBatter now does that
      get().nextBatter()
    } else {
      set((state) => {
        const newState = {
          ...state.gameState,
          strikes: newStrikes,
          lastUpdated: Date.now(),
          lastAction: {
            type: "Strike",
            previousState,
            timestamp: Date.now(),
          },
        }

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })
    }
  },

  addOut: () => {
    const { gameState } = get()
    const newOuts = gameState.outs + 1

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      outs: gameState.outs,
      lastAction: gameState.lastAction,
    }

    if (newOuts >= 3) {
      // End of half-inning
      get().switchSides()
    } else {
      set((state) => {
        const newState = {
          ...state.gameState,
          outs: newOuts,
          lastUpdated: Date.now(),
          lastAction: {
            type: "Out",
            previousState,
            timestamp: Date.now(),
          },
        }

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })
    }
  },

  resetCount: () => {
    // Guardar el estado actual antes de modificarlo
    const { gameState } = get()
    const previousState = {
      balls: gameState.balls,
      strikes: gameState.strikes,
      lastAction: gameState.lastAction,
    }

    set((state) => {
      const newState = {
        ...state.gameState,
        balls: 0,
        strikes: 0,
        lastUpdated: Date.now(),
        lastAction: {
          type: "Reset Count",
          previousState,
          timestamp: Date.now(),
        },
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })
  },

  advanceRunner: (from, to) => {
    const currentBatterId = get().getCurrentBatterId()
    const { gameState } = get()

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      bases: { ...gameState.bases },
      score: JSON.parse(JSON.stringify(gameState.score)),
      lastAction: gameState.lastAction,
    }

    if (from === "home" && to !== "home") {
      // Bateador llega a una base (hit)
      set((state) => {
        const newState = {
          ...state.gameState,
          lastUpdated: Date.now(),
          lastAction: {
            type: `Hit (${to === "first" ? "Single" : to === "second" ? "Double" : "Triple"})`,
            previousState,
            timestamp: Date.now(),
          },
        }

        // Colocar al bateador en la base correspondiente
        if (to === "first") {
          newState.bases.first = currentBatterId
        } else if (to === "second") {
          newState.bases.second = currentBatterId
        } else if (to === "third") {
          newState.bases.third = currentBatterId
        }

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })

      // Avanzar al siguiente bateador después de un hit
      get().nextBatter()
      return
    }

    if (to === "home") {
      // Runner scores
      get().addRun()

      // Clear the base they came from
      if (from !== "home") {
        set((state) => {
          const newState = {
            ...state.gameState,
            lastUpdated: Date.now(),
            lastAction: {
              type: from === "home" ? "Home Run" : `Runner Scored from ${from}`,
              previousState,
              timestamp: Date.now(),
            },
          }
          const scoringRunnerId = newState.bases[from]

          // Log who scored
          if (scoringRunnerId) {
            const teamKey = newState.isTopInning ? "awayTeam" : "homeTeam"
            const player = newState[teamKey].players.find((p) => p.id === scoringRunnerId)
            console.log(`${player?.name || "Runner"} scored from ${from} base`)
          }

          // Clear the base
          newState.bases[from] = null

          // Si tenemos un gameId, simular la emisión del estado actualizado
          if (newState.gameId) {
            mockSocketService.broadcastGameState(newState.gameId, newState)
          }

          return { gameState: newState }
        })
      } else {
        // Home run - batter scores directly
        // Already advanced to next batter in the calling function
      }
      return
    }

    // Move runner from one base to another
    set((state) => {
      const newState = {
        ...state.gameState,
        lastUpdated: Date.now(),
        lastAction: {
          type: `Runner Advanced: ${from} to ${to}`,
          previousState,
          timestamp: Date.now(),
        },
      }
      const runnerId = from !== "home" ? newState.bases[from] : currentBatterId

      // Set the base they're going to
      newState.bases[to as keyof BaseState] = runnerId

      // Clear the base they came from
      if (from !== "home") {
        newState.bases[from] = null
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })
  },

  // Nueva función para regresar corredores
  returnRunner: (from: keyof BaseState, to: keyof BaseState) => {
    const { gameState } = get()

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      bases: { ...gameState.bases },
      lastAction: gameState.lastAction,
    }

    set((state) => {
      const newState = {
        ...state.gameState,
        lastUpdated: Date.now(),
        lastAction: {
          type: `Runner Returned: ${from} to ${to}`,
          previousState,
          timestamp: Date.now(),
        },
      }

      // Solo si hay un corredor en la base de origen
      if (newState.bases[from]) {
        // Verificar si la base de destino está ocupada
        if (newState.bases[to] === null) {
          // Mover el corredor
          newState.bases[to] = newState.bases[from]
          newState.bases[from] = null
        } else {
          // Si la base de destino está ocupada, no hacer nada
          console.log(`Cannot return runner: base ${to} is already occupied`)
        }
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })
  },

  clearBases: () => {
    const { gameState } = get()

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      bases: { ...gameState.bases },
      lastAction: gameState.lastAction,
    }

    set((state) => {
      const newState = {
        ...state.gameState,
        bases: { first: null, second: null, third: null },
        lastUpdated: Date.now(),
        lastAction: {
          type: "Clear Bases",
          previousState,
          timestamp: Date.now(),
        },
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })
  },

  addRun: () => {
    const { gameState } = get()
    const teamKey = gameState.isTopInning ? "away" : "home"

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      score: JSON.parse(JSON.stringify(gameState.score)),
      lastAction: gameState.lastAction,
    }

    set((state) => {
      const newScore = { ...state.gameState.score }
      newScore[teamKey][state.gameState.inning - 1]++

      const newState = {
        ...state.gameState,
        score: newScore,
        lastUpdated: Date.now(),
        lastAction: {
          type: "Run Scored",
          previousState,
          timestamp: Date.now(),
        },
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })
  },

  nextBatter: () => {
    const { gameState } = get()
    const teamKey = gameState.isTopInning ? "awayTeam" : "homeTeam"
    const team = gameState[teamKey]

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      [teamKey]: { ...team },
      balls: gameState.balls,
      strikes: gameState.strikes,
      lastAction: gameState.lastAction,
    }

    const newIndex = (team.currentBatterIndex + 1) % team.battingOrder.length

    // Reset the count when changing batters
    set((state) => {
      const newState = {
        ...state.gameState,
        [teamKey]: {
          ...team,
          currentBatterIndex: newIndex,
        },
        // Reset individual count
        balls: 0,
        strikes: 0,
        lastUpdated: Date.now(),
        lastAction: {
          type: "Next Batter",
          previousState,
          timestamp: Date.now(),
        },
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })
  },

  switchSides: () => {
    const { gameState } = get()

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      isTopInning: gameState.isTopInning,
      inning: gameState.inning,
      balls: gameState.balls,
      strikes: gameState.strikes,
      outs: gameState.outs,
      bases: { ...gameState.bases },
      score: JSON.parse(JSON.stringify(gameState.score)),
      lastAction: gameState.lastAction,
    }

    // Verificar si el juego ha terminado
    const isLastInning = gameState.inning >= gameState.totalInnings
    const isBottomInning = !gameState.isTopInning
    const homeTeamWinning =
      gameState.score.home.reduce((sum, runs) => sum + runs, 0) >
      gameState.score.away.reduce((sum, runs) => sum + runs, 0)

    // Si es la última entrada, parte baja, y el equipo local va ganando, terminar el juego
    if (isLastInning && isBottomInning && homeTeamWinning) {
      get().endGame()
      return
    }

    if (gameState.isTopInning) {
      // Switch to bottom of inning
      set((state) => {
        const newState = {
          ...state.gameState,
          isTopInning: false,
          balls: 0,
          strikes: 0,
          outs: 0,
          bases: { first: null, second: null, third: null },
          lastUpdated: Date.now(),
          lastAction: {
            type: "Switch Sides (Top to Bottom)",
            previousState,
            timestamp: Date.now(),
          },
        }

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })
    } else {
      // Switch to top of next inning
      set((state) => {
        const newInning = state.gameState.inning + 1

        // Verificar si hemos llegado al final del juego
        if (newInning > state.gameState.totalInnings) {
          // Terminar el juego si hemos jugado todas las entradas
          get().endGame()
          return state
        }

        const newState = {
          ...state.gameState,
          inning: newInning,
          isTopInning: true,
          balls: 0,
          strikes: 0,
          outs: 0,
          bases: { first: null, second: null, third: null },
          lastUpdated: Date.now(),
          lastAction: {
            type: "Switch Sides (Bottom to Top)",
            previousState,
            timestamp: Date.now(),
          },
        }

        // Si tenemos un gameId, simular la emisión del estado actualizado
        if (newState.gameId) {
          mockSocketService.broadcastGameState(newState.gameId, newState)
        }

        return { gameState: newState }
      })
    }
  },

  endGame: () => {
    // Guardar el gameId antes de finalizar el juego
    const gameId = get().gameState.gameId

    // Guardar el estado actual antes de modificarlo
    const { gameState } = get()
    const previousState = {
      isGameActive: gameState.isGameActive,
      lastAction: gameState.lastAction,
    }

    set((state) => {
      const newState = {
        ...state.gameState,
        isGameActive: false,
        gameId: gameId, // Mantener el gameId para la página de resumen
        lastUpdated: Date.now(),
        lastAction: {
          type: "End Game",
          previousState,
          timestamp: Date.now(),
        },
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })

    // Redirigir a la página de resumen
    if (typeof window !== "undefined" && gameId) {
      // Usar setTimeout para evitar problemas con el ciclo de renderizado de React
      setTimeout(() => {
        window.location.href = `/game-summary/${gameId}`
      }, 0)
    }
  },

  // Nueva función para deshacer la última acción
  undoLastAction: () => {
    const { gameState } = get()

    // Verificar si hay una acción para deshacer
    if (!gameState.lastAction) {
      console.log("No hay acciones para deshacer")
      return
    }

    // Obtener el estado anterior
    const { previousState } = gameState.lastAction

    set((state) => {
      // Crear un nuevo estado combinando el estado actual con el estado anterior
      const newState = {
        ...state.gameState,
        ...previousState,
        lastUpdated: Date.now(),
        // Restaurar la acción anterior que había antes
        lastAction: previousState.lastAction,
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })
  },

  // Nueva función para terminar el turno del equipo
  endTeamTurn: () => {
    const { gameState } = get()

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      outs: gameState.outs,
      lastAction: gameState.lastAction,
    }

    // Forzar el cambio de lado sin importar el número de outs
    set((state) => {
      const newState = {
        ...state.gameState,
        lastUpdated: Date.now(),
        lastAction: {
          type: "End Team Turn",
          previousState,
          timestamp: Date.now(),
        },
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })

    // Cambiar de lado
    get().switchSides()
  },

  // Nueva función para ponchar a un corredor específico
  strikeOutRunner: (base: keyof BaseState) => {
    const { gameState } = get()

    // Verificar si hay un corredor en la base
    if (!gameState.bases[base]) {
      console.log(`No hay corredor en ${base} para ponchar`)
      return
    }

    // Guardar el estado actual antes de modificarlo
    const previousState = {
      bases: { ...gameState.bases },
      outs: gameState.outs,
      lastAction: gameState.lastAction,
    }

    set((state) => {
      const newState = {
        ...state.gameState,
        bases: {
          ...state.gameState.bases,
          [base]: null, // Eliminar al corredor de la base
        },
        lastUpdated: Date.now(),
        lastAction: {
          type: `Strike Out Runner at ${base}`,
          previousState,
          timestamp: Date.now(),
        },
      }

      // Si tenemos un gameId, simular la emisión del estado actualizado
      if (newState.gameId) {
        mockSocketService.broadcastGameState(newState.gameId, newState)
      }

      return { gameState: newState }
    })

    // Agregar un out
    get().addOut()
  },

  // Nueva función para verificar si el juego ha terminado
  isGameOver: () => {
    const { gameState } = get()

    // El juego ha terminado si:
    // 1. No está activo
    // 2. Se han jugado todas las entradas
    // 3. Es la última entrada, parte baja, y el equipo local va ganando

    if (!gameState.isGameActive) {
      return true
    }

    const isLastInning = gameState.inning >= gameState.totalInnings
    const isBottomInning = !gameState.isTopInning

    // Calcular puntuaciones totales
    const homeTotalRuns = gameState.score.home.reduce((sum, runs) => sum + runs, 0)
    const awayTotalRuns = gameState.score.away.reduce((sum, runs) => sum + runs, 0)

    // Si es la última entrada, parte baja, y el equipo local va ganando, el juego ha terminado
    if (isLastInning && isBottomInning && homeTotalRuns > awayTotalRuns) {
      return true
    }

    // Si se han jugado todas las entradas completas
    if (gameState.inning > gameState.totalInnings) {
      return true
    }

    return false
  },
}))
