import { __dirname } from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

//console.log(path.join(__dirname,"docs/"))
const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title: "Documentación backend del ecommerce Pets",
            version:"1.0.1",
            description:"Definicion de endpoints"
        }
    },
    //Todos los archivos de la documentación
    apis:[`${path.join(__dirname,"docs/**/*.yaml")}`]
};

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);