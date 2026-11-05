import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import productRouter from "./routes/productRouter.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import reviewRouter from "./routes/reviewRouter.js"
import inquiryRouter from "./routes/inquiryRouter.js"

dotenv.config() //load environment variables from .env file

const app = express()

//middleware - it is a function that is executed before the request is sent to the controller
app.use(bodyParser.json());

//middleware - it is a function that is executed before the request is sent to the controller
app.use((req,res,next)=>{ 
    let token = req.header("Authorization")

    if(token!=null){
      token = token.replace("Bearer ","")
      jwt.verify(token, process.env.JWT_SECRET,
        (err,decoded)=>{
          if(!err){
            req.user = decoded;
          }
        } 
      )
    }
    next() //it is used to pass the request to the next middleware or controller
});

let mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl)

let connection = mongoose.connection
connection.once("open",()=>{
  console.log("MongoDB database connection established successfully")
})

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/inquiries",inquiryRouter)


app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
