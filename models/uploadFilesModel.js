import { storage } from '../config/connectionFirebase.js'
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage'

export class UploadFilesModel {
  static async uploadFiles (files, dir) {
    try {
      const { archivo } = files
      const timestamp = Date.now()
      const storageRef = ref(storage, `${dir}/${timestamp}_${archivo.name}`)
      await uploadBytes(storageRef, archivo.data)
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      return error
    }
  }
}
