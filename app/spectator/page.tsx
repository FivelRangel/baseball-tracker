"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BeerIcon as Baseball } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

export default function SpectatorPage() {
  const router = useRouter()
  const { updateGameState } = useGameStore()
  const [gameCode, setGameCode] = useState("")

  const handleJoinGame = () => {
    if (!gameCode.trim()) {
      alert("Please enter a game code")
      return
    }

    // Actualizar el gameId en el store
    updateGameState({ gameId: gameCode.trim() })

    // Navegar a la página del espectador
    router.push(`/spectator/${gameCode.trim()}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-baseball-white to-baseball-gray">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <span className="text-xl mr-2">🥎</span>
          </div>
          <h1 className="text-4xl font-bebas text-baseball-blue mb-4">JOIN A GAME</h1>
          <p className="text-gray-600 mb-8">Enter the game code provided by the administrator</p>

          <div className="space-y-4">
            <Input
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Enter game code"
              className="text-center text-xl py-6"
            />

            <Button onClick={handleJoinGame} className="w-full bg-baseball-red hover:bg-red-700 text-lg py-6">
              Join Game
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
