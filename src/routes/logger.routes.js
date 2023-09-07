import { Router } from 'express';
import loggerController from "../controllers/logger.controller.js"

const router = Router();

const {logger} = loggerController;

router.get("/", logger);

export default router;