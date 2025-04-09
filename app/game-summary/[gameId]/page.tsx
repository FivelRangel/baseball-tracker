"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/lib/game-store"
import { BeerIcon as Baseball, Home, Trophy, Loader2, RefreshCw } from "lucide-react"
import Footer from "@/components/footer"
import { fetchGameState, joinGamePolling, checkGameExists } from "@/lib/polling-service"

export default function GameSummaryPage({ params }: { params: { gameId: string } }) {
  const router = useRouter()
  const { gameState, updateGameState } = useGameStore()
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string>("")
  const [loadingAttempts, setLoadingAttempts] = useState(0)
  const [gameExists, setGameExists] = useState<boolean | null>(null)
  const hasJoinedGame = useRef(false)
  const isMounted = useRef(true)

  // Verificar si el juego existe
  const checkIfGameExists = useCallback(async () => {
    if (!params.gameId) return false

    try {
      console.log(`[SUMMARY] Checking if game ${params.gameId} exists`)
      const exists = await checkGameExists(params.gameId)
      console.log(`[SUMMARY] Game ${params.gameId} exists: ${exists}`)

      if (isMounted.current) {
        setGameExists(exists)
      }
      return exists
    } catch (error) {
      console.error("[SUMMARY] Error checking if game exists:", error)
      if (isMounted.current) {
        setGameExists(false)
        setErrorDetails(`Error al verificar el juego: ${error}`)
      }
      return false
    }
  }, [params.gameId])

  // Función para cargar los datos del juego
  const loadGameData = useCallback(async () => {
    if (!params.gameId || hasJoinedGame.current) return

    try {
      console.log("[SUMMARY] Attempting to load game data for summary:", params.gameId)

      if (isMounted.current) {
        setLoadingError(false)
      }

      // Verificar primero si el juego existe
      const exists = await checkIfGameExists()

      if (!exists) {
        console.log("[SUMMARY] Game does not exist:", params.gameId)
        if (isMounted.current) {
          setLoadingError(true)
          setIsLoading(false)
          setErrorDetails(`No se encontró ningún juego con el código: ${params.gameId}`)
        }
        return
      }

      // Intentar obtener los datos del juego directamente
      console.log("[SUMMARY] Game exists, fetching state...")
      const gameData = await fetchGameState(params.gameId)

      if (gameData) {
        console.log("[SUMMARY] Successfully loaded game data for summary")
        if (isMounted.current) {
          updateGameState(gameData)
          setIsLoading(false)
          hasJoinedGame.current = true
        }
      } else {
        // Si fetchGameState falla, intentar con joinGamePolling
        console.log("[SUMMARY] fetchGameState returned no data, trying joinGamePolling")
        const joinData = await joinGamePolling(params.gameId)

        if (joinData) {
          console.log("[SUMMARY] Successfully joined game for summary")
          if (isMounted.current) {
            updateGameState(joinData)
            setIsLoading(false)
            hasJoinedGame.current = true
          }
        } else {
          console.error("[SUMMARY] Both data fetching methods failed")
          if (isMounted.current) {
            setLoadingAttempts((prev) => prev + 1)
            if (loadingAttempts >= 2) {
              setLoadingError(true)
              setIsLoading(false)
              setErrorDetails("Ambos métodos de obtención de datos fallaron")
            }
          }
        }
      }
    } catch (error) {
      console.error("[SUMMARY] Error loading game data:", error)
      if (isMounted.current) {
        setLoadingAttempts((prev) => prev + 1)
        if (loadingAttempts >= 2) {
          setLoadingError(true)
          setIsLoading(false)
          setErrorDetails(`Error al cargar datos: ${error}`)
        }
      }
    }
  }, [params.gameId, updateGameState, loadingAttempts, checkIfGameExists])

  // Cargar los datos del juego al montar el componente
  useEffect(() => {
    isMounted.current = true

    // Log available games in localStorage for debugging
    if (typeof window !== "undefined") {
      try {
        const storedGames = JSON.parse(localStorage.getItem("baseballGames") || "{}")
        console.log(`[SUMMARY] Available games in localStorage: ${Object.keys(storedGames).join(", ") || "none"}`)

        // If the game is in localStorage, log it
        if (params.gameId && storedGames[params.gameId]) {
          console.log(`[SUMMARY] Game ${params.gameId} found in localStorage`)
        } else if (params.gameId) {
          console.log(`[SUMMARY] Game ${params.gameId} NOT found in localStorage`)
        }
      } catch (error) {
        console.error("[SUMMARY] Error checking localStorage:", error)
      }
    }

    if (!hasJoinedGame.current) {
      loadGameData()
    }

    return () => {
      isMounted.current = false
    }
  }, [loadGameData, params.gameId])

  // Manejar el caso en que el gameId ya esté en el store
  useEffect(() => {
    if (params.gameId && gameState.gameId === params.gameId && gameState.homeTeam.name !== "") {
      console.log("[SUMMARY] Game data already in store, using it")
      setIsLoading(false)
      hasJoinedGame.current = true
    }
  }, [params.gameId, gameState])

  // Función para reintentar la carga
  const handleRetry = () => {
    setLoadingError(false)
    setIsLoading(true)
    setLoadingAttempts(0)
    hasJoinedGame.current = false
    loadGameData()
  }

  // Si hay un error al cargar después de varios intentos, mostrar mensaje de error
  if (loadingError) {
    return (
      <main className="min-h-screen bg-baseball-gray flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Baseball className="h-16 w-16 text-baseball-red mx-auto mb-4" />
          <h2 className="text-2xl font-bebas text-baseball-blue mb-2">Error al cargar el resumen</h2>
          <p className="text-gray-600 mb-4">
            {gameExists === false
              ? `No se encontró ningún juego con el código: ${params.gameId}`
              : "No se pudieron cargar los datos del juego."}
          </p>
          {errorDetails && <p className="text-xs text-red-500 mb-4 bg-red-50 p-2 rounded">Detalles: {errorDetails}</p>}
          <div className="space-y-2">
            <Button
              onClick={handleRetry}
              className="bg-baseball-red hover:bg-red-700 w-full flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar nuevamente
            </Button>
            <Button onClick={() => router.push("/")} className="bg-baseball-blue hover:bg-blue-900 w-full">
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Si está cargando, mostrar indicador de carga
  if (isLoading) {
    return (
      <main className="min-h-screen bg-baseball-gray flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Loader2 className="h-16 w-16 text-baseball-blue mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bebas text-baseball-blue mb-2">Cargando resumen del juego</h2>
          <p className="text-gray-600 mb-4">Espere mientras se cargan los datos...</p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="text-baseball-blue border-baseball-blue"
            >
              Cancelar y volver al inicio
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Si no hay datos válidos, mostrar mensaje de error
  if (gameState.homeTeam.name === "" || gameState.awayTeam.name === "") {
    return (
      <main className="min-h-screen bg-baseball-gray flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Baseball className="h-16 w-16 text-baseball-red mx-auto mb-4" />
          <h2 className="text-2xl font-bebas text-baseball-blue mb-2">No se encontró el juego</h2>
          <p className="text-gray-600 mb-4">
            No se encontraron datos para este juego o el juego ya ha finalizado.
            <br />
            <span className="text-sm text-gray-500">Código del juego: {params.gameId}</span>
          </p>
          <div className="space-y-2">
            <Button
              onClick={handleRetry}
              className="bg-baseball-red hover:bg-red-700 w-full flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar nuevamente
            </Button>
            <Button onClick={() => router.push("/")} className="bg-baseball-blue hover:bg-blue-900 w-full">
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Calcular totales
  const homeTotalRuns = gameState.score.home.reduce((sum, runs) => sum + runs, 0)
  const awayTotalRuns = gameState.score.away.reduce((sum, runs) => sum + runs, 0)

  // Determinar ganador
  const homeWins = homeTotalRuns > awayTotalRuns
  const awayWins = awayTotalRuns > homeTotalRuns
  const isTie = homeTotalRuns === awayTotalRuns

  // Usar el número total de entradas configurado en lugar de la longitud del array
  // Esto corrige el bug cuando el partido finaliza en ceros
  const totalInnings = gameState.totalInnings || gameState.score.home.length

  // Asegurar que haya al menos una entrada jugada
  if (totalInnings === 0) {
    return (
      <main className="min-h-screen bg-baseball-gray flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Baseball className="h-16 w-16 text-baseball-red mx-auto mb-4" />
          <h2 className="text-2xl font-bebas text-baseball-blue mb-2">Juego sin entradas registradas</h2>
          <p className="text-gray-600 mb-4">El juego terminó antes de completar una entrada.</p>
          <Button onClick={() => router.push("/")} className="bg-baseball-blue hover:bg-blue-900">
            <Home className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </main>
    )
  }

  // Determinar la entrada más productiva
  const mostProductiveInning = {
    inning: 0,
    runs: 0,
    team: "",
  }

  for (let i = 0; i < gameState.score.home.length; i++) {
    if (gameState.score.home[i] > mostProductiveInning.runs) {
      mostProductiveInning.runs = gameState.score.home[i]
      mostProductiveInning.inning = i + 1
      mostProductiveInning.team = gameState.homeTeam.name
    }
    if (gameState.score.away[i] > mostProductiveInning.runs) {
      mostProductiveInning.runs = gameState.score.away[i]
      mostProductiveInning.inning = i + 1
      mostProductiveInning.team = gameState.awayTeam.name
    }
  }

  return (
    <main className="min-h-screen bg-baseball-gray">
      <div className="p-4 bg-baseball-blue text-white flex items-center justify-between">
        <div className="flex items-center">
          <Baseball className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bebas">STRIKES & BALLS | RESUMEN DEL JUEGO</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-white border-white hover:bg-baseball-blue/50"
          onClick={() => router.push("/")}
        >
          <Home className="h-4 w-4 mr-1" />
          Inicio
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-6">
          {/* Resultado final */}
          <Card className="overflow-hidden">
            <div className="bg-baseball-blue text-white p-3 text-center">
              <h2 className="font-bebas text-2xl">RESULTADO FINAL</h2>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-2">
                <div className={`p-6 text-center ${homeWins ? "bg-green-50" : ""}`}>
                  <div className="text-lg text-gray-500">LOCAL</div>
                  <div className="text-3xl font-bebas text-baseball-blue">{gameState.homeTeam.name}</div>
                  <div className="text-6xl font-bebas text-baseball-red mt-2">{homeTotalRuns}</div>
                  {homeWins && (
                    <div className="mt-2 flex items-center justify-center text-green-600">
                      <Trophy className="h-5 w-5 mr-1" />
                      <span className="font-medium">GANADOR</span>
                    </div>
                  )}
                </div>

                <div className={`p-6 text-center border-l ${awayWins ? "bg-green-50" : ""}`}>
                  <div className="text-lg text-gray-500">VISITANTE</div>
                  <div className="text-3xl font-bebas text-baseball-blue">{gameState.awayTeam.name}</div>
                  <div className="text-6xl font-bebas text-baseball-red mt-2">{awayTotalRuns}</div>
                  {awayWins && (
                    <div className="mt-2 flex items-center justify-center text-green-600">
                      <Trophy className="h-5 w-5 mr-1" />
                      <span className="font-medium">GANADOR</span>
                    </div>
                  )}
                </div>
              </div>

              {isTie && (
                <div className="p-4 text-center bg-amber-50 border-t">
                  <div className="text-xl font-bebas text-amber-600">EMPATE</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas del juego */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-baseball-blue">Estadísticas por Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Equipo</th>
                        {Array.from({ length: gameState.score.home.length }).map((_, i) => (
                          <th key={i} className="p-2 text-center">
                            {i + 1}
                          </th>
                        ))}
                        <th className="p-2 text-center bg-gray-200">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2 font-medium">{gameState.awayTeam.name}</td>
                        {gameState.score.away.map((runs, i) => (
                          <td key={i} className="p-2 text-center">
                            {runs}
                          </td>
                        ))}
                        <td className="p-2 text-center font-bold bg-gray-100">{awayTotalRuns}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-medium">{gameState.homeTeam.name}</td>
                        {gameState.score.home.map((runs, i) => (
                          <td key={i} className="p-2 text-center">
                            {runs}
                          </td>
                        ))}
                        <td className="p-2 text-center font-bold bg-gray-100">{homeTotalRuns}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-baseball-blue">Datos Destacados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mostProductiveInning.runs > 0 && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-500">Entrada más productiva</div>
                    <div className="font-medium">
                      {mostProductiveInning.team} - Entrada {mostProductiveInning.inning} ({mostProductiveInning.runs}{" "}
                      carreras)
                    </div>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Total de entradas jugadas</div>
                  <div className="font-medium">{totalInnings}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Diferencia de carreras</div>
                  <div className="font-medium">
                    {Math.abs(homeTotalRuns - awayTotalRuns)} {isTie ? "(Empate)" : ""}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de carreras por entrada */}
          <Card>
            <CardHeader>
              <CardTitle className="text-baseball-blue">Carreras por Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <div className="h-full flex items-end">
                  {Array.from({ length: gameState.score.home.length }).map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center space-y-1">
                        <div
                          className="w-8 bg-baseball-red"
                          style={{
                            height: `${(gameState.score.away[i] / Math.max(...gameState.score.away, ...gameState.score.home, 1)) * 150}px`,
                            minHeight: gameState.score.away[i] > 0 ? "10px" : "0",
                          }}
                        ></div>
                        <div
                          className="w-8 bg-baseball-blue"
                          style={{
                            height: `${(gameState.score.home[i] / Math.max(...gameState.score.away, ...gameState.score.home, 1)) * 150}px`,
                            minHeight: gameState.score.home[i] > 0 ? "10px" : "0",
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs">{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-baseball-red mr-2"></div>
                  <span>{gameState.awayTeam.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-baseball-blue mr-2"></div>
                  <span>{gameState.homeTeam.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-baseball-blue hover:bg-blue-900 text-white text-lg py-6 px-8"
            >
              <Home className="h-5 w-5 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
