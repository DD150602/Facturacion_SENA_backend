import { Router } from 'express'
import { FacturaController } from '../controllers/facturasController.js'

export const FacturaRoute = Router()

FacturaRoute.get('/ver-factura', FacturaController.getAll)
FacturaRoute.get('/busquedaId:id', FacturaController.getById)
FacturaRoute.post('/create', FacturaController.createFactura)
