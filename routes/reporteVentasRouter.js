import { Router } from 'express'
import ReporteVentasController from '../controllers/reporteVentasController.js'

const repoteVentasRouter = Router()

repoteVentasRouter.get('/', ReporteVentasController.getAll)

export default repoteVentasRouter
