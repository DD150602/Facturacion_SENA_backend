import InformeCModel from '../models/informeCModel.js'
import { NoData } from '../schemas/errorSchema.js'

export default class InformesController {
  static async InformesCobros (req, res) {
    const { id } = req.params
    const { mes } = req.query
    const response = await InformeCModel.getInformesCobros(id, mes, req.query.anio)
    if (response instanceof NoData) {
      res.status(404).json({ message: 'No se han encontrado datos para cargar.' })
    } else if (response instanceof Error) {
      res.status(500).json({ message: 'Error interno en el servidor' })
    } else {
      res.json(response)
    }
  }
}
