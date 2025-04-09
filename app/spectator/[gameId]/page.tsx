"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useGameStore } from "@/lib/game-store"
import { ArrowLeft, BeerIcon as Baseball, Home, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Scoreboard from "@/components/scoreboard"
import BallsStrikesOuts from "@/components/balls-strikes-outs"
import BasesDiamond from "@/components/bases-diamond"
import BattingOrder from "@/components/batting-order"
import AttackingTeam from "@/components/attacking-team"
import ScoreSummary from "@/components/score-summary"
import Footer from "@/components/footer"
import { fetchGameState, joinGamePolling, POLLING_INTERVAL } from "@/lib/polling-service"

export default function SpectatorGamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter()
  const { updateGameState, gameState } = useGameStore()
  const [isPreview, setIsPreview] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isPolling, setIsPolling] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingAttempts, setLoadingAttempts] = useState(0)
  const [pollingError, setPollingError] = useState(false)
  const hasJoinedGame = useRef(false)
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const dataCheckTimer = useRef<NodeJS.Timeout | null>(null)

  // Verificar si estamos en modo vista previa
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      const preview = searchParams.get("preview") === "true"
      setIsPreview(preview)
    }
  }, [])

  // Función para obtener el estado del juego mediante polling
  const pollGameState = useCallback(async () => {
    if (!params.gameId) return

    try {
      setPollingError(false)
      const gameData = await fetchGameState(params.gameId)

      if (gameData) {
        console.log("[POLLING] Received game state update")
        updateGameState(gameData)
        setLastUpdate(new Date())
        setIsLoading(false)
      } else {
        console.log("[POLLING] No game data received")
        setPollingError(true)
      }
    } catch (error) {
      console.error("[POLLING] Error:", error)
      setPollingError(true)
    }
  }, [params.gameId, updateGameState])

  // Unirse al juego una vez y comenzar el polling
  useEffect(() => {
    const joinGame = async () => {
      if (params.gameId && !hasJoinedGame.current) {
        console.log("[POLLING] Joining game:", params.gameId)
        hasJoinedGame.current = true

        try {
          const initialGameState = await joinGamePolling(params.gameId)

          if (initialGameState) {
            updateGameState(initialGameState)
            setIsLoading(false)
          } else {
            // Si no hay datos iniciales, incrementar los intentos
            setLoadingAttempts((prev) => prev + 1)
          }
        } catch (error) {
          console.error("[POLLING] Error joining game:", error)
          setLoadingAttempts((prev) => prev + 1)
        }

        // Iniciar un temporizador para verificar si los datos se han cargado
        dataCheckTimer.current = setTimeout(() => {
          if (gameState.homeTeam.name === "" || gameState.awayTeam.name === "") {
            // Si después de 3 segundos no hay datos, intentar nuevamente
            console.log("[POLLING] No game data received, requesting again...")
            hasJoinedGame.current = false // Permitir otro intento
            setLoadingAttempts((prev) => prev + 1)
          }
        }, 3000)
      }
    }

    joinGame()

    return () => {
      if (dataCheckTimer.current) {
        clearTimeout(dataCheckTimer.current)
      }
    }
  }, [params.gameId, updateGameState, gameState.homeTeam.name, gameState.awayTeam.name, loadingAttempts])

  // Configurar el intervalo de polling
  useEffect(() => {
    if (isPolling && params.gameId) {
      // Realizar un polling inicial inmediatamente
      pollGameState()

      // Configurar el intervalo de polling
      pollingInterval.current = setInterval(pollGameState, POLLING_INTERVAL)
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [isPolling, params.gameId, pollGameState])

  // Verificar si tenemos datos válidos y actualizar el estado de carga
  useEffect(() => {
    if (gameState.homeTeam.name !== "" && gameState.awayTeam.name !== "") {
      setIsLoading(false)
    }
  }, [gameState.homeTeam.name, gameState.awayTeam.name])

  // Función para solicitar manualmente una actualización
  const requestUpdate = useCallback(() => {
    console.log("[POLLING] Manual refresh requested")
    pollGameState()
  }, [pollGameState])

  // Si no hay datos válidos después de varios intentos, mostrar un mensaje de error
  if (loadingAttempts > 3 && (gameState.homeTeam.name === "" || gameState.awayTeam.name === "")) {
    return (
      <main className="min-h-screen bg-baseball-gray flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Baseball className="h-16 w-16 text-baseball-red mx-auto mb-4" />
          <h2 className="text-2xl font-bebas text-baseball-blue mb-2">No se pudo cargar el juego</h2>
          <p className="text-gray-600 mb-4">No se encontraron datos para este juego o el juego ya ha finalizado.</p>
          <Button onClick={() => router.push("/")} className="bg-baseball-blue hover:bg-blue-900">
            Volver al inicio
          </Button>
        </div>
      </main>
    )
  }

  const currentTeam = gameState.isTopInning ? gameState.awayTeam : gameState.homeTeam
  const currentBatterId = currentTeam.battingOrder[currentTeam.currentBatterIndex]
  const currentBatter = currentTeam.players.find((p) => p.id === currentBatterId)

  return (
    <main className="min-h-screen bg-baseball-gray">
      <div className="p-4 bg-baseball-blue text-white flex items-center justify-between">
        <div className="flex items-center">
          <Baseball className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bebas">
            {isPreview && <span className="bg-baseball-red px-2 py-1 text-xs rounded-md mr-2">VISTA PREVIA</span>}
            STRIKES & BALLS
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-green-600 text-white border-white hover:bg-green-700"
            onClick={requestUpdate}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>

          {isPreview && (
            <Button
              variant="outline"
              size="sm"
              className="bg-baseball-red text-white border-white hover:bg-red-700"
              onClick={() => router.push("/admin/game")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a Admin
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="bg-baseball-blue text-white border-white hover:bg-blue-900"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4 mr-1" />
            Exit
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-baseball-blue animate-spin mb-4" />
            <p className="text-lg font-medium text-baseball-blue">Cargando datos del juego...</p>
          </div>
        ) : (
          <>
            {/* Estado de actualización */}
            <div
              className={`mb-4 p-2 rounded-md text-center text-sm ${pollingError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {pollingError ? (
                <span>Error al actualizar - Intente refrescar manualmente</span>
              ) : (
                <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
              )}
            </div>

            <div className="space-y-4">
              {/* Marcador resumido */}
              <ScoreSummary />

              {/* Marcador detallado */}
              <Scoreboard />

              {/* Equipo atacante */}
              <AttackingTeam />

              <Card className="p-4">
                <h3 className="font-bebas text-xl mb-2 text-baseball-blue">CURRENT AT BAT</h3>
                <div className="bg-white p-3 rounded-md border text-center">
                  <div className="text-3xl font-bebas text-baseball-red">{currentBatter?.name || "No batter"}</div>
                  {currentBatter?.number && <div className="text-lg text-gray-500">#{currentBatter.number}</div>}
                  <div className="mt-1 text-sm text-gray-500">
                    {gameState.isTopInning ? gameState.awayTeam.name : gameState.homeTeam.name}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-bebas text-xl mb-2 text-baseball-blue">GAME INFO</h3>
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Inning:</span>
                      <span className="font-bebas text-xl">
                        {gameState.isTopInning ? "TOP" : "BOTTOM"} {gameState.inning}
                      </span>
                    </div>
                    <BallsStrikesOuts balls={gameState.balls} strikes={gameState.strikes} outs={gameState.outs} />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-bebas text-xl mb-2 text-baseball-blue">FIELD</h3>
                  <div className="flex justify-center">
                    <BasesDiamond bases={gameState.bases} size="medium" showPlayerInfo={true} />
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-bebas text-xl mb-2 text-baseball-blue">BATTING ORDER</h3>
                <BattingOrder />
              </Card>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
