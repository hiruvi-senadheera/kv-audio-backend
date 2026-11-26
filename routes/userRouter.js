import express from "express"
import { BlockOrUnblockUser, gettAllUsers, getUser, loginUser, loginWithGoogle, registerUser, sendOTP, verifyOTP } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/", registerUser)

userRouter.post("/login",loginUser)

userRouter.get("/all",gettAllUsers)

userRouter.put("/block/:email",BlockOrUnblockUser)

userRouter.get("/",getUser)

userRouter.post("/google",loginWithGoogle)

userRouter.get("/sendOTP",sendOTP)

userRouter.post("/verifyEmail",verifyOTP)


export default userRouter;