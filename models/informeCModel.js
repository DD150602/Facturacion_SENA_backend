import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'

export default class InformeCModel {
  static async getInformesCobros (id, mes = null, year = null) {
    try {
      let query =
            `SELECT 
                f.id_factura AS id,
                f.fecha_factura,
                c.numero_cuota,
                c.valor_cuota,
                t.entidad_bancaria,
                t.fecha_transaccion,
                t.estado_transaccion,
                cl.primer_nombre_cliente AS nombre_cliente,
                cl.primer_apellido_cliente AS apellido_cliente
            FROM 
                facturas f
            JOIN 
                cuotas_factura c ON f.id_factura = c.id_factura
            JOIN 
                transacciones t ON c.id_transaccion = t.id_transaccion
            JOIN 
                clientes cl ON f.id_cliente = cl.id_cliente
            WHERE 
                c.id_usuario = UUID_TO_BIN(?)`

      const params = [id]
      if (mes && year) {
        query += 'AND MONTH(t.fecha_transaccion) = ? AND YEAR(t.fecha_transaccion) = ?'
        params.push(mes, year)
      } else if (mes) {
        query += 'AND MONTH(t.fecha_transaccion) = ?'
        params.push(mes)
      } else if (year) {
        query += 'AND YEAR(t.fecha_transaccion) = ?'
        params.push(year)
      }

      const [informe] = await db.query(query, params)

      if (!informe || informe.length === 0) throw new NoData()

      return informe
    } catch (error) {
      return error
    }
  }
}
