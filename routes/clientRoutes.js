import { Router } from 'express'
import { ClientController } from '../controllers/clientController.js'

export const ClientRoute = Router()

ClientRoute.get('/:numeroDocumentoClient', ClientController.verifyClient)
ClientRoute.post('/', ClientController.createClient)
