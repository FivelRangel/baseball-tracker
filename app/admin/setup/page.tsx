"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeerIcon as Baseball, Plus, AlertCircle, Lock, Edit } from "lucide-react"
import { useGameStore, type Player, type Team } from "@/lib/game-store"
import { useGame } from "@/lib/game-provider"
import { v4 as uuidv4 } from "uuid"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createGamePolling } from "@/lib/polling-service"
import DraggableBattingOrder from "@/components/draggable-batting-order"

export default function GameSetup() {
  const router = useRouter()
  const { createGame, gameId } = useGame()
  const { initializeGame, gameState } = useGameStore()
  const MIN_PLAYERS = 7

  const [homeTeam, setHomeTeam] = useState<Team>({
    name: "Home Team",
    players: [],
    battingOrder: [],
    currentBatterIndex: 0,
  })

  const [awayTeam, setAwayTeam] = useState<Team>({
    name: "Away Team",
    players: [],
    battingOrder: [],
    currentBatterIndex: 0,
  })

  const [homeTeamNameLocked, setHomeTeamNameLocked] = useState(false)
  const [awayTeamNameLocked, setAwayTeamNameLocked] = useState(false)
  const [battingFirst, setBattingFirst] = useState<"away" | "home">("away") // Por defecto, el equipo visitante batea primero
  const [totalInnings, setTotalInnings] = useState(9) // 9 entradas por defecto

  const [newPlayerName, setNewPlayerName] = useState("")
  const [newPlayerNumber, setNewPlayerNumber] = useState("")
  const [activeTab, setActiveTab] = useState("home")

  const addPlayer = (team: "home" | "away") => {
    if (!newPlayerName.trim()) return

    // Verificar que el nombre del equipo esté bloqueado
    if ((team === "home" && !homeTeamNameLocked) || (team === "away" && !awayTeamNameLocked)) {
      alert("Primero debes confirmar el nombre del equipo")
      return
    }

    const newPlayer: Player = {
      id: uuidv4(),
      name: newPlayerName.trim(),
      number: newPlayerNumber.trim() || undefined,
    }

    if (team === "home") {
      const updatedPlayers = [...homeTeam.players, newPlayer]
      setHomeTeam({
        ...homeTeam,
        players: updatedPlayers,
        battingOrder: updatedPlayers.map((p) => p.id),
      })
    } else {
      const updatedPlayers = [...awayTeam.players, newPlayer]
      setAwayTeam({
        ...awayTeam,
        players: updatedPlayers,
        battingOrder: updatedPlayers.map((p) => p.id),
      })
    }

    setNewPlayerName("")
    setNewPlayerNumber("")
  }

  const removePlayer = (team: "home" | "away", playerId: string) => {
    if (team === "home") {
      const updatedPlayers = homeTeam.players.filter((p) => p.id !== playerId)
      setHomeTeam({
        ...homeTeam,
        players: updatedPlayers,
        battingOrder: homeTeam.battingOrder.filter((id) => id !== playerId),
      })
    } else {
      const updatedPlayers = awayTeam.players.filter((p) => p.id !== playerId)
      setAwayTeam({
        ...awayTeam,
        players: updatedPlayers,
        battingOrder: awayTeam.battingOrder.filter((id) => id !== playerId),
      })
    }
  }

  const updateBattingOrder = (team: "home" | "away", newOrder: string[]) => {
    if (team === "home") {
      setHomeTeam({
        ...homeTeam,
        battingOrder: newOrder,
      })
    } else {
      setAwayTeam({
        ...awayTeam,
        battingOrder: newOrder,
      })
    }
  }

  const startGame = async () => {
    // Validate teams have at least MIN_PLAYERS players
    if (homeTeam.players.length < MIN_PLAYERS || awayTeam.players.length < MIN_PLAYERS) {
      // Mostrar mensaje de error, pero no impedir que continúe
      if (
        !confirm(`Se recomienda tener al menos ${MIN_PLAYERS} jugadores por equipo. ¿Deseas continuar de todos modos?`)
      ) {
        return
      }
    }

    // Generate a new game ID directly
    const newGameId = Math.random().toString(36).substring(2, 9)

    // Initialize game state with the new game ID
    initializeGame(homeTeam, awayTeam, totalInnings, battingFirst === "away")

    // Update the game ID and create the game
    createGame()

    // Force create the game on the server immediately
    await createGamePolling(newGameId, {
      ...gameState,
      homeTeam,
      awayTeam,
      totalInnings,
      isTopInning: battingFirst === "away",
      gameId: newGameId,
      isGameActive: true,
    })

    // Navigate to the game admin page
    router.push("/admin/game")
  }

  const homeMissingPlayers = Math.max(0, MIN_PLAYERS - homeTeam.players.length)
  const awayMissingPlayers = Math.max(0, MIN_PLAYERS - awayTeam.players.length)
  const canStartGame = homeTeam.players.length > 0 && awayTeam.players.length > 0

  return (
    <main className="min-h-screen p-4 bg-baseball-gray">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <span className="text-4xl mr-3">🥎</span>
          <div className="text-center">
            <h1 className="text-4xl font-bebas text-baseball-blue">STRIKES & BALLS</h1>
            <p className="text-lg font-bebas text-baseball-red">GAME SETUP</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="home" className="text-lg">
              Home Team {homeMissingPlayers > 0 && `(Faltan ${homeMissingPlayers})`}
            </TabsTrigger>
            <TabsTrigger value="away" className="text-lg">
              Away Team {awayMissingPlayers > 0 && `(Faltan ${awayMissingPlayers})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <TeamSetup
              team={homeTeam}
              setTeamName={(name) => setHomeTeam({ ...homeTeam, name })}
              newPlayerName={newPlayerName}
              setNewPlayerName={setNewPlayerName}
              newPlayerNumber={newPlayerNumber}
              setNewPlayerNumber={setNewPlayerNumber}
              addPlayer={() => addPlayer("home")}
              removePlayer={(id) => removePlayer("home", id)}
              updateBattingOrder={(newOrder) => updateBattingOrder("home", newOrder)}
              missingPlayers={homeMissingPlayers}
              minPlayers={MIN_PLAYERS}
              isTeamNameLocked={homeTeamNameLocked}
              setTeamNameLocked={setHomeTeamNameLocked}
            />
          </TabsContent>

          <TabsContent value="away">
            <TeamSetup
              team={awayTeam}
              setTeamName={(name) => setAwayTeam({ ...awayTeam, name })}
              newPlayerName={newPlayerName}
              setNewPlayerName={setNewPlayerName}
              newPlayerNumber={newPlayerNumber}
              setNewPlayerNumber={setNewPlayerNumber}
              addPlayer={() => addPlayer("away")}
              removePlayer={(id) => removePlayer("away", id)}
              updateBattingOrder={(newOrder) => updateBattingOrder("away", newOrder)}
              missingPlayers={awayMissingPlayers}
              minPlayers={MIN_PLAYERS}
              isTeamNameLocked={awayTeamNameLocked}
              setTeamNameLocked={setAwayTeamNameLocked}
            />
          </TabsContent>
        </Tabs>

        {/* Selector de número de entradas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Número de Entradas</CardTitle>
            <CardDescription>Selecciona cuántas entradas tendrá el partido</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={totalInnings.toString()}
              onValueChange={(value) => setTotalInnings(Number.parseInt(value, 10))}
              className="flex flex-wrap justify-center gap-2"
            >
              {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                <div key={num} className="flex items-center">
                  <RadioGroupItem value={num.toString()} id={`innings-${num}`} className="peer sr-only" />
                  <Label
                    htmlFor={`innings-${num}`}
                    className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-muted 
                              bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-baseball-blue 
                              peer-data-[state=checked]:bg-baseball-blue peer-data-[state=checked]:text-white"
                  >
                    {num}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Selector de quién batea primero */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>¿Quién batea primero?</CardTitle>
            <CardDescription>Selecciona el equipo que iniciará bateando</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={battingFirst}
              onValueChange={(value) => setBattingFirst(value as "away" | "home")}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="away" id="away" />
                <Label htmlFor="away" className="font-medium">
                  {awayTeam.name} (Visitante)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="font-medium">
                  {homeTeam.name} (Local)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {(homeMissingPlayers > 0 || awayMissingPlayers > 0) && (
          <Alert variant="warning" className="mt-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Se recomienda tener al menos {MIN_PLAYERS} jugadores por equipo.
              {homeMissingPlayers > 0 && ` Equipo local: faltan ${homeMissingPlayers} jugadores.`}
              {awayMissingPlayers > 0 && ` Equipo visitante: faltan ${awayMissingPlayers} jugadores.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={startGame}
            className="bg-baseball-red hover:bg-red-700 text-white text-xl py-6 px-8"
            disabled={!canStartGame}
          >
            Start Game
          </Button>
        </div>
      </div>

      {/* Footer with secret button */}
      <SecretTeamGenerator
        onTeamsGenerated={(homeTeam, awayTeam) => {
          setHomeTeam(homeTeam)
          setAwayTeam(awayTeam)
          setHomeTeamNameLocked(true)
          setAwayTeamNameLocked(true)
        }}
      />
    </main>
  )
}

// El componente TeamSetup actualizado para usar DraggableBattingOrder
type TeamSetupProps = {
  team: Team
  setTeamName: (name: string) => void
  newPlayerName: string
  setNewPlayerName: (name: string) => void
  newPlayerNumber: string
  setNewPlayerNumber: (number: string) => void
  addPlayer: () => void
  removePlayer: (id: string) => void
  updateBattingOrder: (newOrder: string[]) => void
  missingPlayers: number
  minPlayers: number
  isTeamNameLocked: boolean
  setTeamNameLocked: (locked: boolean) => void
}

function TeamSetup({
  team,
  setTeamName,
  newPlayerName,
  setNewPlayerName,
  newPlayerNumber,
  setNewPlayerNumber,
  addPlayer,
  removePlayer,
  updateBattingOrder,
  missingPlayers,
  minPlayers,
  isTeamNameLocked,
  setTeamNameLocked,
}: TeamSetupProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>
            {isTeamNameLocked
              ? "El nombre del equipo está confirmado. Ahora puedes agregar jugadores."
              : "Primero, ingresa el nombre del equipo y confírmalo."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <div className="flex gap-2">
                <Input
                  id="teamName"
                  value={team.name}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="text-lg"
                  disabled={isTeamNameLocked}
                />
                <Button
                  onClick={() => setTeamNameLocked(!isTeamNameLocked)}
                  className={isTeamNameLocked ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"}
                >
                  {isTeamNameLocked ? (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-1" />
                      Confirmar
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Label>Add Player</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Player Name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  disabled={!isTeamNameLocked}
                />
                <Input
                  placeholder="Number (optional)"
                  value={newPlayerNumber}
                  onChange={(e) => setNewPlayerNumber(e.target.value)}
                  className="w-32"
                  disabled={!isTeamNameLocked}
                />
                <Button onClick={addPlayer} className="bg-baseball-blue" disabled={!isTeamNameLocked}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {!isTeamNameLocked && (
                <p className="text-sm text-amber-600 mt-2">
                  Debes confirmar el nombre del equipo antes de agregar jugadores.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Batting Order
            {missingPlayers > 0 && (
              <span className="text-amber-600 text-sm font-normal ml-2">
                (Faltan {missingPlayers} jugadores para llegar al mínimo de {minPlayers})
              </span>
            )}
          </CardTitle>
          <CardDescription>Arrastra y suelta los jugadores para cambiar el orden de bateo</CardDescription>
        </CardHeader>
        <CardContent>
          <DraggableBattingOrder
            players={team.players}
            battingOrder={team.battingOrder}
            onOrderChange={updateBattingOrder}
            onRemovePlayer={removePlayer}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para el botón secreto
function SecretTeamGenerator({
  onTeamsGenerated,
}: {
  onTeamsGenerated: (homeTeam: Team, awayTeam: Team) => void
}) {
  const [clickCount, setClickCount] = useState(0)

  // Use useEffect to handle the side effect when clickCount reaches 7
  useEffect(() => {
    if (clickCount === 7) {
      // Generate teams when click count reaches 7
      generateTeams()
      // Reset the counter
      setClickCount(0)
    }
  }, [clickCount])

  const handleClick = () => {
    // Just increment the counter, the effect will handle team generation
    setClickCount((prev) => prev + 1)
  }

  const generateTeams = () => {
    // Generate Yankees players
    const yankeesPlayers = Array.from({ length: 7 }, (_, i) => ({
      id: uuidv4(),
      name: `Yankees Player ${i + 1}`,
      number: `${Math.floor(Math.random() * 99) + 1}`,
    }))

    // Generate Dodgers players
    const dodgersPlayers = Array.from({ length: 7 }, (_, i) => ({
      id: uuidv4(),
      name: `Dodgers Player ${i + 1}`,
      number: `${Math.floor(Math.random() * 99) + 1}`,
    }))

    const homeTeam = {
      name: "Yankees",
      players: yankeesPlayers,
      battingOrder: yankeesPlayers.map((p) => p.id),
      currentBatterIndex: 0,
    }

    const awayTeam = {
      name: "Dodgers",
      players: dodgersPlayers,
      battingOrder: dodgersPlayers.map((p) => p.id),
      currentBatterIndex: 0,
    }

    onTeamsGenerated(homeTeam, awayTeam)
  }

  return (
    <div className="mt-8 text-center text-gray-500 text-sm pb-4">
      <div className="cursor-pointer" onClick={handleClick}>
        STRIKES & BALLS: Tu pizarra digital.
        {clickCount > 0 && clickCount < 7 && (
          <div className="text-xs mt-1 opacity-30">{7 - clickCount} clicks more for teams</div>
        )}
      </div>
    </div>
  )
}
