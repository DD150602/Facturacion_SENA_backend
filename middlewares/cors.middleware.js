import cors from 'cors'

const ACCPEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173'
]

export default function corsMiddleware ({ acceptedOrigins = ACCPEPTED_ORIGINS } = {}) {
  return cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) return callback(null, true)
      if (!origin) return callback(null, true)

      return callback(new Error('Not allowed by CORS'))
    }
  })
}
