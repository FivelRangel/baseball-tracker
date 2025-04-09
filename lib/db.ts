import { Pool } from "pg"

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Función para ejecutar consultas SQL
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    // Crear tabla de juegos
    await query(`
      CREATE TABLE IF NOT EXISTS games (
        id VARCHAR(255) PRIMARY KEY,
        game_state JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize database", error)
    return false
  }
}

// Función para guardar un juego
export async function saveGame(gameId: string, gameState: any) {
  try {
    const result = await query(
      `
      INSERT INTO games (id, game_state) 
      VALUES ($1, $2)
      ON CONFLICT (id) 
      DO UPDATE SET 
        game_state = $2,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
      `,
      [gameId, JSON.stringify(gameState)],
    )

    return result.rows[0].id
  } catch (error) {
    console.error("Error saving game", error)
    throw error
  }
}

// Función para obtener un juego
export async function getGame(gameId: string) {
  try {
    const result = await query("SELECT game_state FROM games WHERE id = $1", [gameId])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0].game_state
  } catch (error) {
    console.error("Error getting game", error)
    throw error
  }
}

// Función para verificar si un juego existe
export async function gameExists(gameId: string) {
  try {
    const result = await query("SELECT 1 FROM games WHERE id = $1", [gameId])

    return result.rows.length > 0
  } catch (error) {
    console.error("Error checking if game exists", error)
    throw error
  }
}
