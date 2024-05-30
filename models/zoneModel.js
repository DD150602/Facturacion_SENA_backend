import db from '../config/database.js'
import { NoData, DuplicateInfo  } from '../schemas/errorSchema.js'

export default class zoneModel {
  static async getAllzone () {
    try {
      const [res] = await db.query(
        `
        SELECT BIN_TO_UUID(id_zona) id, nombre_zona, descripcion_zona 
        FROM zonas
        `
      )
      if (!res) return new NoData()
      if (res.length === 0) return new NoData()
      return res
    } catch (error) {
      console.log(error)
    }
  }

  static async createZone(input){
      const  { nombreZona , descripcionZona } = input
    try{
      const insert = await db.query('INSERT INTO zonas (nombre_zona, descripcion_zona) VALUES (?,?)', [nombreZona, descripcionZona])
      if(!insert) return new NoData()
      if(insert.length === 0) return new NoData()
      return insert
    }catch (error){
      console.log(error)
    }
  }

  static async updateZone(id, input){
    try{
      const { nombreZona, descripcionZona } = input

      const [verificar] = await db.query('SELECT * FROM zonas WHERE nombre_zona = ?',[nombreZona])
      if (verificar.length > 0) throw new DuplicateInfo()

      const [update] = await db.query('UPDATE zonas SET nombre_zona = ? , descripcion_zona = ? WHERE id_zona = UUID_TO_BIN(?)',[nombreZona,descripcionZona, id])

      return update
    }catch(error){
      console.log(error)
      return error
    }

  }
}
