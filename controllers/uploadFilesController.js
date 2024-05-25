import { UploadFilesModel } from '../models/uploadFilesModel.js'
export class UploadFilesControler {
  static async uploadProfilePhotos (req, res) {
    const { files } = req
    if (!files) return res.status(400).json({ message: 'No se ha cargado ningun archivo' })
    const response = await UploadFilesModel.uploadFiles(files, 'photos_profile')
    if (response instanceof Error) {
      res.status(500).json({ message: 'Error en el servidor' })
    } else {
      res.json({ link: response })
    }
  }
}
