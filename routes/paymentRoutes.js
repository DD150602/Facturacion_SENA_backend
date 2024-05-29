import { Router } from 'express'
import { PaymentController } from '../controllers/paymentController.js'
export const paymentRoutes = Router()

paymentRoutes.get('/:id', PaymentController.getData)
paymentRoutes.get('/abono/:id', PaymentController.getDataById)
paymentRoutes.post('/', PaymentController.createPayment)
