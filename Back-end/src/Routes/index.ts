import { Router } from "express";
import userRouter from './api/userRoute'

const routers = Router()


routers.use("/users",userRouter)

export default routers