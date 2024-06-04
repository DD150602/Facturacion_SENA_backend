import ProductModel from '../models/productModel.js'
import { NoData } from '../schemas/errorSchema.js'
import { validateProduct, validateProductDelete } from '../schemas/products.js'
import { UploadFilesModel } from '../models/uploadFilesModel.js'

export default class ProductController {
  static async getAllProducts (req, res) {
    const response = await ProductModel.getAllProducts()
    if (response instanceof NoData) return res.status(404).json({ message: 'No hay datos' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }

  static async getProductsById (req, res) {
    const { id } = req.params
    const response = await ProductModel.getProductsById(id)
    if (response instanceof NoData) return res.status(404).json({ message: 'No existe este producto' })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }

  static async createProduct (req, res) {
    const result = validateProduct(req.body)
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })
    const { files } = req
    files ? result.data.linkFotoProducto = await UploadFilesModel.uploadFiles(files, 'photos_product') : result.data.linkFotoProducto = null
    if (result.data.linkFoto instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })
    const response = await ProductModel.createProduct({ input: result.data })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }

  static async updateProduct (req, res) {
    const { id } = req.params

    const result = validateProduct(req.body)
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })

    const { files } = req
    console.log(files)
    if (files) result.data.linkFotoProducto = await UploadFilesModel.uploadFiles(files, 'photos_product')
    if (result.data.linkFoto instanceof Error) return res.status(500).json({ message: 'Error interno del servidor ' })

    const response = await ProductModel.updateProduct({ id, input: result.data })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }

  static async deleteProduct (req, res) {
    const { id } = req.params

    const result = validateProductDelete(req.body)
    if (!result.success) return res.status(400).json({ objectError: result.error.errors })

    const response = await ProductModel.deleteProduct({ id, input: result.data })
    if (response instanceof Error) return res.status(500).json({ message: 'Error en el servidor' })
    res.json(response)
  }
};
