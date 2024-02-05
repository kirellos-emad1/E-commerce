import { Router } from "express";
import userRouter from './api/userRoute'
import authRouter from './api/authRoute'

const routers = Router()


routers.use("/users",userRouter)

routers.use("/auth",authRouter)

export default routers