"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface ShareButtonProps {
  gameId: string | null
  text?: string
}

export default function ShareButton({ gameId, text = "Únete a mi partido de béisbol" }: ShareButtonProps) {
  const [shareUrl, setShareUrl] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined" && gameId) {
      const baseUrl = window.location.origin
      const spectatorUrl = `${baseUrl}/spectator/${gameId}`
      const encodedText = encodeURIComponent(`${text}: ${spectatorUrl}`)
      setShareUrl(`https://wa.me/?text=${encodedText}`)
    }
  }, [gameId, text])

  if (!shareUrl) return null

  return (
    <Button
      onClick={() => window.open(shareUrl, "_blank")}
      variant="outline"
      size="sm"
      className="w-full bg-green-600 hover:bg-green-700 text-white border-none"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Compartir por WhatsApp
    </Button>
  )
}
