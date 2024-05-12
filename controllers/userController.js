import { UserModel } from '../models/userModel.js'
import { NoData } from '../schemas/errorSchema.js'

export class UserController {
  static async getAll (req, res) {
    const response = await UserModel.getAll()
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }
}
