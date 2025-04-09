import { type NextRequest, NextResponse } from "next/server"
import { saveGame, getGame, initializeDatabase } from "@/lib/db"

// Inicializar la base de datos al iniciar la aplicación
initializeDatabase().catch(console.error)

// Endpoint para crear o actualizar un juego
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameId, gameState } = body

    if (!gameId || !gameState) {
      return NextResponse.json({ error: "Game ID and game state are required" }, { status: 400 })
    }

    const savedGameId = await saveGame(gameId, gameState)

    return NextResponse.json({ success: true, gameId: savedGameId })
  } catch (error) {
    console.error("Error in POST /api/games", error)
    return NextResponse.json({ error: "Failed to save game" }, { status: 500 })
  }
}

// Endpoint para obtener un juego específico
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const gameId = url.searchParams.get("gameId")

    if (!gameId) {
      return NextResponse.json({ error: "Game ID is required" }, { status: 400 })
    }

    const gameState = await getGame(gameId)

    if (!gameState) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, gameState })
  } catch (error) {
    console.error("Error in GET /api/games", error)
    return NextResponse.json({ error: "Failed to get game" }, { status: 500 })
  }
}
