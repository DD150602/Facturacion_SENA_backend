import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'
import transporter from '../config/connectionEmail.js'
import PDFDocument from 'pdfkit'
import fs from 'fs'

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
            [factura.precio, result[0].codigo_secundario, factura.id, factura.cantidad]
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
    const {
      correoUsuario,
      nombreUsuario,
      apellidoUsuario,
      valorNetoFactura,
      cantidadCuotasFactura,
      fechaProximoPago,
      productosFacturas
    } = input

    // Crear un nuevo documento PDF con márgenes
    const doc = new PDFDocument({ margin: 50 })
    doc.pipe(fs.createWriteStream('factura.pdf'))

    // Establecer colores y estilos
    const primaryColor = '#1E88E5' // Azul oscuro
    const textColor = '#333333'

    // Encabezado
    doc.rect(0, 0, 612, 100).fill(primaryColor)
    try {
      doc.image('logo.png', 50, 25, { width: 50 })
    } catch (e) {
      console.log('Logo not found, skipping logo addition')
    }
    doc.fillColor('#FFFFFF').fontSize(24).text('FTM', 110, 40)
    doc.moveDown(3) // Añadir más espacio después del encabezado

    // Contenido principal
    doc.fillColor(textColor)
    doc.fontSize(20).text('Factura', { align: 'center' }).moveDown()
    doc.fontSize(12).text('Empresa: FTM').moveDown()
    doc.text(`Nombre del cliente: ${nombreUsuario} ${apellidoUsuario}`).moveDown()
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`).moveDown()
    doc.text(`Fecha de Próximo Pago: ${fechaProximoPago}`).moveDown()
    doc.text(`Cantidad de Cuotas: ${cantidadCuotasFactura}`).moveDown()
    doc.moveDown()
    doc.fontSize(16).text('Detalles de los Productos:', { underline: true }).moveDown()
    doc.fontSize(12)

    productosFacturas.forEach(producto => {
      doc.text(`- ${producto.nombre}:`, { continued: true })
        .text(` Cantidad: ${producto.cantidad},`, { continued: true })
        .text(` Precio: $${producto.precio.toFixed(2)}`, { align: 'right' })
      doc.moveDown()
    })

    doc.moveDown()
    doc.fontSize(14).text(`Valor Neto de la Factura: $${valorNetoFactura.toFixed(2)}`, { align: 'right' }).moveDown()

    // Finalizar el documento PDF
    doc.end()

    // Enviar el correo electrónico con el PDF adjunto
    try {
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
            filename: 'factura.pdf',
            path: 'factura.pdf'
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
}

export default InvoiceModel
