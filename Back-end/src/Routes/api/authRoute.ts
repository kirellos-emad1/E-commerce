import { Router } from "express";
import * as authHandler from "../../Handlers/authHandler"
const router = Router()


router.route("/login").post(authHandler.authenticate)
router.route("/refresh").get(authHandler.refresh)
router.route("/logout").post(authHandler.logout)


export default router