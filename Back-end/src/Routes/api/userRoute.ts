import { Router } from "express";
import * as userHandler from "../../Handlers/userHandler"
import { verifyJWT } from "../../Middleware/verifyJWT";
const router = Router()

router.route("/all").get(verifyJWT,userHandler.getAllUsers)
router.route("/:id").get(verifyJWT,userHandler.getUserById)
router.route("/register").post(userHandler.create)
router.route('/delete/:id').delete(verifyJWT,userHandler.deleteUser)
router.route("/update/:id").patch(verifyJWT,userHandler.updateUser)
export default router
