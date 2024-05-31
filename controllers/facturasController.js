import { InvoiceModel } from '../models/facturasModels.js'
import { NoData, DuplicateInfo } from '../schemas/errorSchema.js'
import { validateInvoiceById, validateInvoiceDataCreate, validacionSend } from '../schemas/errorFacturacion.js'

export class FacturaController {
  static async getAll (req, res) {
    const response = await InvoiceModel.getAll()
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async getTipoProducto (req, res) {
    const response = await InvoiceModel.getTipoCuota()
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.send(response)
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
    const response = await InvoiceModel.createInvoice(result.data)
    if (response instanceof DuplicateInfo) {
      res.status(400).json({ message: 'La factura ya está registrada' })
    } else if (response instanceof Error) {
      res.status(500).json({ message: 'Error interno del servidor ' })
    } else {
      res.json({ message: 'Factura creada exitosamente' })
    }
  }

  static async sendFacturaController (req, res) {
    const result = validacionSend(req.body)
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await InvoiceModel.sendFactura(result.data)
    if (response instanceof Error) {
      res.status(500).json({ message: 'Error interno del servidor ' })
    } else {
      res.json({ message: 'Factura enviada con exito' })
    }
  }
}
