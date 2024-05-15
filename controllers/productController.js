import ProductModel from '../models/productModel.js'
import { NoData } from '../schemas/errorSchema.js'
import { validateProduct } from '../schemas/products.js'

export default class ProductController {
  static async getAllProducts (req, res) {
    const response = await ProductModel.getAllProducts()
    if (response instanceof NoData) return res.status(204).json({ message: 'No hay datos' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }

  static async getProductsById (req, res) {
    const { id } = req.params
    const response = await ProductModel.getProductsById(id)
    if (response instanceof NoData) return res.status(204).json({ message: 'No hay datos' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }

  static async createProduct (req, res) {
    const result = validateProduct(req.body)
    if (!result.success) return res.status(400).json({ message: JSON.parse(result.error.message)[0].message })

    const response = await ProductModel.createProduct({ input: result.data })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }

  static async updateProduct (req, res) {
    const { id } = req.params
    const result = validateProduct(req.body)
    if (!result.success) return res.status(400).json({ message: JSON.parse(result.error.message)[0].message })
    const response = await ProductModel.updateProduct({ id, input: result.data })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }
};
