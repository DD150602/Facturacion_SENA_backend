import { PaymentModel } from '../models/paymentModel.js'
import { NoData } from '../schemas/errorSchema.js'
import { validateUserById } from '../schemas/user.js'

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
}
import { PaymentModel } from "../models/paymentModel.js"
import { NoData } from "../schemas/errorSchema.js"
import { validateUserById } from "../schemas/user.js"

export class PaymentController {
  static async getData(req,res){
    const { id } = req.params
    const result = validateUserById({ id })
    if (!result.success) return res.status(400).json(`${JSON.parse(result.error.message)[0].message}`)
    const response = await PaymentModel.getData(result.data)
    if (response instanceof NoData) return res.status(404).json('No se han encontrado datos para cargar.')
    if (response instanceof Error) return res.status(500).json('Error interno en el servidor')
    return res.json(response)
  }
}