import db from '../config/database.js'
import { NoData, DuplicateInfo, DocumentInUse, AccountAlreadyDisable, ActionNotAllowed } from '../schemas/errorSchema.js'
import bcrypt from 'bcrypt'

export class UserModel {
  static async getAll () {
    try {
      const [result] = await db.query(`SELECT BIN_TO_UUID(id_usuario) id, numero_documento_usuario,CONCAT_WS(' ',primer_nombre_usuario,primer_apellido_usuario) nombre_usuario,correo_usuario,telefono_usuario,estado_usuario FROM usuarios
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
      SELECT BIN_TO_UUID(id_usuario) id, numero_documento_usuario as numeroDocumentoUsuario ,primer_nombre_usuario as primerNombreUsuario,segundo_nombre_usuario as segundoNombreUsuario,primer_apellido_usuario as primerApellidoUsuario,segundo_apellido_usuario as segundoApellidoUsuario,correo_usuario as correoUsuario,genero.id_genero as idGenero, link_foto_usuario as linkFoto, telefono_usuario as telefonoUsuario,direccion_usuario as direccionUsuario,DATE_FORMAT(fecha_nacimiento_usuario, '%Y-%m-%d') AS fechaNacimientoUsuario
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

  static async getByZone ({ id }) {
    try {
      const [result] = await db.query(`SELECT BIN_TO_UUID(id_usuario) id,CONCAT_WS(' ',numero_documento_usuario,primer_nombre_usuario,primer_apellido_usuario) AS label
      FROM usuarios
      WHERE id_zona = (SELECT id_zona from usuarios WHERE id_usuario = UUID_TO_BIN(?)) AND estado_usuario = 1 AND id_usuario != UUID_TO_BIN(?);`, [id, id])
      if (result.length === 0) throw new NoData()
      return result
    } catch (err) {
      return err
    }
  }

  static async createUser (input) {
    try {
      const { correoUsuario, passwordUsuario, idGenero, numeroDocumentoUsuario, primerNombreUsuario, segundoNombreUsuario, primerApellidoUsuario, segundoApellidoUsuario, linkFoto, telefonoUsuario, direccionUsuario, fechaNacimientoUsuario } = input
      const [[existingData]] = await db.query(`
        SELECT numero_documento_usuario
        FROM usuarios
        WHERE correo_usuario = ? OR numero_documento_usuario = ?`, [correoUsuario, numeroDocumentoUsuario])
      if (existingData) throw new DuplicateInfo()

      const saltRounds = 10
      const encryPassword = await bcrypt.hash(passwordUsuario, saltRounds)
      const [usuario] = await db.query(`INSERT INTO usuarios (correo_usuario, password_usuario, estado_usuario,id_genero, id_tipo_usuario,numero_documento_usuario, primer_nombre_usuario, segundo_nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario,telefono_usuario,direccion_usuario,fecha_nacimiento_usuario,link_foto_usuario) 
      VALUES (?,?,1,?,2,?,?,?,?,?,?,?,?,?);
      `, [correoUsuario, encryPassword, idGenero, numeroDocumentoUsuario, primerNombreUsuario, segundoNombreUsuario, primerApellidoUsuario, segundoApellidoUsuario, telefonoUsuario, direccionUsuario, fechaNacimientoUsuario, linkFoto])
      return usuario
    } catch (err) {
      return err
    }
  }

  static async updateUser ({ id, input }) {
    try {
      const { correoUsuario, idGenero, numeroDocumentoUsuario, primerNombreUsuario, segundoNombreUsuario, primerApellidoUsuario, segundoApellidoUsuario, linkFoto, telefonoUsuario, direccionUsuario, fechaNacimientoUsuario } = input

      const [verifyEmail] = await db.query(`
      SELECT BIN_TO_UUID(id_usuario) id 
      FROM usuarios
      WHERE correo_usuario = ? AND id_usuario != UUID_TO_BIN(?)`, [correoUsuario, id])
      if (verifyEmail.length > 0) throw new DuplicateInfo()

      const [verifyUser] = await db.query(`
      SELECT BIN_TO_UUID(id_usuario) id 
      FROM usuarios
      WHERE numero_documento_usuario = ? AND id_usuario != UUID_TO_BIN(?)`, [numeroDocumentoUsuario, id])

      if (verifyUser.length > 0) throw new DocumentInUse()

      const [res] = await db.query(`
      UPDATE usuarios
      SET primer_nombre_usuario = ?, segundo_nombre_usuario = ?, primer_apellido_usuario = ?, segundo_apellido_usuario = ?, correo_usuario = ?, numero_documento_usuario = ?, id_genero =?, link_foto_usuario =?, telefono_usuario = ?, direccion_usuario=?, fecha_nacimiento_usuario = ? 
      WHERE id_usuario = UUID_TO_BIN(?)`,
      [primerNombreUsuario, segundoNombreUsuario, primerApellidoUsuario, segundoApellidoUsuario, correoUsuario, numeroDocumentoUsuario, idGenero, linkFoto, telefonoUsuario, direccionUsuario, fechaNacimientoUsuario, id])
      return res
    } catch (err) {
      return err
    }
  }

  static async deleteUser ({ id, input }) {
    try {
      const { anotacion, idUserRemplazo } = input

      const [[estadoCuenta]] = await db.query(`SELECT estado_usuario FROM usuarios 
      WHERE id_usuario = UUID_TO_BIN(?);`, [id])
      if (!estadoCuenta) throw new NoData()
      if (estadoCuenta.estado_usuario !== 1) throw new AccountAlreadyDisable()

      const [[conteoCuentas]] = await db.query(`SELECT COUNT(id_tipo_usuario) AS cuentas_existentes 
      FROM usuarios
      WHERE id_tipo_usuario = (SELECT id_tipo_usuario FROM usuarios
        WHERE id_usuario = UUID_TO_BIN(?)) AND estado_usuario = 1;`, [id])

      if (conteoCuentas.cuentas_existentes === 1) throw new ActionNotAllowed()

      await db.beginTransaction()

      const [res] = await db.query(`UPDATE usuarios 
      SET usuarios.estado_usuario = 0, usuarios.fecha_eliminacion_usuario = CURDATE(), usuarios.anotacion_usuario = ?
      WHERE id_usuario = UUID_TO_BIN(?);`,
      [anotacion, id])
      if (idUserRemplazo !== '') {
        await db.query(`UPDATE facturas
      SET id_usuario = UUID_TO_BIN(?) 
      WHERE id_usuario = UUID_TO_BIN(?)`, [idUserRemplazo, id])
      }

      await db.commit()
      return res
    } catch (err) {
      await db.rollback()
      return err
    }
  }

  static async getUserType () {
    try {
      const [res] = await db.query('SELECT id_tipo_usuario as id, descripcion_usuario as value FROM tipo_usuario')
      if (res.length === 0) throw new NoData()
      return res
    } catch (err) {
      return err
    }
  }

  static async getGenreTypes () {
    try {
      const [res] = await db.query('SELECT id_genero AS id, genero AS value FROM genero;')
      if (res.length === 0) throw new NoData()
      return res
    } catch (error) {
      return error
    }
  }
}
