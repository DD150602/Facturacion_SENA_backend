import express, { json } from 'express'
import fileUpload from 'express-fileupload'
import { PORT } from './config/envVariables.js'
import LoginRouter from './routes/loginRouter.js'
import corsMiddleware from './middlewares/cors.middleware.js'
import { UserRoute } from './routes/userRoutes.js'
import { zona } from './routes/zoneRoutes.js'
import { ClienteRouter } from './routes/gestionCRoute.js'
import productRouter from './routes/productRoutes.js'
import { ClientRoute } from './routes/clientRoutes.js'
import { uploadRouter } from './routes/uploadFilesRoutes.js'
import repoteVentasRouter from './routes/reporteVentasRouter.js'
import { paymentRoutes } from './routes/paymentRoutes.js'
import { FacturaRoute } from './routes/facturaRoutes.js'

const app = express()
app.use(corsMiddleware())
app.use(json())
app.use(fileUpload())

app.get('/', (req, res) => res.json('Hello World!'))
app.use('/usuarios', UserRoute)
app.use('/products', productRouter)
app.use('/login', LoginRouter)
app.use('/cliente', ClientRoute)
app.use('/archivos', uploadRouter)
app.use('/reporteVentas', repoteVentasRouter)
app.use('/abonos', paymentRoutes)
app.use('/facturas', FacturaRoute)
app.use("/gestion_cliente", ClienteRouter)
app.use('/zona', zona)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT ?? 1234}`))
