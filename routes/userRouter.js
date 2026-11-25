import express from "express"
import { BlockOrUnblockUser, gettAllUsers, getUser, loginUser, registerUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/", registerUser)

userRouter.post("/login",loginUser)

userRouter.get("/all",gettAllUsers)

userRouter.put("/block/:email",BlockOrUnblockUser)

userRouter.get("/",getUser)

export default userRouter;