/* eslint-disable camelcase */
import db from '../config/database.js'

export default class LoginModel {
  static async getUserByUsername (correo_usuario) {
    try {
      const [user] = await db.query('SELECT BIN_TO_UUID(id_usuario) AS id, correo_usuario, password_usuario, numero_documento_usuario, primer_nombre_usuario, primer_apellido_usuario, telefono_usuario, direccion_usuario, id_genero, id_tipo_usuario, BIN_TO_UUID(id_zona) id_zona, estado_usuario FROM usuarios WHERE correo_usuario = ?', [correo_usuario])
      return user
    } catch (error) {
      return error
    }
  }
}
