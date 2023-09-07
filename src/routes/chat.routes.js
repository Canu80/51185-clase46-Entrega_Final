import { Router } from "express";
import chatsController from "../controllers/chats.controller.js";
import {checkRole} from "../helpers/auth.js";

const router = Router();

const {
    renderChats
} = chatsController;


// Chat
router.get("/", checkRole(["Premium"]), renderChats);


export default router;