import { ClientModel } from '../models/clientModel.js'
import { NoData, DuplicateInfo } from '../schemas/errorSchema.js'
import { validateClientDataCreate, validateClientById } from '../schemas/client.js'
import { UploadFilesModel } from '../models/uploadFilesModel.js'
export class ClientController {
  static async verifyClient (req, res) {
    const { numeroDocumentoClient } = req.params
    const result = validateClientById({ numeroDocumentoClient })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await ClientModel.verifyClient(result.data)
    if (response instanceof NoData) return res.status(404).json({ message: 'Cliente con encontrado' })
    return res.json(response)
  }

  static async getData (req, res) {
    const response = await ClientModel.getData()
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async createClient (req, res) {
    const result = validateClientDataCreate(req.body)
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })

    const { files } = req
    files ? result.data.linkFoto = await UploadFilesModel.uploadFiles(files, 'photos_profile') : result.data.linkFoto = null
    if (result.data.linkFoto instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })

    const response = await ClientModel.createClient(result.data)
    if (response instanceof DuplicateInfo) return res.status(400).json({ message: 'El cliente ya esta registrado' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    return res.json({ message: 'Cliente creado exitosamente' })
  }

  static async getContactInfoCliente (req, res) {
    const { id } = req.params
    const response = await ClientModel.getContactInfoClient(id)
    if (response instanceof NoData) return res.status(404).json({ message: 'No se han encontrado datos para cargar.' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno en el servidor' })
    return res.json(response)
  }
}
