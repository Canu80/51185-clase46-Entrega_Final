import dotenv from "dotenv";
import { __dirname } from "../utils.js";
import path from "path";
import {Command} from "commander";

const program = new Command();

program
.option("-mode <modo>", "Modo de inicio","dev") 
program.parse(); // Se cierra la configuracion

const environment = program.opts();

console.log(environment);

const pathEnvironment = environment.Mode === "prod" ? path.join(__dirname, ".env.production") : path.join(__dirname, ".env.development");

dotenv.config({path: pathEnvironment});

export const options = {
    server:{
        port: process.env.PORT,
        persistence: process.env.PERSISTENCE
    },
    mongo:{
        url: process.env.MONGODB_URI
    },

    admin:{
        correo: process.env.CORREO_ADMIN,
        password: process.env.PASSWORD_ADMIN,
    },
    session: {
        key: process.env.KEY
    },
    github:{
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL 
    },
    gmail:{
        emailToken:process.env.GMAIL_SECRET_TOKEN,
        emailAdmin:process.env.GMAIL_EMAIL,
        emailPass:process.env.GMAIL_PASSWORD
    },
    logger:{nodeEnv: process.env.NODE_ENV}
}