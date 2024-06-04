import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'
import transporter from '../config/connectionEmail.js'

export class PaymentModel {
  static async getData ({ id }) {
    try {
      const [data] = await db.query(`SELECT id_factura AS id, cuota_actual_factura ,valor_neto_factura,cantidad_cuotas_factura, CONCAT_WS(' ',primer_nombre_cliente,primer_apellido_cliente) AS nombre_cliente, direccion_cliente, telefono_cliente, DATE_FORMAT(fecha_proximo_pago, '%Y-%m-%d') AS fecha_proximo_pago
      FROM facturas
      INNER JOIN clientes on facturas.id_cliente = clientes.id_cliente
      INNER JOIN usuarios on facturas.id_usuario = usuarios.id_usuario
      WHERE usuarios.id_usuario=UUID_TO_BIN(?) AND cuota_actual_factura<=cantidad_cuotas_factura AND fecha_proximo_pago<=CURDATE()`, [id])
      if (data.length === 0) throw new NoData()
      return data
    } catch (error) {
      return error
    }
  }

  static async getDataById ({ id }) {
    try {
      const [[data]] = await db.query(`SELECT cuota_actual_factura AS cuotaActualFactura,valor_neto_factura AS valorNetoFactura,cantidad_cuotas_factura AS cuotasFactura,facturas.id_tipo_cuota AS idTipoCuota ,descripcion_cuota as descripcionCuota, correo_cliente As correoCliente, CONCAT_WS(' ',primer_nombre_cliente, primer_apellido_cliente) AS nombreCliente
      FROM facturas
      INNER JOIN tipo_cuotas on facturas.id_tipo_cuota = tipo_cuotas.id_tipo_cuota
      INNER JOIN clientes on facturas.id_cliente = clientes.id_cliente
      WHERE id_factura = ?`, [id])
      if (!data) throw new NoData()
      return data
    } catch (error) {
      return error
    }
  }

  static async createPayment (input) {
    try {
      const { entidadBancaria, idTipoTransaccion, cuotaActualFactura, valorCuota, idFactura, fechaProximoPago, idUsuario, correoCliente, nombreCliente } = input
      await db.beginTransaction()
      await db.query('INSERT INTO transacciones (entidad_bancaria,id_tipo_transaccion) VALUES (?,?)', [entidadBancaria, idTipoTransaccion])
      const [[lastInsertId]] = await db.query(
        'SELECT BIN_TO_UUID(id_transaccion) id_transaccion FROM transacciones ORDER BY fecha_transaccion DESC LIMIT 1'
      )
      await db.query('INSERT INTO cuotas_factura (numero_cuota,valor_cuota,id_transaccion,id_factura,id_usuario) values(?,?,UUID_TO_BIN(?),?,UUID_TO_BIN(?))', [cuotaActualFactura, valorCuota, lastInsertId.id_transaccion, idFactura, idUsuario])
      await db.query('UPDATE facturas SET cuota_actual_factura = ? , fecha_proximo_pago = ? WHERE id_factura=?', [cuotaActualFactura + 1, fechaProximoPago, idFactura])

      const mailOptions = {
        from: 'samivazqueles@gmail.com',
        to: `${correoCliente}`,
        subject: 'Abono Generado',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #F3F4F6; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); position: relative;">
            <div style="text-align: center; margin-bottom: 20px;">
              <i class="fas fa-dog" style="color: #4CAF50; font-size: 48px;"></i>
            </div>
            <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">
              <strong>Nombre del cliente:</strong> Hola ${nombreCliente},
            </h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
              Tu pago de la cuota ${cuotaActualFactura} sobre la factura ${idFactura} ha sido realizado exitosamente
            </p>
            <p style="text-align: center;">
              Valor del pago: ${valorCuota}
              Fecha Proximo pago: ${fechaProximoPago}
            </p>
          </div>
        `
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return error
        } else {
          console.log('Correo electrónico enviado: ' + info.response)
        }
      })

      await db.commit()

      return 'Abono generado satisfactoriamente'
    } catch (error) {
      await db.rollback()
      return error
    }
  }

  static async getPaymentTypes () {
    try {
      const [res] = await db.query('SELECT id_tipo_transaccion AS id, descripcion_transaccion AS value FROM tipo_transaccion;')
      if (res.length === 0) throw new NoData()
      return res
    } catch (error) {
      return error
    }
  }
}
