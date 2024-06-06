import mysql2 from 'mysql2/promise'
import { DATABASE_NAME, DATABASE_PORT, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USER } from './envVariables.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadPath = path.join(__dirname, '../certificados/DigiCertGlobalRootCA.crt.pem')

const CONNECTION_STRING = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  port: DATABASE_PORT,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  ssl: { ca: fs.readFileSync(uploadPath) }
}

let db

try {
  console.log(CONNECTION_STRING)
  db = await mysql2.createConnection(CONNECTION_STRING)
  console.log('conectado con exito')
} catch (error) {
  console.log(error)
  console.log('no se pudo conectar')
}

export default db
