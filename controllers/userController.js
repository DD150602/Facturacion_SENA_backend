import { UserModel } from '../models/userModel.js'
import { NoData, DuplicateInfo } from '../schemas/errorSchema.js'
import { validateUserById, validateUserDataCreate } from '../schemas/user.js'

export class UserController {
  static async getAll (req, res) {
    const response = await UserModel.getAll()
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async getById (req, res) {
    const { id } = req.params
    const result = validateUserById({ id })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await UserModel.getById(result.data)
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    res.json(response)
  }

  static async createUser (req, res) {
    const result = validateUserDataCreate(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await UserModel.createUser(result.data)
    if (response instanceof DuplicateInfo) {
      res.status(400).json({ message: 'el usuario o empleado ya esta registrado' })
    } else if (response instanceof Error) {
      res.status(500).json({ message: 'Error interno del servidor ' })
    } else {
      res.json({ message: 'Empleado creado exitosamente' })
    }
  }
}
