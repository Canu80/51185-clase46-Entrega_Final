import multer from "multer";
import path from "path";

import {__dirname} from "../utils.js";

// Definir los objetos de configuración para cada tipo de archivo

const storageConfig = {

  profiles: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,"/multer/users/images"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + `${req.body.email}-profile-${file.originalname}`);
    },
  }),
  documents: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,"/multer/users/documents"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + `${req.user.email}-document-${file.originalname}`);
    },
  }),
  products: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,"/multer/products/images"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + `${req.body.code}-image-${file.originalname}`);
    },
  })

};

const uploadProfiles = multer({ storage: storageConfig.profiles });
const uploadProducts = multer({ storage: storageConfig.products });
const uploadDocuments = multer({ storage: storageConfig.documents });

export { uploadProfiles, uploadProducts, uploadDocuments };
