"use client"

import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

interface QRCodeProps {
  gameId: string | null
  size?: number
}

export default function QRCode({ gameId, size = 128 }: QRCodeProps) {
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    // Obtener la URL base del navegador
    if (typeof window !== "undefined" && gameId) {
      const baseUrl = window.location.origin
      const spectatorUrl = `${baseUrl}/spectator/${gameId}`
      setUrl(spectatorUrl)
    }
  }, [gameId])

  if (!url) return null

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG value={url} size={size} />
      <p className="text-xs mt-2 text-white/80">Escanea para unirte</p>
    </div>
  )
}
