import express from "express"
import { BlockOrUnblockUser, gettAllUsers, loginUser, registerUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/", registerUser)

userRouter.post("/login",loginUser)

userRouter.get("/all",gettAllUsers)

userRouter.put("/block/:email",BlockOrUnblockUser)

export default userRouter;