import { Router } from "express";
import mockingProducts from "../controllers/mocking.controller.js";

const router = Router();

const {
    generateProducts
} = mockingProducts;

// Generar 100 productos
router.get("/", generateProducts);


export {router as mockingRouter};
