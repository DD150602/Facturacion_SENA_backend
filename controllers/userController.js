import { UserModel } from '../models/userModel.js'
import { NoData, DuplicateInfo, DocumentInUse, AccountAlreadyDisable, ActionNotAllowed } from '../schemas/errorSchema.js'
import { validateUserById, validateUserDataCreate, validateUserDataUpdate, validateUserDelete } from '../schemas/user.js'
import { UploadFilesModel } from '../models/uploadFilesModel.js'

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

  static async getByZone (req, res) {
    const { id } = req.params
    const result = validateUserById({ id })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await UserModel.getByZone(result.data)
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async createUser (req, res) {
    const result = validateUserDataCreate(req.body)
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })
    const { files } = req
    files ? result.data.linkFoto = await UploadFilesModel.uploadFiles(files, 'photos_profile') : result.data.linkFoto = null
    if (result.data.linkFoto instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
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
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })

    const { files } = req
    if (files) result.data.linkFoto = await UploadFilesModel.uploadFiles(files, 'photos_profile')
    if (result.data.linkFoto instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })

    const response = await UserModel.updateUser({ id: resultId.data.id, input: result.data })
    if (response instanceof DuplicateInfo) return res.status(409).json({ message: 'El correo electronico ya se encuentra en uso' })
    if (response instanceof DocumentInUse) return res.status(404).json({ message: 'El numero de documento ya se encuentra en uso' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    res.json({ message: 'Actualizado con exito' })
  }

  static async disableUser (req, res) {
    const { id } = req.params
    const resultId = validateUserById({ id })
    if (!resultId.success) return res.status(400).json(`${JSON.parse(resultId.error.message)[0].message}`)

    const result = validateUserDelete(req.body)
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })

    const response = await UserModel.deleteUser({ id: resultId.data.id, input: result.data })
    if (response instanceof AccountAlreadyDisable) return res.status(409).json({ message: 'El Usuario ya ha sido desabilitado' })
    if (response instanceof NoData) return res.status(404).json({ message: 'Usuario no registrado' })
    if (response instanceof ActionNotAllowed) return res.status(409).json({ message: 'No se puede deshabilitar este usuario ya que no existen otros de este tipo en el sistema' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor' })
    res.json({ message: 'Usuario desactivado satisfactoriamente' })
  }

  static async getUserType (req, res) {
    const response = await UserModel.getUserType()
    if (response instanceof NoData) return res.status(404).json({ message: 'No hay datos de tipos de usuarios que cargar' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    res.json(response)
  }

  static async getGenreTypes (req, res) {
    const response = await UserModel.getGenreTypes()
    if (response instanceof NoData) return res.status(404).json({ message: 'No hay generos existentes' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    res.json(response)
  }
}
