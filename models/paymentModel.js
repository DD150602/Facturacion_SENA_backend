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