import { Router } from 'express';
import viewsControler from "../controllers/views.controller.js"
import {isAuthenticated} from "../helpers/auth.js"
import { sendContactEmail } from "../helpers/utils/emails.js";

const router = Router();

const {
    renderIndex,
    renderProducts,
    renderFound,
    renderLost,
    renderContact,
    sendConsult,
    renderMyCart,
    renderSignUpForm,
    renderSignInFrom,
    renderSignProfile,
    renderSignTickets,
    renderResetPassword,
    renderForgotPassword,
    renderUsers,
} = viewsControler;

router.get("/", renderIndex);
router.get("/products", renderProducts);
router.get("/found", renderFound);
router.get("/lost", renderLost);
router.get("/contact", renderContact);
router.post("/contact", sendContactEmail, sendConsult);
router.get("/cart", isAuthenticated, renderMyCart);
router.get("/signup", renderSignUpForm);
router.get("/signin", renderSignInFrom);
router.get("/profile", isAuthenticated, renderSignProfile);
router.get("/tickets", isAuthenticated, renderSignTickets);
router.get("/resetpassword", renderResetPassword);
router.get("/forgotpassword", renderForgotPassword);
router.get("/users", isAuthenticated, renderUsers);


export default router;