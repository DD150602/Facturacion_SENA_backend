
import { Router } from 'express';
import  zoneController from '../controllers/zoneController.js' 

export const zona = Router();

zona.get('/', zoneController.getAllZones);
zona.post('/crear_zona', zoneController.createZone);
zona.patch('/update_zona/:id', zoneController.updatedZone);
zona.patch('/add_user/:id', zoneController.addUserToZone);

