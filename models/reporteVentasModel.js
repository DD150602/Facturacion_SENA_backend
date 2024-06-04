import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'

export default class ReporteVentasModel {
  static async getAll () {
    try {
      const [users] = await db.query(
        `SELECT BIN_TO_UUID(id_usuario) id, CONCAT_WS(' ', primer_nombre_usuario, primer_apellido_usuario) AS nombre, correo_usuario, numero_documento_usuario, descripcion_zona
        FROM usuarios
        INNER JOIN zonas ON usuarios.id_zona = zonas.id_zona
        WHERE estado_usuario = 1 AND id_tipo_usuario = 2`
      )
      if (!users) throw new NoData()
      if (users.length === 0) throw new NoData()

      return users
    } catch (error) {
      return error
    }
  }

  static async getInfoForReport ({ id, input }) {
    try {
      const { month = null, year = null } = input
      const [[info]] = await db.query(
        `SELECT CONCAT_WS(' ', primer_nombre_usuario, segundo_nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario) AS nombre_usuario,correo_usuario, telefono_usuario, link_foto_usuario
        FROM usuarios
        WHERE usuarios.id_usuario = UUID_TO_BIN(?)`, [id]
      )

      let query = `SELECT id_factura AS id, CONCAT_WS(' ', primer_nombre_cliente, primer_apellido_cliente) AS nombre_cliente, correo_cliente, valor_neto_factura
      FROM facturas
      INNER JOIN clientes ON facturas.id_cliente = clientes.id_cliente
      WHERE facturas.id_usuario = UUID_TO_BIN(?)`

      const params = [id]
      if (month && year) {
        query += ' AND MONTH(facturas.fecha_factura) = ? AND YEAR(facturas.fecha_factura) = ?'
        params.push(month, year)
      } else if (month) {
        query += ' AND MONTH(facturas.fecha_factura) = ?'
        params.push(month)
      } else if (year) {
        query += ' AND YEAR(facturas.fecha_factura) = ?'
        params.push(year)
      }

      const [infoFacturas] = await db.query(query, params)

      if (!info) throw new NoData()
      if (info.length === 0) throw new NoData()

      return { ...info, infoFacturas }
    } catch (error) {
      return error
    }
  }
}
