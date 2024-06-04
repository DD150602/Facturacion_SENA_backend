import { Router } from 'express'
import { UploadFilesControler } from '../controllers/uploadFilesController.js'

export const uploadRouter = Router()

uploadRouter.post('/imagenes', UploadFilesControler.uploadProfilePhotos)
