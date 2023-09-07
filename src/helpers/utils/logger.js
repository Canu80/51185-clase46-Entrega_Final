import winston from "winston";
import {__dirname} from "../../utils.js";
import path from "path";
import {options} from "../../config/config.js"


const currentEnv = options.logger.nodeEnv;

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },

  colors: {
    fatal: "cyan",
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "green",
    debug: "purple",
  },
};

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({level: "debug",
      format: winston.format.combine(winston.format.colorize({colors: customLevels.colors}),winston.format.simple()),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({ level: "http" }),
    new winston.transports.File({filename: path.join(__dirname, "/error.log"),level: "info",}),
  ],
});

export const addLogger = (req, res, next) => {
  if (currentEnv === "development") {
    req.logger = devLogger;
  }
  if (currentEnv === "production") {
    req.logger = prodLogger;
  }
  req.logger.http(`${req.method} en ${req.url}}`);
  next();
};
