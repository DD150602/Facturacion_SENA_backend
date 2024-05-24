import { Router } from 'express'
import { ClientController } from '../controllers/clientController.js'

export const ClientRoute = Router()

ClientRoute.post('/', ClientController.createClient)
