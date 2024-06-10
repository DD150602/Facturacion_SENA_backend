import db from '../config/database.js'
import { NoData, DuplicateInfo } from '../schemas/errorSchema.js'

export default class zoneModel {
  static async getAllzone () {
    try {
      const [res] = await db.query(
        `
        SELECT BIN_TO_UUID(id_zona) id, nombre_zona, descripcion_zona 
        FROM zonas
        `
      )
      if (!res) throw new NoData()
      if (res.length === 0) throw new NoData()
      return res
    } catch (error) {
      return error
    }
  }

  static async getZoneByID (id) {
    try {
      const [res] = await db.query(
        `
        SELECT BIN_TO_UUID(id_zona) id, nombre_zona, descripcion_zona 
        FROM zonas WHERE id_zona = UUID_TO_BIN(?)
        `, [id]
      )
      if (!res) throw new NoData()
      if (res.length === 0) throw new NoData()
      return res
    } catch (error) {
      return error
    }
  }

  static async createZone (input) {
    const { nombreZona, descripcionZona } = input
    try {
      const [verificar] = await db.query('SELECT * FROM zonas WHERE nombre_zona = ? ', [nombreZona])
      if (verificar.length > 0) throw new DuplicateInfo()
      await db.query('INSERT INTO zonas (nombre_zona, descripcion_zona) VALUES (?,?)', [nombreZona, descripcionZona])
      return 'Zona creada correctamente'
    } catch (error) {
      return error
    }
  }

  static async updateZone (id, input) {
    try {
      const { nombreZona, descripcionZona } = input
      const [verificar] = await db.query('SELECT * FROM zonas WHERE nombre_zona = ? AND id_zona != UUID_TO_BIN(?)', [nombreZona, id])
      if (verificar.length > 0) {
        throw new DuplicateInfo()
      }
      const [update] = await db.query('UPDATE zonas SET nombre_zona = ? , descripcion_zona = ? WHERE id_zona = UUID_TO_BIN(?)', [nombreZona, descripcionZona, id])

      return update
    } catch (error) {
      return error
    }
  }

  static async getUser (id) {
    try {
      const [responseUser] = await db.query(
        `
            SELECT BIN_TO_UUID(id_usuario) AS id, correo_usuario,
            numero_documento_usuario, 
            primer_nombre_usuario, 
            primer_apellido_usuario,
            telefono_usuario,
            direccion_usuario,
            nombre_zona
            FROM usuarios
            LEFT JOIN zonas ON usuarios.id_zona = zonas.id_zona
            WHERE numero_documento_usuario = ? AND estado_usuario = 1
            `,
        [id]
      )
      if (!responseUser || responseUser.length === 0) throw new NoData()
      return responseUser
    } catch (error) {
      return error
    }
  }

  static async addUserZone (id, zonaId) {
    try {
      const response = await db.query('UPDATE usuarios SET id_zona = UUID_TO_BIN(?) WHERE id_usuario = UUID_TO_BIN(?)', [zonaId, id])
      return response
    } catch (error) {
      return error
    }
  }
}
