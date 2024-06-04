import { PaymentModel } from '../models/paymentModel.js'
import { NoData } from '../schemas/errorSchema.js'
import { validateUserById } from '../schemas/user.js'
import { validateBillById, validateCreatePayment } from '../schemas/payment.js'

export class PaymentController {
  static async getData (req, res) {
    const { id } = req.params
    const result = validateUserById({ id })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await PaymentModel.getData(result.data)
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async getDataById (req, res) {
    const { id } = req.params
    const result = validateBillById({ id })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await PaymentModel.getDataById(result.data)
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async createPayment (req, res) {
    const result = validateCreatePayment(req.body)
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })
    const response = await PaymentModel.createPayment(result.data)
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }

  static async getPaymentTypes (req, res) {
    const response = await PaymentModel.getPaymentTypes()
    if (response instanceof NoData) return res.status(404).json({ message: 'No hay tipos de pago existentes' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    res.json(response)
  }
}
