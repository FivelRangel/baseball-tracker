"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Player } from "@/lib/game-store"

type DraggableBattingOrderProps = {
  players: Player[]
  battingOrder: string[]
  onOrderChange: (newOrder: string[]) => void
  onRemovePlayer: (playerId: string) => void
}

export default function DraggableBattingOrder({
  players,
  battingOrder,
  onOrderChange,
  onRemovePlayer,
}: DraggableBattingOrderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const draggedItemRef = useRef<HTMLDivElement | null>(null)

  // Get ordered players based on batting order
  const orderedPlayers = battingOrder
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => p !== undefined)

  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(index)
    draggedItemRef.current = e.currentTarget

    // Set the drag image to be the element itself
    if (e.dataTransfer && draggedItemRef.current) {
      e.dataTransfer.effectAllowed = "move"

      // This is needed for Firefox
      e.dataTransfer.setData("text/plain", index.toString())

      // Add a class to style the dragged item
      setTimeout(() => {
        if (draggedItemRef.current) {
          draggedItemRef.current.classList.add("opacity-50")
        }
      }, 0)
    }
  }

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    // If we're not dragging anything or we're hovering over the same item, do nothing
    if (draggedIndex === null || draggedIndex === index) return

    // Reorder the list
    const newOrderedPlayers = [...orderedPlayers]
    const draggedPlayer = newOrderedPlayers[draggedIndex]

    // Remove the dragged player from the array
    newOrderedPlayers.splice(draggedIndex, 1)

    // Insert the dragged player at the new position
    newOrderedPlayers.splice(index, 0, draggedPlayer)

    // Update the dragged index to the new position
    setDraggedIndex(index)

    // Update the batting order
    onOrderChange(newOrderedPlayers.map((p) => p.id))
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    if (draggedItemRef.current) {
      draggedItemRef.current.classList.remove("opacity-50")
      draggedItemRef.current = null
    }
  }

  if (orderedPlayers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No players added yet. Add players above to create the batting order.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {orderedPlayers.map((player, index) => (
        <div
          key={player.id}
          draggable
          onDragStart={(e) => handleDragStart(index, e)}
          onDragOver={(e) => handleDragOver(index, e)}
          onDragEnd={handleDragEnd}
          className="flex items-center p-3 bg-white rounded-md border cursor-move hover:border-baseball-blue transition-colors"
        >
          <div className="flex-1">
            <div className="font-medium">
              {index + 1}. {player.name}
            </div>
            {player.number && <div className="text-sm text-gray-500">#{player.number}</div>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemovePlayer(player.id)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="text-xs text-gray-500 mt-2 text-center">
        Arrastra y suelta los jugadores para cambiar el orden de bateo
      </div>
    </div>
  )
}
