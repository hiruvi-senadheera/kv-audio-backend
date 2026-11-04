import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import productRouter from "./routes/productRouter.js"
import jwt from "jsonwebtoken"

const app = express()

//middleware - it is a function that is executed before the request is sent to the controller
app.use(bodyParser.json());

//middleware - it is a function that is executed before the request is sent to the controller
app.use((req,res,next)=>{ 
    let token = req.header("Authorization")

    if(token!=null){
      token = token.replace("Bearer ","")
      jwt.verify(token, "kv-secret-99",
        (err,decoded)=>{
          if(!err){
            req.user = decoded;
          }
        } 
      )
    }
    next() //it is used to pass the request to the next middleware or controller
});

let mongoUrl = "mongodb+srv://admin:123@cluster0.h4v1waz.mongodb.net/"

mongoose.connect(mongoUrl)

let connection = mongoose.connection
connection.once("open",()=>{
  console.log("MongoDB database connection established successfully")
})

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)


app.listen(3000, () => {
  console.log("Server is running on port 3000")
})