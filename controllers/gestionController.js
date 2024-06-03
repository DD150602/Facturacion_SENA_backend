import gestionCModel from "../models/gestionCModel.js";
import { validateClientDataUpdate } from '../schemas/gestionCSchema.js'
import { NoDataFound, NotFoundUser, DuplicateInfo } from "../schemas/errorSchema.js";


export default class gestionController {

    static async getAllCliente(req, res) {
        const response = await gestionCModel.getAllClientes()
        if (response instanceof NoDataFound) {
            res.status(404).json({ message: 'No se encuenta los clientes' })
        } else if (response instanceof Error) {
            res.status(500).json({ message: 'Error interno en el servidor' })
        } else {
            res.json(response)
        }
    }

    static async getAllComprasById(req, res) {
        const { id } = req.params
        const { mes } = req.query
        const response = await gestionCModel.getAllComprasById(id, mes, req.query.anio)
        if (response instanceof NoDataFound) {
            res.status(404).json({ message: 'No se encuenta las compras' })
        } else if (response instanceof Error) {
            res.status(500).json({ message: 'Error interno en el servidor' })
        } else {
            res.json(response)
        }
    }

    static async updateClienteById(req, res) {
        const { id } = req.params
        const updata = validateClientDataUpdate(req.body)


        if (!updata.success) {
            return res.status(400).json({ message: JSON.parse(updata.error.message)[0].message })
        }

        const response = await gestionCModel.updateClienteById({ id, input: updata.data })
        if (response instanceof DuplicateInfo) {
            res.status(409).json({ message: 'Este correo ya existe' });
        } else if (response instanceof NotFoundUser) {
            res.status(404).json({ message: 'No se encontro el usuario' });
        } else if (response instanceof Error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        } else {
            res.json({ message: 'Actualizacion con exito' })
        }


    }

    static async getClienteById(req, res) {
        const { id } = req.params
        const response = await gestionCModel.getClienteById(id)
        if (response instanceof NotFoundUser) {
            res.status(404).json({ message: 'No se encontro el cliente' })
        } else if (response instanceof Error) {
            res.status(500).json({ message: 'Error interno del servidor' })
        } else {
            res.json(response)
        }
    }
}