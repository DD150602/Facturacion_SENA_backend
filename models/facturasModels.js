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
    const { valorBrutoFactura, valorNetoFactura, idUsuario, idCliente, productosFacturas } = input
    try {
      await db.beginTransaction()
      // Declara la variable de salida
      await db.query("SET @codigo_secundario = '';")

      // Llama al procedimiento almacenado
      await db.query('CALL sp_Generar_Codigo(@codigo_secundario);')
      // Obtén el valor de la variable de salida
      const [result] = await db.query('SELECT @codigo_secundario AS codigo_secundario;')
      await db.query(`
        INSERT INTO facturas (id_factura, valor_bruto_factura, valor_neto_factura, id_usuario, estado, id_cliente, pago_recibido) 
        VALUES (?, ?, ?, UUID_TO_BIN(?), 1, UUID_TO_BIN(?), 0);
      `, [result[0].codigo_secundario, valorBrutoFactura, valorNetoFactura, idUsuario, idCliente])

      for (const factura of productosFacturas) {
        await db.query(
            `INSERT INTO facturas_has_productos (valor_producto, id_factura , id_producto , cantidad_producto)
            VALUES ( ? , ?, ? , ? );`,
            [factura.precio, result[0].codigo_secundario, factura.id, factura.cantidad]
        )
      }
      await db.commit()
      return result[0].codigo_secundario
    } catch (err) {
      await db.rollback()
      return err
    }
  }

  static async sendFactura (input, files) {
    const {
      correoUsuario,
      nombreUsuario,
      apellidoUsuario
    } = input
    try {
      const { archivo } = files
      const mailOptions = {
        from: 'ftmEnvios@ftm.com',
        to: `${correoUsuario}`,
        subject: 'Factura Disponible',
        html: `
              <html>
                  <head>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #F3F4F6;
                              color: #333;
                          }
                          .container {
                              max-width: 600px;
                              margin: 0 auto;
                              padding: 20px;
                              border-radius: 10px;
                              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                          }
                          h1 {
                              color: #1E88E5; /* Azul oscuro */
                              text-align: center;
                          }
                          p {
                              font-size: 16px;
                              margin-bottom: 10px;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <h1>FTM</h1>
                          <p>Estimado ${nombreUsuario} ${apellidoUsuario},</p>
                          <p>Adjuntamos la factura correspondiente a tus compras.</p>
                          <p>Atentamente,</p>
                          <p>El equipo de FTM</p>
                      </div>
                  </body>
              </html>
          `,
        attachments: [
          {
            filename: archivo.name,
            content: archivo.data
          }
        ]
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
        `SELECT id_producto AS id, nombre_producto as value , valor_producto 
        FROM productos
        WHERE estado_producto = 1`
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
