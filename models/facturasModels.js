import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'
import transporter from '../config/connectionEmail.js'
export class InvoiceModel {
  static async getAll () {
    try {
      const [result] = await db.query(`
        SELECT id_factura, fecha_factura, valor_bruto_factura, valor_neto_factura, cantidad_cuotas_factura, cuota_actual_factura, fecha_proximo_pago, BIN_TO_UUID(id_usuario) id_usuario, estado, BIN_TO_UUID(id_cliente) id_cliente, id_tipo_cuota
        FROM facturas
      `)
      if (result.length === 0) {
        throw new NoData()
      }
      return result
    } catch (error) {
      return error
    }
  }

  static async getById ({ id }) {
    try {
      const [[result]] = await db.query(`
        SELECT id_factura, fecha_factura, valor_bruto_factura, valor_neto_factura, cantidad_cuotas_factura, cuota_actual_factura, fecha_proximo_pago, BIN_TO_UUID(id_usuario) id_usuario, estado, BIN_TO_UUID(id_cliente) id_cliente, id_tipo_cuota
        FROM facturas
        WHERE id_factura = ?
      `, [id])
      if (!result) throw new NoData()
      return result
    } catch (err) {
      return err
    }
  }

  static async getTipoCuota () {
    try {
      const [response] = await db.query(`
      select id_tipo_cuota as id , descripcion_cuota as value from tipo_cuotas`)
      return response
    } catch (error) {
      return error
    }
  }

  static async createInvoice (input) {
    const { valorBrutoFactura, valorNetoFactura, cantidadCuotasFactura, fechaProximoPago, idUsuario, idCliente, idTipoCuota, productosFacturas } = input
    try {
      await db.beginTransaction()
      // Declara la variable de salida
      await db.query("SET @codigo_secundario = '';")

      // Llama al procedimiento almacenado
      await db.query('CALL sp_Generar_Codigo(@codigo_secundario);')
      // Obtén el valor de la variable de salida
      const [result] = await db.query('SELECT @codigo_secundario AS codigo_secundario;')
      const [invoice] = await db.query(`
        INSERT INTO facturas (id_factura, valor_bruto_factura, valor_neto_factura, cantidad_cuotas_factura, fecha_proximo_pago, id_usuario, estado, id_cliente, id_tipo_cuota) 
        VALUES (?, ?, ?, ?, ?, UUID_TO_BIN(?), 1, UUID_TO_BIN(?), ?);
      `, [result[0].codigo_secundario, valorBrutoFactura, valorNetoFactura, cantidadCuotasFactura, fechaProximoPago, idUsuario, idCliente, idTipoCuota])

      for (const factura of productosFacturas) {
        await db.query(
            `INSERT INTO facturas_has_productos (valor_producto, id_factura , id_producto , cantidad_producto)
            VALUES ( ? , ?, ? , ? );`,
            [factura.valorProducto, result[0].codigo_secundario, factura.idProduct, factura.cantidad]
        )
      }
      await db.commit()
      return invoice
    } catch (err) {
      await db.rollback()
      console.log(err)
      return err
    }
  }

  static async sendFactura (input) {
    const { nombreUsuario, apellidoUsuario, correoUsuario, link } = input
    try {
      const mailOptions = {
        from: 'samivazqueles@gmail.com',
        to: `${correoUsuario}`,
        subject: 'Factura Disponible',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #F3F4F6; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); position: relative;">
            <div style="text-align: center; margin-bottom: 20px;">
              <i class="fas fa-dog" style="color: #4CAF50; font-size: 48px;"></i>
            </div>
            <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">
              <strong>Nombre del cliente:</strong> Hola ${nombreUsuario} ${apellidoUsuario},
            </h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
              Tu factura ya está disponible. Puedes acceder a través del siguiente enlace:
            </p>
            <p style="text-align: center;">
              <a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Ver Factura</a>
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
    } catch (error) {
      return error
    }
  }

  static async getAllProducts () {
    try {
      const [res] = await db.query(
        `
        SELECT id_producto AS id, nombre_producto as value , valor_producto 
        FROM productos
        WHERE estado_producto = 1
        `
      )
      if (!res) return new NoData()
      if (res.length === 0) return new NoData()
      return res
    } catch (error) {
      return error
    }
  }
}

export default InvoiceModel
