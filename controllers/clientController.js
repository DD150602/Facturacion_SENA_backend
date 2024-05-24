import { ClientModel } from '../models/clientModel.js'
import { NoData, DuplicateInfo, DocumentInUse, AccountAlreadyDisable, ActionNotAllowed } from '../schemas/errorSchema.js'
import { validateClientDataCreate } from '../schemas/client.js'
export class ClientController {
  static async createClient (req, res) {
    const result = validateClientDataCreate(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await ClientModel.createClient(result.data)
    if (response instanceof DuplicateInfo) {
      res.status(400).json({ message: 'El cliente ya esta registrado' })
    } else if (response instanceof Error) {
      res.status(500).json({ message: 'Error interno del servidor ' })
    } else {
      res.json({ message: 'Cliente creado exitosamente' })
    }
  }
}
