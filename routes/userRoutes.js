import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const UserRoute = Router()

UserRoute.get('/', UserController.getAll)
UserRoute.get('/:id', UserController.getById)
UserRoute.get('/zona/:id', UserController.getByZone)
UserRoute.get('/generos', UserController.getGenreTypes)
UserRoute.get('/tipousuario', UserController.getUserType)
UserRoute.post('/', UserController.createUser)
UserRoute.patch('/:id', UserController.updateUser)
UserRoute.patch('/desabilitar/:id', UserController.disableUser)
