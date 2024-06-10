import mysql2 from 'mysql2/promise'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import 'dotenv/config'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadPath = path.join(__dirname, '../certificados/DigiCertGlobalRootCA.crt.pem')

const CONNECTION_STRING = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { ca: fs.readFileSync(uploadPath) }
}

let db

try {
  db = await mysql2.createConnection(CONNECTION_STRING)
  console.log('conectado con exito')
} catch (error) {
  console.log('no se pudo conectar')
}

export default db
