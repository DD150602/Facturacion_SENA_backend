import { storage } from '../config/connectionFirebase.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage' // Importar las funciones necesarias de Firebase Storage

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export class UploadFilesModel {
  static async uploadFiles (files, dir) {
    try {
      const { archivo } = files
      const timestamp = Date.now()
      const uploadPath = path.join(dirname, '../temp', `${timestamp}_${archivo.name}`)
      await archivo.mv(uploadPath)
      const storageRef = ref(storage, `${dir}/${timestamp}_${archivo.name}`)
      await uploadBytes(storageRef, fs.readFileSync(uploadPath))
      const downloadURL = await getDownloadURL(storageRef)
      fs.unlinkSync(uploadPath)
      return downloadURL
    } catch (error) {
      const { archivo } = files
      const uploadPath = path.join(_dirname, '../temp', `${Date.now()}${archivo.name}`)
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath)
      }
      return error
    }
  }
}
