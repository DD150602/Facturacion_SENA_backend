import { ClientModel } from '../models/clientModel.js'
import { NoData, DuplicateInfo } from '../schemas/errorSchema.js'
import { validateClientDataCreate, validateClientById } from '../schemas/client.js'
export class ClientController {
  static async verifyClient (req, res) {
    const { numeroDocumentoClient } = req.params
    const result = validateClientById({ numeroDocumentoClient })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await ClientModel.verifyClient(result.data)
    if (response instanceof NoData) return res.status(404).json({ message: 'Cliente con encontrado' })
    return res.json(response)
  }

  static async createClient (req, res) {
    const result = validateClientDataCreate(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await ClientModel.createClient(result.data)
    if (response instanceof DuplicateInfo) res.status(400).json({ message: 'El cliente ya esta registrado' })
    if (response instanceof Error) res.status(500).json({ message: 'Error interno del servidor ' })
    return res.json({ message: 'Cliente creado exitosamente' })
  }
}
