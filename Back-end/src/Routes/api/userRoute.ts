import { Router } from "express";
import * as userHandler from "../../Handlers/user_handler"
const router = Router()

router.route("/register").post(userHandler.createCustomer)
router.route("/register/seller").post(userHandler.createSeller)
router.route("/register/admin").post(userHandler.createAdmin)
router.route("/login").post(userHandler.authenticate)
router.route("/get/:id").get(userHandler.getSpecificUser)
router.route("/get-all-users").get(userHandler.getAllUsers)
router.route('/delete/:id').delete( userHandler.deleteUser)
router.route("/update/:id").patch( userHandler.updateUser)
export default router
