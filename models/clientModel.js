import db from '../config/database.js'
import { DuplicateInfo, NoData } from '../schemas/errorSchema.js'

export class ClientModel {
  static async verifyClient ({ numeroDocumentoClient }) {
    try {
      const [[data]] = await db.query(`SELECT correo_cliente, numero_documento_cliente, primer_nombre_cliente, segundo_nombre_cliente, primer_apellido_cliente, segundo_apellido_cliente,telefono_cliente FROM clientes
      WHERE numero_documento_cliente = ?`, [numeroDocumentoClient])
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
      console.log(err)
      return err
    }
  }
}
