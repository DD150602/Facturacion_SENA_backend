import db from '../config/database.js'
import { NoData } from '../schemas/errorSchema.js'

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
}

export default InvoiceModel
