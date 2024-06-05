import db from "../config/database.js";
import { NoData } from "../schemas/errorSchema.js";

export default class InformeCModel {
    static async getInformesCobros(id, mes = null, year = null) {
        console.log(id)
        try {
            let query =
                `SELECT 
            f.id_factura AS id,
            f.fecha_factura,
            f.id_factura AS numero_factura,
            f.valor_neto_factura AS valor_pago,
            t.entidad_bancaria AS banco_pago,
            t.fecha_transaccion AS fecha_pago,
            t.estado_transaccion AS estado_pago,
            cl.primer_nombre_cliente AS nombre_cliente,
            cl.primer_apellido_cliente AS apellido_cliente
        FROM 
            facturas f
        JOIN 
            transacciones t ON f.id_factura = t.id_factura
        JOIN 
            clientes cl ON f.id_cliente = cl.id_cliente
        WHERE 
            f.id_usuario = UUID_TO_BIN(?)
        `
            const params = [id];
            if (mes && year) {
                query += `AND MONTH(t.fecha_transaccion) = ? AND YEAR(t.fecha_transaccion) = ?`;
                params.push(mes, year);
            } else if (mes) {
                query += `AND MONTH(t.fecha_transaccion) = ?`;
                params.push(mes);
            } else if (year) {
                query += `AND YEAR(t.fecha_transaccion) = ?`;
                params.push(year);
            }

            const [informe] = await db.query(query, params);

            if (!informe || informe.length === 0) throw new NoData();

            return informe;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
