import express, { json } from 'express'
import { PORT } from './config/envVariables.js'
import LoginRouter from './routes/loginRouter.js'
import corsMiddleware from './middlewares/cors.middleware.js'
import { UserRoute } from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import { ClientRoute } from './routes/clientRoutes.js'
import repoteVentasRouter from './routes/reporteVentasRouter.js'

const app = express()
app.use(corsMiddleware())
app.use(json())

app.get('/', (req, res) => res.json('Hello World!'))
app.use('/usuarios', UserRoute)
app.use('/products', productRouter)
app.use('/login', LoginRouter)
app.use('/cliente', ClientRoute)
app.use('/reporteVentas', repoteVentasRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT ?? 1234}`))
