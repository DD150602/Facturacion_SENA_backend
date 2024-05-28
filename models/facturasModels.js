import db from '../config/database.js'
import { NoData, AccountAlreadyDisable } from '../schemas/errorSchema.js'

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
    try {
      const { idFactura, valorBrutoFactura, valorNetoFactura, cantidadCuotasFactura, cuotaActualFactura, fechaProximoPago, idUsuario, idCliente, idTipoCuota } = input
      const [invoice] = await db.query(`
        INSERT INTO facturas (id_factura, valor_bruto_factura, valor_neto_factura, cantidad_cuotas_factura, cuota_actual_factura, fecha_proximo_pago, id_usuario, estado, id_cliente, id_tipo_cuota) 
        VALUES (?, ?, ?, ?, ?, ?, UUID_TO_BIN(?), 1, UUID_TO_BIN(?), ?);
      `, [idFactura, valorBrutoFactura, valorNetoFactura, cantidadCuotasFactura, cuotaActualFactura, fechaProximoPago, idUsuario, idCliente, idTipoCuota])
      return invoice
    } catch (err) {
      return err
    }
  }

  static async updateInvoice ({ id, input }) {
    try {
      const { valorBrutoFactura, valorNetoFactura, cantidadCuotasFactura, cuotaActualFactura, fechaProximoPago, idUsuario, estado, idCliente, idTipoCuota } = input
      const [res] = await db.query(`
        UPDATE facturas
        SET valor_bruto_factura = ?, valor_neto_factura = ?, cantidad_cuotas_factura = ?, cuota_actual_factura = ?, fecha_proximo_pago = ?, id_usuario = UUID_TO_BIN(?), estado = ?, id_cliente = UUID_TO_BIN(?), id_tipo_cuota = ?
        WHERE id_factura = ?
      `, [valorBrutoFactura, valorNetoFactura, cantidadCuotasFactura, cuotaActualFactura, fechaProximoPago, idUsuario, estado, idCliente, idTipoCuota, id])
      return res
    } catch (err) {
      return err
    }
  }

  static async deleteInvoice ({ id, anotacion }) {
    try {
      const [[estadoFactura]] = await db.query(`
        SELECT estado FROM facturas 
        WHERE id_factura = ?;
      `, [id])
      if (!estadoFactura) throw new NoData()
      if (estadoFactura.estado !== 1) throw new AccountAlreadyDisable()

      const [res] = await db.query(`
        UPDATE facturas 
        SET estado = 0, anotacion_factura = ?
        WHERE id_factura = ?;
      `, [anotacion, id])
      return res
    } catch (err) {
      return err
    }
  }
}

export default InvoiceModel
