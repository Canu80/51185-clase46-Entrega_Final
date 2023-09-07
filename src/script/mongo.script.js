import productsModel from "../dao/models/products.model.js";
import { connectDB } from "../config/connectDB.js";

connectDB();

//funcion para agregar el owner a cada producto
const updateProducts = async () => {
  try {
    const adminId = "649c930ca6ffb50581c7f7b5";
    const result = await productsModel.updateMany({},{ $set: { owner: adminId }});
    console.log("Result", result);
  } catch (error) {
    console.log(error.message);
  }
};

updateProducts();
