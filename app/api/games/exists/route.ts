import { type NextRequest, NextResponse } from "next/server"
import { gameExists } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const gameId = url.searchParams.get("gameId")

    if (!gameId) {
      return NextResponse.json({ error: "Game ID is required" }, { status: 400 })
    }

    const exists = await gameExists(gameId)

    return NextResponse.json({ success: true, exists })
  } catch (error) {
    console.error("Error in GET /api/games/exists", error)
    return NextResponse.json({ error: "Failed to check if game exists" }, { status: 500 })
  }
}
