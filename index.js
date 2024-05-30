import express, { json } from 'express'
import { PORT } from './config/envVariables.js'
import corsMiddleware from './middlewares/cors.middleware.js'
import { UserRoute } from './routes/userRoutes.js'
import productRouter from './routes/productRouter.js'
import { zona } from './routes/zoneRoutes.js'

const app = express()
app.use(corsMiddleware())
app.use(json())

app.get('/', (req, res) => res.json('Hello World!'))
app.use('/usuarios', UserRoute)

app.use('/products', productRouter)
app.use('/zona', zona )

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT ?? 1234}`))
