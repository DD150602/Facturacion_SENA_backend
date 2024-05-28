import { InvoiceModel } from '../models//facturasModels.js'
import { NoData, DuplicateInfo, AccountAlreadyDisable } from '../schemas/errorSchema.js'
import { validateInvoiceById, validateInvoiceDataCreate, validateInvoiceDataUpdate, validateInvoiceDelete } from '../schemas/errorFacturacion.js'

export class FacturaController {
  static async getAll (req, res) {
    const response = await InvoiceModel.getAll()
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async getById (req, res) {
    const { id } = req.params
    const result = validateInvoiceById({ id })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await InvoiceModel.getById(result.data)
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    res.json(response)
  }

  static async createFactura (req, res) {
    const result = validateInvoiceDataCreate(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await InvoiceModel.createFactura(result.data)
    if (response instanceof DuplicateInfo) {
      res.status(400).json({ message: 'La factura ya está registrada' })
    } else if (response instanceof Error) {
      res.status(500).json({ message: 'Error interno del servidor ' })
    } else {
      res.json({ message: 'Factura creada exitosamente' })
    }
  }

  static async updateFactura (req, res) {
    const { id } = req.params
    const resultId = validateInvoiceById({ id })
    if (!resultId.success) return res.status(400).json(`${JSON.parse(resultId.error.message)[0].message}`)

    const result = validateInvoiceDataUpdate(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)

    const response = await InvoiceModel.updateFactura({ id: resultId.data.id, input: result.data })
    if (response instanceof DuplicateInfo) return res.status(409).json({ message: 'La información de la factura ya se encuentra en uso' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    res.json({ message: 'Factura actualizada con éxito' })
  }

  static async deleteFactura (req, res) {
    const { id } = req.params
    const resultId = validateInvoiceById({ id })
    if (!resultId.success) return res.status(400).json(`${JSON.parse(resultId.error.message)[0].message}`)

    const result = validateInvoiceDelete(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)

    const response = await InvoiceModel.deleteFactura({ id: resultId.data.id, input: result.data })
    if (response instanceof NoData) return res.status(404).json({ message: 'Factura no registrada' })
    if (response instanceof AccountAlreadyDisable) return res.status(409).json({ message: 'No se puede eliminar esta factura debido a restricciones' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor' })
    res.json({ message: 'Factura eliminada satisfactoriamente' })
  }
}
