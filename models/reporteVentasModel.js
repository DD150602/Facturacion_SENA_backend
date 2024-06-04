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

  static async getInfoForReport (id) {
    try {
      const [[info]] = await db.query(
        `SELECT CONCAT_WS(' ', primer_nombre_usuario, segundo_nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario) AS nombre_usuario,correo_usuario, telefono_usuario, id_factura, CONCAT_WS(' ', primer_nombre_usuario, primer_apellido_usuario) AS nombre_cliente, correo_cliente, valor_neto_factura
        FROM usuarios
        INNER JOIN facturas ON usuarios.id_usuario = facturas.id_usuario
        INNER JOIN clientes ON facturas.id_cliente = clientes.id_cliente
        WHERE usuarios.id_usuario = UUID_TO_BIN(?)`, [id]
      )

      if (!info) throw new NoData()
      if (info.length === 0) throw new NoData()

      return info
    } catch (error) {
      return error
    }
  }
}
