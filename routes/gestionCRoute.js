import { Router } from 'express'
import gestionController from '../controllers/gestionController.js'

export const ClienteRouter = Router()

ClienteRouter.get('/', gestionController.getAllCliente)
ClienteRouter.get('/:id', gestionController.getAllComprasById)
ClienteRouter.get('/get_cliente/:id', gestionController.getClienteById)
ClienteRouter.patch('/update_cliente/:id', gestionController.updateClienteById)
