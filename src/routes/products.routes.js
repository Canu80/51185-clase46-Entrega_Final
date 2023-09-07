import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import {isAuthenticated} from "../helpers/auth.js"
import {checkRole} from "../helpers/auth.js";
import { uploadProducts } from "../helpers/multerMiddleware.js";

const router = Router();

const {
    insertMany,
    getProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = productsController;

// Insertamos todos los productos
router.get("/insertion", insertMany);

// Recibo todos los productos
router.get("/", getProducts);

// Creamos un nuevo producto
router.post("/", isAuthenticated, checkRole(["Administrador","Premium"]), createProduct);

// Ruta para cargar imagen de producto
router.put("/:pid/uploadImage", isAuthenticated, checkRole(["Administrador","Premium"]), uploadProducts.single("productImage"), uploadImage);

// Recibo el producto en base a su ID
router.get("/:pid", getProductByID);

// Modificamos un producto existente
router.put("/:pid", isAuthenticated, checkRole(["Administrador","Premium"]), updateProduct);

// Eliminamos un producto
router.delete("/:pid", isAuthenticated, checkRole(["Administrador","Premium"]), deleteProduct);


export default router;