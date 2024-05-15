import { Router } from 'express'
import ProductController from '../controllers/productController.js'

const productRouter = Router()

productRouter.get('/', ProductController.getAllProducts)
productRouter.get('/:id', ProductController.getProductsById)
productRouter.post('/', ProductController.createProduct)
productRouter.patch('/:id', ProductController.updateProduct)

export default productRouter
