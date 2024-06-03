import db from '../config/database.js'
import { NoData, NoDataFound, DuplicateInfo, InfoAlreadyExisting } from '../schemas/errorSchema.js'

export default class gestionCModel {
    static async getAllClientes() {
        try {
            const [clientes] = await db.query(`SELECT BIN_TO_UUID(id_cliente) id, 
                correo_cliente,
                link_foto_cliente,
                numero_documento_cliente,
                primer_nombre_cliente,
                segundo_nombre_cliente,
                primer_apellido_cliente,
                segundo_apellido_cliente,
                telefono_cliente,
                direccion_cliente
                FROM clientes`);

            if (!clientes) throw new NoDataFound();
            if (clientes.length === 0) throw new NoDataFound();
            return (clientes);
        } catch (error) {
            console.error("Error al traer los clientes:", error);
        }
    }

    static async getAllComprasById(id, mes = null, year = null) {
        try {
            let query = `
            SELECT
                f.id_factura as id,
                f.fecha_factura,
                f.valor_bruto_factura,
                f.valor_neto_factura,
                p.id_producto as id_producto,
                p.nombre_producto as nombre_producto,
                p.descripcion_producto as descripcion_producto,
                fp.valor_producto as valor_producto,
                fp.cantidad_producto as cantidad_producto
            FROM 
                facturas f
            JOIN 
                facturas_has_productos fp ON f.id_factura = fp.id_factura
            JOIN 
                productos p ON fp.id_producto = p.id_producto
            JOIN 
                clientes c ON f.id_cliente = c.id_cliente
            WHERE 
                c.id_cliente = UUID_TO_BIN(?)
            `;

            const params = [id];
            if (mes && year) {
                query += ` AND MONTH(f.fecha_factura) = ? AND YEAR(f.fecha_factura) = ?`;
                params.push(mes, year);
            } else if (mes) {
                query += ` AND MONTH(f.fecha_factura) = ?`;
                params.push(mes);
            } else if (year) {
                query += ` AND YEAR(f.fecha_factura) = ?`;
                params.push(year);
            }

            const [compras] = await db.query(query, params);

            if (!compras || compras.length === 0) throw new NoDataFound();


            const result = compras.reduce((acc, curr) => {
                const factura = acc.find(item => item.id === curr.id);
                if (factura) {
                    factura.productos.push({
                        id_producto: curr.id_producto,
                        nombre_producto: curr.nombre_producto,
                        descripcion_producto: curr.descripcion_producto,
                        valor_producto: curr.valor_producto,
                        cantidad_producto: curr.cantidad_producto
                    });
                } else {
                    acc.push({
                        id: curr.id,
                        fecha_factura: curr.fecha_factura,
                        valor_bruto_factura: curr.valor_bruto_factura,
                        valor_neto_factura: curr.valor_neto_factura,
                        productos: [{
                            id_producto: curr.id_producto,
                            nombre_producto: curr.nombre_producto,
                            descripcion_producto: curr.descripcion_producto,
                            valor_producto: curr.valor_producto,
                            cantidad_producto: curr.cantidad_producto
                        }]
                    });
                }
                return acc;
            }, []);

            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    }





    static async updateClienteById({ id, input }) {
        try {
            const {
                correo_cliente,
            } = input;

            const [verifyEmail] = await db.query(`
                SELECT BIN_TO_UUID(id_cliente) id, correo_cliente
                FROM clientes
                WHERE correo_cliente = ? AND id_cliente != UUID_TO_BIN(?)
            `, [correo_cliente, id]);

            if (verifyEmail.length > 0) throw new DuplicateInfo();


            const [update] = await db.query(`UPDATE clientes SET ? WHERE id_cliente = UUID_TO_BIN(?)`, [input, id]);

            return update;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    static async getClienteById(id) {
        try {
            const [cliente] = await db.query(`SELECT BIN_TO_UUID(id_cliente) id, 
                correo_cliente,
                link_foto_cliente,
                numero_documento_cliente,
                primer_nombre_cliente,
                segundo_nombre_cliente,
                primer_apellido_cliente,
                segundo_apellido_cliente,
                telefono_cliente,
                direccion_cliente
                FROM clientes
                WHERE id_cliente = UUID_TO_BIN(?)`, [id]);
            if (!cliente) throw new NoData();
            if (cliente.length === 0) throw new NoData();
            return (cliente);
        } catch (error) {
            console.error("Error al traer el cliente:", error);
            return error;
        }
    }
}