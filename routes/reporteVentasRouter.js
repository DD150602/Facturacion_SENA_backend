import { Router } from 'express'
import ReporteVentasController from '../controllers/reporteVentasController.js'

const repoteVentasRouter = Router()

repoteVentasRouter.get('/', ReporteVentasController.getAll)
repoteVentasRouter.get('/:id', ReporteVentasController.getInfoForReport)
repoteVentasRouter.get('/collect/:id', ReporteVentasController.getInfoForCollectReport)

export default repoteVentasRouter
