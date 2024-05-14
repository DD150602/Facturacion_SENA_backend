import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const UserRoute = Router()

UserRoute.get('/', UserController.getAll)
UserRoute.get('/:id', UserController.getById)
