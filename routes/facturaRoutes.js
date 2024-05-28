import { Router } from 'express'
import { FacturaController } from '../controllers/facturasControllers.js'

export const FacturaRoute = Router()

FacturaRoute.get('/ver-factura', FacturaController.getAll)
FacturaRoute.get('/busquedaId:id', FacturaController.getById)
FacturaRoute.post('/create', FacturaController.createFactura)
FacturaRoute.put('/update:id', FacturaController.updateFactura)
FacturaRoute.delete('/delete:id', FacturaController.deleteFactura)
