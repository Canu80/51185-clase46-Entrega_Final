import { Router } from 'express';
import cartsController from "../controllers/carts.controller.js"
import {isAuthenticated} from "../helpers/auth.js"
import {checkRole} from "../helpers/auth.js";


const router = Router();

const {
    getCarts,
    getCartByID,
    createCarts,
    addProduct,
    addProductInCartID,
    deleteProductInCart,
    deleteAllProductsInCart,
    updateProductsInCart,
    updateIdProductInIdCart,
    purchase
} = cartsController;

// Obtener todos los carritos
router.get("/", isAuthenticated, getCarts);

// Obtenemos un carrito según su ID para ver sus productos
router.get("/:cid", isAuthenticated, getCartByID);

//Generamos un nuevo carrito
router.post("/", createCarts);

// Actualizamos productos en el carrito
router.put("/:cid", isAuthenticated, updateProductsInCart);

// Eliminamos todos los productos del carrito
router.delete("/:cid", isAuthenticated, deleteAllProductsInCart);

// Agregamos un producto seleccionado según su ID al carrito seleccionado según su ID
router.post("/:cid/products/:pid", isAuthenticated, addProductInCartID);

// Actualizamos un producto determinado al carrito seleccionado según su ID
router.put(":cid/products/:pid", isAuthenticated, updateIdProductInIdCart);

// Eliminamos un producto del carrito
router.delete("/:cid/products/:pid", isAuthenticated, deleteProductInCart);

// Efectuamos la compra de los productos que están en el carrito 
router.post("/:cid/purchase", isAuthenticated, checkRole(["Usuario","Premium"]), purchase);

// Agregamos un producto seleccionado según su ID al carrito asociado al user en sesión
router.post("/mycart", isAuthenticated, addProduct);



export default router;