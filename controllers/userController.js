import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config() //load environment variables from .env file

// register a new user
export function registerUser(req,res){

    // const newUser = new User(req.body)
    const data = req.body
    data.password = bcrypt.hashSync(data.password,10)//hash the password before saving to database
    const newUser = new User(data)
    
    newUser.save().then(
        ()=>{
            res.json({
                message : "User registered successfully"
            })
        }
    ).catch(
        (error)=>{
            res.status(500).json({
                error : "User registration failed"
            })
        }
    )
}


// login a user
export function loginUser(req,res){

    const data = req.body

    User.findOne({
        email : data.email
    }).then(
        (user)=>{
            
            if(user == null){
                res.status(404).json({
                    error : "User not found"
                })
            }else{

                const isPasswordValid = bcrypt.compareSync(data.password, user.password);
                if(isPasswordValid){
                    const token = jwt.sign({
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        role : user.role
                    },process.env.JWT_SECRET)
                    
                    res.json({
                        message : "Login successful",
                        token : token
                    })
                }else{
                    res.status(401).json({
                        error : "Invalid password"
                    })
                }
            }

        }
    )
}


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJoaXJ1dmkiLCJsYXN0TmFtZSI6IkRvZSIsImVtYWlsIjoiaGlydXZpQGdtYWlsLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc5MzczNTU5M30.nUjYa8Tp1I2lESBtiqF4UytAuKRb2GYaf-Z3mFvsJsc