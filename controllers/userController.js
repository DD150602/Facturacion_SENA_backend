import { UserModel } from '../models/userModel.js'
import { NoData, DuplicateInfo, DocumentInUse } from '../schemas/errorSchema.js'
import { validateUserById, validateUserDataCreate, validateUserDataUpdate } from '../schemas/user.js'

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
      res.status(400).json({ message: 'El usuario ya esta registrado' })
    } else if (response instanceof Error) {
      res.status(500).json({ message: 'Error interno del servidor ' })
    } else {
      res.json({ message: 'Usuario creado exitosamente' })
    }
  }

  static async updateUser (req, res) {
    const { id } = req.params
    const resultId = validateUserById({ id })
    if (!resultId.success) return res.status(400).json(`${JSON.parse(resultId.error.message)[0].message}`)

    const result = validateUserDataUpdate(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)

    const response = await UserModel.updateUser({ id: resultId.data, input: result.data })
    if (response instanceof DuplicateInfo) return res.status(409).json({ message: 'El correo electronico ya se encuentra en uso' })
    if (response instanceof DocumentInUse) return res.status(404).json({ message: 'El numero de documento ya se encuentra en uso' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    res.json({ message: 'Actualizado con exito' })
  }
}
