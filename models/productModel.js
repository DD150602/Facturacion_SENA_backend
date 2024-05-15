import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'

export default class ProductModel {
  static async getAllProducts () {
    try {
      const [res] = await db.query('SELECT id_producto, nombre_producto, descripcion_producto, valor_producto, link_foto_producto FROM productos')
      if (!res) return new NoData()
      if (res.length === 0) return new NoData()
      return res
    } catch (error) {
      return error
    }
  }

  static async getProductsById (id) {
    try {
      const [res] = await db.query('SELECT id_producto, nombre_producto, descripcion_producto, valor_producto, link_foto_producto FROM productos WHERE id_producto = ?', [id])
      if (!res) return new NoData()
      if (res.length === 0) return new NoData()
      return res
    } catch (error) {
      return error
    }
  }

  static async createProduct ({ input }) {
    try {
      const { nombreProducto, descripcionProducto, valorProducto, linkFotoProducto } = input
      await db.query(`
        INSERT INTO productos (nombre_producto, descripcion_producto, valor_producto, link_foto_producto) VALUES (?, ?, ?, ?)
      `, [nombreProducto, descripcionProducto, valorProducto, linkFotoProducto])
      return 'registrado con exito'
    } catch (error) {
      return error
    }
  }

  static async updateProduct ({ id, input }) {
    try {
      const { nombreProducto, descripcionProducto, valorProducto, linkFotoProducto } = input
      await db.query(`
        UPDATE productos SET nombre_producto = ?, descripcion_producto = ?, valor_producto = ?, link_foto_producto = ? 
        WHERE id_producto = ?
      `, [nombreProducto, descripcionProducto, valorProducto, linkFotoProducto, id])

      return 'actualizado con exito'
    } catch (error) {
      return error
    }
  }
};
