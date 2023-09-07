import { Router } from "express";
import passport from "passport";
import sessionsController from "../controllers/sessions.controller.js"
import { uploadProfiles, uploadProducts, uploadDocuments } from "../helpers/multerMiddleware.js";

const router = Router();

const { 
    singup,
    failsignup,
    signin,
    failsignin,
    resetPassword,
    forgotPassword,
    github,
    githubcallback,
    logout,
    current,
} = sessionsController;

router.post("/signup", uploadProfiles.single("avatar"), passport.authenticate('signup', {failureRedirect:'/api/sessions/failsignup'}), singup);
router.get("/failsignup", failsignup);
router.post("/signin", passport.authenticate('signin', {failureRedirect:'/api/sessions/failsignin'}), signin);
router.get("/failsignin", failsignin);
router.get("/github", passport.authenticate('github', {scope:['user:email']}) , github);
router.get("/githubcallback", passport.authenticate('github',{failureRedirect:'/signin'}), githubcallback);
router.get("/logout", logout);
router.get("/current", current);
router.post("/resetpassword", resetPassword);
router.post("/forgotpassword", forgotPassword);

export default router;