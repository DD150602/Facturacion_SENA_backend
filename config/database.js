import mysql2 from 'mysql2/promise'
import { DATABASE_NAME, DATABASE_PORT, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USER } from './envVariables.js'

const CONNECTION_STRING = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  port: DATABASE_PORT,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME
}

let db

try {
  db = await mysql2.createConnection(CONNECTION_STRING)
  console.log('conectado con exito')
} catch (error) {
  console.log('no se pudo conectar')
}

export default db
