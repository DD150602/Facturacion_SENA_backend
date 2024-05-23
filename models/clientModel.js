import db from '../config/database.js'
import { NoData, DuplicateInfo, DocumentInUse, AccountAlreadyDisable, ActionNotAllowed } from '../schemas/errorSchema.js'
import bcrypt from 'bcrypt'

export class ClientModel {
  static async createClient (input) {
    try {
      const { correoClient, idGenero, numeroDocumentoClient, primerNombreClient, segundoNombreClient, primerApellidoClient, segundoApellidoClient, linkFoto, telefonoClient, direccionClient, fechaNacimientoClient } = input
      const [[existingData]] = await db.query(`
        SELECT numero_documento_cliente
        FROM usuarios
        WHERE correo_cliente = ? OR numero_documento_cliente = ?`, [correoClient, numeroDocumentoClient])
      if (existingData) throw new DuplicateInfo()

      const [usuario] = await db.query(`INSERT INTO usuarios (correo_cliente, estado_cliente,id_genero, numero_documento_usuario, primer_nombre_usuario, segundo_nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario,telefono_usuario,direccion_usuario,fecha_nacimiento_usuario,link_foto_usuario) 
      VALUES (?,?,1,?,?,?,?,?,?,?,?,?,?,?);
      `, [correoUsuario, encryPassword, idGenero, idTipoUsuario, numeroDocumentoUsuario, primerNombreUsuario, segundoNombreUsuario, primerApellidoUsuario, segundoApellidoUsuario, telefonoUsuario, direccionUsuario, fechaNacimientoUsuario, linkFoto])
      return usuario
    } catch (err) {
      return err
    }
  }
}
