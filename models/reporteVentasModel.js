import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'

export default class ReporteVentasModel {
  static async getAll () {
    try {
      const [users] = await db.query(
        `SELECT BIN_TO_UUID(id_usuario) id_usuario, CONCAT_WS(' ', primer_nombre_usuario, primer_apellido_usuario) AS nombre, correo_usuario
        FROM usuarios
        WHERE estado_usuario = 1 AND id_tipo_usuario = 2`
      )
      if (!users) throw new NoData()
      if (users.length === 0) throw new NoData()

      return users
    } catch (error) {
      return error
    }
  }
}
