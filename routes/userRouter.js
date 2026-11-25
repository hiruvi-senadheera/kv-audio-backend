import express from "express"
import { gettAllUsers, loginUser, registerUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/", registerUser)

userRouter.post("/login",loginUser)

userRouter.get("/all",gettAllUsers)

export default userRouter;