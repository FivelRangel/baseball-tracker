// Esta es una configuración de ejemplo para un servidor Socket.IO real
// En una aplicación de producción, esto se conectaría a un servidor real

export const SOCKET_SERVER_URL = "https://mock-baseball-server.example.com"

export const SOCKET_OPTIONS = {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
}

// Eventos del socket
export const SOCKET_EVENTS = {
  // Eventos del cliente
  CREATE_GAME: "createGame",
  JOIN_GAME: "joinGame",
  UPDATE_GAME_STATE: "updateGameState",
  REQUEST_GAME_STATE: "requestGameState",

  // Eventos del servidor
  GAME_STATE: "gameState",
  GAME_CREATED: "gameCreated",
  GAME_JOINED: "gameJoined",
  ERROR: "error",
}
