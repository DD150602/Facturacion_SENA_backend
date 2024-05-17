import express, { json } from 'express'
import { PORT } from './config/envVariables.js'
import LoginRouter from './routes/loginRouter.js'
import corsMiddleware from './middlewares/cors.middleware.js'

const app = express()
app.use(corsMiddleware())
app.use(json())

app.use('/login', LoginRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT ?? 1234}`))
