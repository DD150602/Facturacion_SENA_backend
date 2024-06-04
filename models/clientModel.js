import db from '../config/database.js'
import { DuplicateInfo, NoData } from '../schemas/errorSchema.js'

export class ClientModel {
  static async verifyClient ({ numeroDocumentoClient }) {
    try {
      const [[data]] = await db.query(`SELECT BIN_TO_UUID(id_cliente) id, correo_cliente, numero_documento_cliente, primer_nombre_cliente, segundo_nombre_cliente, primer_apellido_cliente, segundo_apellido_cliente,telefono_cliente FROM clientes
      WHERE numero_documento_cliente = ?`, [numeroDocumentoClient])
      if (!data) throw new NoData()
      return data
    } catch (error) {
      return error
    }
  }

  static async getData () {
    try {
      const [data] = await db.query(`SELECT numero_documento_cliente AS id, CONCAT_WS(' ',numero_documento_cliente,primer_nombre_cliente,primer_apellido_cliente) AS label
      FROM clientes
      WHERE estado_cliente = 1`)
      if (!data) throw new NoData()
      return data
    } catch (error) {
      return error
    }
  }

  static async createClient (input) {
    try {
      const { correoClient, idGenero, numeroDocumentoClient, primerNombreClient, segundoNombreClient, primerApellidoClient, segundoApellidoClient, linkFoto, telefonoClient, direccionClient, idZona } = input
      const [[existingData]] = await db.query(`
        SELECT numero_documento_cliente 
        FROM clientes
        WHERE correo_cliente = ? OR numero_documento_cliente = ?`, [correoClient, numeroDocumentoClient])
      if (existingData) throw new DuplicateInfo()
      const [cliente] = await db.query(`INSERT INTO clientes (correo_cliente, estado_cliente,id_genero, numero_documento_cliente, primer_nombre_cliente, segundo_nombre_cliente, primer_apellido_cliente, segundo_apellido_cliente,telefono_cliente,direccion_cliente,link_foto_cliente,id_zona) 
      VALUES (?,1,?,?,?,?,?,?,?,?,?,UUID_TO_BIN(?));
      `, [correoClient, idGenero, numeroDocumentoClient, primerNombreClient, segundoNombreClient, primerApellidoClient, segundoApellidoClient, telefonoClient, direccionClient, linkFoto, idZona])
      return cliente
    } catch (err) {
      return err
    }
  }

  static async getContactInfoClient (id) {
    try {
      const [data] = await db.query(`SELECT BIN_TO_UUID(id_cliente) id, CONCAT_WS(' ', primer_nombre_cliente, primer_apellido_cliente) AS label, numero_documento_cliente, correo_cliente, telefono_cliente, direccion_cliente
      FROM clientes
      WHERE id_zona = UUID_TO_BIN(?)`, [id])
      if (!data) throw new NoData()
      if (data.length === 0) throw new NoData()
      return data
    } catch (error) {
      return error
    }
  }
}
