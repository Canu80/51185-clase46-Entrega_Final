import productsServices from "../repository/products.repository.js";
import usersModel from "../dao/models/users.model.js";
import { CustomError } from "../services/customError.service.js"
import { EError } from "../helpers/enums/EError.js"
import { generateProductErrorInfo } from "../services/productErrorInfo.js";
import {sendDeleteProduct} from "../helpers/utils/emails.js";


const productsController = {};

// Insertamos todos los productos
productsController.insertMany = async (req, res) => {
  const products = await productsServices.insertMany();
  res.send({ products });
};

// Recibo todos los productos
productsController.getProducts = async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = {
      limit: limit || 3,
      page: page || 1,
      sort: { price: sort === "asc" ? 1 : -1 },
      lean: true,
    };

    if (status != undefined) {
      const products = await productsServices.getProducts(
        { status: status },
        options
      );
      return res.json({ products });
    }

    if (category != undefined) {
      const products = await productsServices.getProducts(
        { category: category },
        options
      );
      return res.json({ products });
    }
    const products = await productsServices.getProducts();

    res.json({ products });
  } catch (error) {
    console.log(error);
  }
};

// Recibo el producto en base a su ID
productsController.getProductByID = async (req, res) => {
  try {
    const pid = req.params.pid;
    const productByID = await productsServices.getProductByID(pid);
    res.status(productByID.code).send({
      status: productByID.status,
      message: productByID.message,
    });
  } catch (error) {
    console.log(error);
  }
};

// Creamos un nuevo producto
productsController.createProduct = async (req, res) => {
  try {
    const ownerId = req.user._id.toString();
    const {title, description, price, thumbnail, code, stock, category} = req.body;
    //console.log("Received product data:", req.body);
    if(!title || !description || !price || !thumbnail || !code || !stock || !category){
      try {
      CustomError.createError({
          name: "Product create error",
          cause: generateProductErrorInfo(req.body),
          message: "Faltan datos para crear el producto",
          errorCode: EError.INVALID_JSON,
      });
      } catch (error) {
        if (error.code === EError.INVALID_JSON) {
          console.log("Custom error:", error.message);
          return res.status(400).send({ message: "Faltan datos" });
        }
      }
    };

    const newProduct = await productsServices.createProduct(req.body, ownerId);
    res.status(newProduct.code).send({
      status: newProduct.status,
      message: newProduct.message,
    });
  } catch (error) {
    console.log(error);
  }
};
// Subimos una images nueva del producto

productsController.uploadImage = async (req, res) => {
  const productImageFileName = req.file.filename;
  console.log("Product Image File Name:", productImageFileName);
  res.send({ message: "Product image uploaded successfully" });
}

// Modificamos un producto existente
productsController.updateProduct = async (request, response) => {
  try {
    const pid = request.params.pid;
    const product = request.body;
    const respuesta = await productsServices.updateProduct(pid, product);
    response.status(respuesta.code).send({
      status: respuesta.status,
      message: respuesta.message,
    });
  } catch (error) {
    console.log(error);
  }
};

// Eliminamos un producto
productsController.deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productsServices.getProductByID(pid);
    const userID = product.message.owner.toString();
    const user = await usersModel.findById(userID);
    
    if (user.role === "Premium") {
      await sendDeleteProduct(user.email);
    }
    const productByID = await productsServices.deleteProduct(pid);
    res.status(productByID.code).send({
      status: productByID.status,
      message: productByID.message,
    });
  } catch (error) {
    console.log(error);
  }
};


export default productsController;