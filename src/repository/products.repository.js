import { cartsDao, productsDao, chatsDao } from "../dao/factory.js";

const productsServices = {};

// Insertamos todos los productos
productsServices.insertMany = async () => {
  return await productsDao.insertMany();
};

// Recibo todos los productos
productsServices.getProducts = async (limit, page, sort, category, status) => {
  return await productsDao.getProducts(limit, page, sort, category, status);
};

// Recibo el producto en base a su ID
productsServices.getProductByID = async (pid) => {
  return await productsDao.getProductByID(pid);
};

// Creamos un nuevo producto
productsServices.createProduct = async (product, ownerId) => {
  return await productsDao.createProduct(product, ownerId);
};

// Modificamos un producto existente
productsServices.updateProduct = async (pid, product) => {
  return await productsDao.updateProduct(pid, product);
};

// Eliminamos un producto
productsServices.deleteProduct = async (pid) => {
  return await productsDao.deleteProduct(pid);
};

export default productsServices;
