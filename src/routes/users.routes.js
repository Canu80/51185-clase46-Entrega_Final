import { Router } from "express";
import { isAuthenticated } from "../helpers/auth.js";
import {checkRole} from "../helpers/auth.js";
import usersController from "../controllers/users.controller.js";
import { uploadProducts, uploadDocuments } from "../helpers/multerMiddleware.js";

const router = Router();

const {
  roleChange,
  uploadProductImage,
  updateUserDocument,
  getUsers,
  deleteInactiveUsers,
  deleteUser,
  changeUserRole
} = usersController;

router.put("/premium/", roleChange);
router.get("/premium/", roleChange);
router.post("/:uid/products", isAuthenticated, uploadProducts.single("productImage"), uploadProductImage);
router.put( "/:uid/documents", isAuthenticated, uploadDocuments.fields([
    { name: "identification", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "accountStatus", maxCount: 1 },
  ]), updateUserDocument);
router.delete("/", checkRole(["Administrador"]), deleteInactiveUsers);
router.get("/users", checkRole(["Administrador"]), getUsers);
router.delete("/users/:uid", checkRole(["Administrador"]), deleteUser);
router.put("/:uid", checkRole(["Administrador"]), changeUserRole);
router.post("/:uid", checkRole(["Administrador"]), changeUserRole);

export default router;
