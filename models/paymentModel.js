import db from "../config/database.js"
import { NoData } from "../schemas/errorSchema.js"
export class PaymentModel{
  static async getData ({id}){
    try {
      const [data] = await db.query(`SELECT BIN_TO_UUID(id_factura) id, cuota_actual_factura ,valor_neto_factura,cantidad_cuotas_factura, CONCAT_WS(' ',primer_nombre_cliente,primer_apellido_cliente), direccion_cliente, telefono_cliente
      FROM facturas
      INNER JOIN clientes on facturas.id_cliente = clientes.id_cliente
      INNER JOIN usuarios on facturas.id_usuario = usuarios.id_usuario
      WHERE usuarios.id_usuario=UUID_TO_BIN(?) AND cuota_actual_factura<=cantidad_cuotas_factura AND fecha_proximo_pago<=CURDATE()`,[id])
      if(data.length === 0) throw new NoData()
      return data
    } catch (error) {
      return error
    }
  }
  static async createPayment(input){
    try {
      const {entidadBancaria, idTipoTransaccion, numeroCuota, valorCuota, idFactura, fechaProximoPago} = input
    } catch (error) {
      
    }
  }

  static async createPayment (input) {
    try {
      const { entidadBancaria, idTipoTransaccion, numeroCuota, valorCuota, idFactura, fechaProximoPago } = input
      await db.beginTransaction()
      await db.query('INSERT INTO transacciones (entidad_bancaria,id_tipo_transaccion) VALUES (?,?)', [entidadBancaria, idTipoTransaccion])
      const [[lastInsertId]] = await db.query(
        'SELECT BIN_TO_UUID(id_transaccion) id_transaccion FROM transacciones ORDER BY fecha_transaccion DESC LIMIT 1'
      )
      await db.query('INSERT INTO cuotas_factura (numero_cuota,valor_cuota,id_transaccion,id_factura) vaues(?,?,UUID_TO_BIN(?),?)', [numeroCuota, valorCuota, lastInsertId.id_transaccion, idFactura])
      await db.query('UPDATE facturas SET cuota_actual_factura = ? , fecha_proximo_pago = ? WHERE id_factura=?', [numeroCuota + 1, fechaProximoPago, idFactura])
      await db.commit()
      return 'Abono generado satisfactoriamente'
    } catch (error) {
      await db.rollback()
      return error
    }
  }
}
import db from "../config/database.js"
import { NoData } from "../schemas/errorSchema.js"
export class PaymentModel{
  static async getData ({id}){
    try {
      const [data] = await db.query(`SELECT BIN_TO_UUID(id_factura) id, cuota_actual_factura ,valor_neto_factura,cantidad_cuotas_factura, CONCAT_WS(' ',primer_nombre_cliente,primer_apellido_cliente), direccion_cliente, telefono_cliente
      FROM facturas
      INNER JOIN clientes on facturas.id_cliente = clientes.id_cliente
      INNER JOIN usuarios on facturas.id_usuario = usuarios.id_usuario
      WHERE usuarios.id_usuario=UUID_TO_BIN(?) AND cuota_actual_factura<=cantidad_cuotas_factura AND fecha_proximo_pago<=CURDATE()`,[id])
      if(data.length === 0) throw new NoData()
      return data
    } catch (error) {
      return error
    }
  }
  static async createPayment(input){
    try {
      const {entidadBancaria, idTipoTransaccion, numeroCuota, valorCuota, idFactura, fechaProximoPago} = input
    } catch (error) {
      
    }
  }
}