import db from '../config/database.js'
import { NoData, DuplicateInfo } from '../schemas/errorSchema.js'
import bcrypt from 'bcrypt'

export class UserModel {
  static async getAll () {
    try {
      const [result] = await db.query(`SELECT BIN_TO_UUID(id_usuario) id, numero_documento_usuario,primer_nombre_usuario,primer_apellido_usuario,correo_usuario,telefono_usuario,estado_usuario FROM usuarios
      WHERE id_tipo_usuario = 2`)
      if (result.length === 0) {
        throw new NoData()
      }
      return result
    } catch (error) {
      return (error)
    }
  }

  static async getById ({ id }) {
    try {
      const [[result]] = await db.query(`
      SELECT BIN_TO_UUID(id_usuario) id, numero_documento_usuario,primer_nombre_usuario,segundo_nombre_usuario,primer_apellido_usuario,segundo_apellido_usuario,correo_usuario,usuarios.estado_usuario,tipo_usuario.descripcion_usuario,tipo_usuario.id_tipo_usuario,genero.id_genero, link_foto_usuario, telefono_usuario,direccion_usuario,fecha_nacimiento_usuario
      FROM usuarios
      INNER JOIN tipo_usuario ON usuarios.id_tipo_usuario = tipo_usuario.id_tipo_usuario
      INNER JOIN genero ON genero.id_genero = usuarios.id_genero
      WHERE id_usuario = UUID_TO_BIN(?);`, [id])
      if (!result) throw new NoData()
      return result
    } catch (err) {
      return err
    }
  }

  static async createUser (input) {
    try {
      const { correoUsuario, passwordUsuario, idGenero, idTipoUsuario, numeroDocumentoUsuario, primerNombreUsuario, segundoNombreUsuario, primerApellidoUsuario, segundoApellidoUsuario, linkFoto, telefonoUsuario, direccionUsuario, fechaNacimientoUsuario } = input

      const [[existingData]] = await db.query(`
        SELECT numero_documento_usuario
        FROM usuarios
        WHERE u.correo_usuario = ? OR numero_documento_empleado = ?`, [correoUsuario, numeroDocumentoUsuario])
      if (existingData) throw new DuplicateInfo()

      const saltRounds = 10
      const encryPassword = await bcrypt.hash(passwordUsuario, saltRounds)
      const [usuario] = await db.query(`INSERT INTO usuarios (correo_usuario, password_usuario, estado_usuario,id_genero, id_tipo_usuario,numero_documento_usuario, primer_nombre_usuario, segundo_nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario,telefono_usuario,direccion_usuario,fecha_nacimiento_usuario,link_foto_usuario) 
      VALUES (?,?,1,?,?,?,?,?,?,?,?,?,?,?);
      `, [correoUsuario, encryPassword, idGenero, idTipoUsuario, numeroDocumentoUsuario, primerNombreUsuario, segundoNombreUsuario, primerApellidoUsuario, segundoApellidoUsuario, telefonoUsuario, direccionUsuario, fechaNacimientoUsuario, linkFoto])
      return usuario
    } catch (err) {
      return err
    }
  }
}
