"use client"

import { useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGameStore } from "@/lib/game-store"
import { useGame } from "@/lib/game-provider"
import { BeerIcon as Baseball, Eye, Home, RefreshCw } from "lucide-react"
import Scoreboard from "@/components/scoreboard"
import BallsStrikesOuts from "@/components/balls-strikes-outs"
import BasesDiamond from "@/components/bases-diamond"
import BattingOrder from "@/components/batting-order"
import GameControls from "@/components/game-controls"
import QRCode from "@/components/qr-code"
import ShareButton from "@/components/share-button"
import AttackingTeam from "@/components/attacking-team"
import Footer from "@/components/footer"
import { POLLING_INTERVAL, updateGameStatePolling } from "@/lib/polling-service"

export default function AdminGamePage() {
  const router = useRouter()
  const { gameId, lastUpdate, updateGame } = useGame()
  const { gameState, isGameOver } = useGameStore()
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  // Redirect if game is not active
  useEffect(() => {
    if (!gameState.isGameActive) {
      router.push("/")
    }
  }, [gameState.isGameActive, router])

  // Función para emitir actualizaciones del estado del juego
  const emitGameState = useCallback(async () => {
    if (gameId && gameState.isGameActive) {
      console.log("[POLLING] Admin emitting game state update")
      await updateGameStatePolling(gameId, gameState)
      updateGame() // Actualizar el timestamp de última actualización
    } else {
      console.log("[POLLING] Cannot emit game state: gameId missing or game not active")
      console.log("[POLLING] GameId:", gameId)
    }
  }, [gameId, gameState, updateGame])

  // Emitir el estado del juego cuando cambie
  useEffect(() => {
    emitGameState()
  }, [emitGameState])

  // Emitir el estado del juego periódicamente para asegurar sincronización
  useEffect(() => {
    pollingInterval.current = setInterval(() => {
      emitGameState()
    }, POLLING_INTERVAL) // Emitir cada X segundos

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [emitGameState])

  // Función para actualizar manualmente
  const handleManualUpdate = () => {
    emitGameState()
  }

  if (!gameState.isGameActive) {
    return null
  }

  const currentTeam = gameState.isTopInning ? gameState.awayTeam : gameState.homeTeam
  const currentBatterId = currentTeam.battingOrder[currentTeam.currentBatterIndex]
  const currentBatter = currentTeam.players.find((p) => p.id === currentBatterId)

  // Verificar si el juego ha terminado
  const gameOver = isGameOver()

  return (
    <main className="min-h-screen bg-baseball-gray">
      <div className="p-4 bg-baseball-blue text-white flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl mr-2">🥎</span>
          <h1 className="text-2xl font-bebas">STRIKES & BALLS | ADMIN PANEL</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-green-600 text-white border-white hover:bg-green-700"
            onClick={handleManualUpdate}
          >
            <RefreshCw className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Actualizar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-baseball-blue text-white border-white hover:bg-blue-900"
            onClick={() => router.push(`/spectator/${gameId}?preview=true`)}
          >
            <Eye className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Modo Espectador</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-baseball-blue/50"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Exit</span>
          </Button>
        </div>
      </div>

      {/* Estado de actualización */}
      <div className="max-w-6xl mx-auto px-4 pt-2">
        <div className="bg-green-100 text-green-800 p-2 rounded-md text-center text-sm">
          Última actualización: {lastUpdate ? lastUpdate.toLocaleTimeString() : "No actualizado"}
        </div>
      </div>

      {/* Mensaje de juego terminado */}
      {gameOver && (
        <div className="max-w-6xl mx-auto px-4 pt-2 mt-2">
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-md text-center">
            <h3 className="font-bebas text-xl">¡JUEGO TERMINADO!</h3>
            <p>El partido ha finalizado. Todos los controles están deshabilitados.</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column - Scoreboard and Game Info */}
          <div className="lg:col-span-2 space-y-4">
            <Scoreboard />

            {/* Equipo atacante */}
            <AttackingTeam />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <Card className="p-4">
                <h3 className="font-bebas text-xl mb-2 text-baseball-blue">GAME SITUATION</h3>
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Inning:</span>
                    <span className="font-bebas text-xl">
                      {gameState.isTopInning ? "TOP" : "BOTTOM"} {gameState.inning} / {gameState.totalInnings}
                    </span>
                  </div>
                  <BallsStrikesOuts balls={gameState.balls} strikes={gameState.strikes} outs={gameState.outs} />
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bebas text-xl text-baseball-blue">FIELD</h3>
              </div>
              <div className="flex justify-center">
                <BasesDiamond bases={gameState.bases} size="large" showPlayerInfo={true} />
              </div>
            </Card>
          </div>

          {/* Right column - Game Controls */}
          <div className="space-y-4">
            <GameControls />

            <Card className="p-4">
              <h3 className="font-bebas text-xl mb-2 text-baseball-blue">BATTING ORDER</h3>
              <BattingOrder />
            </Card>

            <Card className="p-4 bg-baseball-blue text-white">
              <h3 className="font-bebas text-xl mb-2">SPECTATOR ACCESS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-md">
                  <div className="text-sm mb-1">Share this code:</div>
                  <div className="font-bebas text-2xl">{gameId || "GAME123"}</div>
                  <div className="mt-3">
                    <ShareButton gameId={gameId} />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <QRCode gameId={gameId} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
