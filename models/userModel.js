import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'

export class UserModel {
  static async getAll () {
    try {
      const [result] = await db.query(`SELECT numero_documento_usuario,primer_nombre_usuario,primer_apellido_usuario,correo_usuario,telefono_usuario,estado_usuario FROM usuarios
      WHERE id_tipo_usuario = 2`)
      if (result.length === 0) {
        throw new NoData()
      }
      return result
    } catch (error) {
      return (error)
    }
  }
}
