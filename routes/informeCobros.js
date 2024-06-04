import { Router } from "express";
import InformesController from "../controllers/informesCobros.js";
export const CobrosRouter = Router();

CobrosRouter.get("/:id", InformesController.InformesCobros)