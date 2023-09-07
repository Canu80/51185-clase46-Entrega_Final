import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import passport from "passport";
import methodOverride from "method-override";
import flash from "connect-flash";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { options } from "./config/config.js";
import {__dirname} from "./utils.js";
import { swaggerSpecs } from "./config/docConfig.js";
import viewRouter from "./routes/views.routes.js";
import loggerRouter from "./routes/logger.routes.js"
import chatsRouter from "./routes/chat.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import usersRouter from "./routes/users.routes.js"
import {mockingRouter} from "./routes/mockingproducts.routes.js";
import initializePassport from "./config/passport.config.js";
import { addLogger } from "./helpers/utils/logger.js";


//Inicializations
const app = express();
initializePassport();

//Settings
app.set("port", options.server.port);
app.engine("handlebars", handlebars.engine());
const hbs = handlebars.create({});
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Helpers
hbs.handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});
hbs.handlebars.registerHelper('multiply', function(a, b) {
  return a * b;
});
hbs.handlebars.registerHelper('addition', function(a, b) {
  return a + b;
});

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    store: new MongoStore({
      mongoUrl: options.mongo.url,
      ttl: 3600,
    }),
    secret: options.session.key,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(addLogger);


// Global Variables
app.use((req, res, next) => {
  app.locals.success_msg = req.flash("success_msg");
  app.locals.error_msg = req.flash("error_msg");
  app.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use("/", viewRouter);
app.use("/loggerTest", loggerRouter);
app.use("/chat", chatsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/mockingproducts", mockingRouter);
app.use("/api/docs", swaggerUi.serve,swaggerUi.setup(swaggerSpecs));

// Static files
app.use(express.static(__dirname + "/public"));


export default app;