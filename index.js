import express, { json } from 'express'
import { PORT } from './config/envVariables.js'
import corsMiddleware from './middlewares/cors.middleware.js'
import productRouter from './routes/productRouter.js'

const app = express()
app.use(corsMiddleware())
app.use(json())

app.get('/', (req, res) => res.json('Hello World!'))

app.use('/products', productRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT ?? 1234}`))
