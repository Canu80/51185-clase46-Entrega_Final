import { newProducts } from "../utils.js";

const mockingProducts = {};

mockingProducts.generateProducts = (req,res)=>{
    const cant = parseInt(req.query.cant) || 100;
    let products = [];
    for (let i = 0; i < cant; i++) {
        const product = newProducts();
        products.push(product)
    }
    res.json({products})
};

export default mockingProducts;
