"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGameStore } from "@/lib/game-store"
import { ChevronRight, Plus, RefreshCw, RotateCcw, X, Undo2, CornerDownLeft, Flag, UserX } from "lucide-react"

export default function GameControls() {
  const {
    gameState,
    addBall,
    addStrike,
    addOut,
    resetCount,
    advanceRunner,
    clearBases,
    addRun,
    nextBatter,
    switchSides,
    endGame,
    getCurrentBatterId,
    undoLastAction,
    returnRunner,
    endTeamTurn,
    strikeOutRunner,
    isGameOver,
  } = useGameStore()

  // Verificar si el juego ha terminado
  const gameOver = isGameOver()

  // Función para manejar un hit simple
  const handleSingle = () => {
    // Si hay corredor en tercera, avanza a home
    if (gameState.bases.third) {
      advanceRunner("third", "home")
    }

    // Si hay corredor en segunda, avanza a tercera
    if (gameState.bases.second) {
      advanceRunner("second", "third")
    }

    // Si hay corredor en primera, avanza a segunda
    if (gameState.bases.first) {
      advanceRunner("first", "second")
    }

    // El bateador avanza a primera
    advanceRunner("home", "first")
  }

  // Función para manejar un doble
  const handleDouble = () => {
    // Si hay corredor en tercera, avanza a home
    if (gameState.bases.third) {
      advanceRunner("third", "home")
    }

    // Si hay corredor en segunda, avanza a home
    if (gameState.bases.second) {
      advanceRunner("second", "home")
    }

    // Si hay corredor en primera, avanza a tercera
    if (gameState.bases.first) {
      advanceRunner("first", "third")
    }

    // El bateador avanza a segunda
    advanceRunner("home", "second")
  }

  // Función para manejar un triple
  const handleTriple = () => {
    // Si hay corredor en tercera, avanza a home
    if (gameState.bases.third) {
      advanceRunner("third", "home")
    }

    // Si hay corredor en segunda, avanza a home
    if (gameState.bases.second) {
      advanceRunner("second", "home")
    }

    // Si hay corredor en primera, avanza a home
    if (gameState.bases.first) {
      advanceRunner("first", "home")
    }

    // El bateador avanza a tercera
    advanceRunner("home", "third")
  }

  // Función para manejar un home run
  const handleHomeRun = () => {
    // Si hay corredor en tercera, avanza a home
    if (gameState.bases.third) {
      advanceRunner("third", "home")
    }

    // Si hay corredor en segunda, avanza a home
    if (gameState.bases.second) {
      advanceRunner("second", "home")
    }

    // Si hay corredor en primera, avanza a home
    if (gameState.bases.first) {
      advanceRunner("first", "home")
    }

    // El bateador avanza a home
    advanceRunner("home", "home")

    // Avanzar al siguiente bateador
    nextBatter()
  }

  // Función para manejar un out directo
  const handleDirectOut = () => {
    // Agregar un out
    addOut()

    // Avanzar al siguiente bateador
    nextBatter()
  }

  return (
    <div className="space-y-4">
      {/* Mensaje de juego terminado */}
      {gameOver && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-md text-center mb-4">
          <h3 className="font-bebas text-xl">¡JUEGO TERMINADO!</h3>
          <p>El partido ha finalizado. Todos los controles están deshabilitados.</p>
        </div>
      )}

      {/* Botón de OUT grande e independiente */}
      <Button
        onClick={handleDirectOut}
        className="w-full py-4 text-xl font-bebas bg-red-600 hover:bg-red-700 text-white"
        disabled={gameOver}
      >
        <X className="h-5 w-5 mr-2" />
        OUT
      </Button>

      <Card className="p-4">
        <h3 className="font-bebas text-xl mb-3 text-baseball-blue">COUNT CONTROLS</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={addBall}
            className="admin-button-outline flex items-center justify-center"
            disabled={gameOver}
          >
            <Plus className="h-4 w-4 mr-1" />
            Ball
          </Button>

          <Button
            onClick={addStrike}
            className="admin-button-outline flex items-center justify-center"
            disabled={gameOver}
          >
            <Plus className="h-4 w-4 mr-1" />
            Strike
          </Button>

          <Button
            onClick={resetCount}
            className="admin-button-outline flex items-center justify-center col-span-2"
            disabled={gameOver}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset Count
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bebas text-xl mb-3 text-baseball-blue">BATTER ACTIONS</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleSingle} className="admin-button-primary" disabled={gameOver}>
            Single
          </Button>

          <Button onClick={handleDouble} className="admin-button-primary" disabled={gameOver}>
            Double
          </Button>

          <Button onClick={handleTriple} className="admin-button-primary" disabled={gameOver}>
            Triple
          </Button>

          <Button
            onClick={handleHomeRun}
            className="admin-button-primary bg-amber-500 hover:bg-amber-600 border-amber-500"
            disabled={gameOver}
          >
            Home Run
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bebas text-xl mb-3 text-baseball-blue">RUNNER CONTROLS</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => advanceRunner("first", "second")}
            className="admin-button-secondary"
            disabled={!gameState.bases.first || gameOver}
          >
            1st → 2nd
          </Button>

          <Button
            onClick={() => advanceRunner("second", "third")}
            className="admin-button-secondary"
            disabled={!gameState.bases.second || gameOver}
          >
            2nd → 3rd
          </Button>

          <Button
            onClick={() => advanceRunner("first", "third")}
            className="admin-button-secondary"
            disabled={!gameState.bases.first || gameOver}
          >
            1st → 3rd
          </Button>

          <Button
            onClick={() => advanceRunner("third", "home")}
            className="admin-button-secondary"
            disabled={!gameState.bases.third || gameOver}
          >
            3rd → Home
          </Button>

          {/* Botones para regresar corredores */}
          <Button
            onClick={() => returnRunner("second", "first")}
            className="admin-button-outline flex items-center justify-center"
            disabled={!gameState.bases.second || gameOver}
          >
            <CornerDownLeft className="h-4 w-4 mr-1" />
            2nd → 1st
          </Button>

          <Button
            onClick={() => returnRunner("third", "second")}
            className="admin-button-outline flex items-center justify-center"
            disabled={!gameState.bases.third || gameOver}
          >
            <CornerDownLeft className="h-4 w-4 mr-1" />
            3rd → 2nd
          </Button>

          <Button onClick={clearBases} className="admin-button-outline col-span-2" disabled={gameOver}>
            Clear Bases
          </Button>
        </div>
      </Card>

      {/* Nueva sección para ponchar corredores específicos */}
      <Card className="p-4">
        <h3 className="font-bebas text-xl mb-3 text-baseball-blue">STRIKE OUT RUNNERS</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => strikeOutRunner("first")}
            className="admin-button-outline flex items-center justify-center bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
            disabled={!gameState.bases.first || gameOver}
          >
            <UserX className="h-4 w-4 mr-1" />
            1st Base
          </Button>

          <Button
            onClick={() => strikeOutRunner("second")}
            className="admin-button-outline flex items-center justify-center bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
            disabled={!gameState.bases.second || gameOver}
          >
            <UserX className="h-4 w-4 mr-1" />
            2nd Base
          </Button>

          <Button
            onClick={() => strikeOutRunner("third")}
            className="admin-button-outline flex items-center justify-center bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
            disabled={!gameState.bases.third || gameOver}
          >
            <UserX className="h-4 w-4 mr-1" />
            3rd Base
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bebas text-xl mb-3 text-baseball-blue">GAME CONTROLS</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={switchSides}
            className="admin-button-outline flex items-center justify-center"
            disabled={gameOver}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Switch Sides
          </Button>

          <Button
            onClick={nextBatter}
            className="admin-button-outline flex items-center justify-center"
            disabled={gameOver}
          >
            <ChevronRight className="h-4 w-4 mr-1" />
            Next Batter
          </Button>

          {/* Nuevo botón para terminar el turno del equipo */}
          <Button
            onClick={endTeamTurn}
            className="admin-button-outline flex items-center justify-center col-span-2 border-blue-500 text-blue-600 hover:bg-blue-50"
            disabled={gameOver}
          >
            <Flag className="h-4 w-4 mr-1" />
            Terminar Turno del Equipo
          </Button>

          {/* Botón para deshacer la última acción */}
          <Button
            onClick={undoLastAction}
            className="admin-button-outline flex items-center justify-center col-span-2 border-amber-500 text-amber-600 hover:bg-amber-50"
            disabled={!gameState.lastAction || gameOver}
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Deshacer última acción
            {gameState.lastAction && <span className="ml-1 text-xs">({gameState.lastAction.type})</span>}
          </Button>

          <Button
            onClick={endGame}
            className="admin-button-outline col-span-2 border-red-500 text-red-500 hover:bg-red-50"
            disabled={gameOver}
          >
            End Game
          </Button>
        </div>
      </Card>
    </div>
  )
}
