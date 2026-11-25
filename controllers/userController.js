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
                        role : user.role,
                        profilePicture : user.profilePicture,
                        phone : user.phone
                    },process.env.JWT_SECRET)
                    
                    res.json({
                        message : "Login successful",
                        token : token,
                        user : user
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

// check isAdmin
export function isAdmin(req){
    let isAdmin = false
    if(req.user != null){
        if(req.user.role == "admin"){
            isAdmin = true
        }
    }
    return isAdmin
}

// check isCustomer
export function isCustomer(req){
    let isCustomer = false
    if(req.user != null){
        if(req.user.role == "customer"){
            isCustomer = true
        }
    }
    return isCustomer
}



// view all customers
export async function gettAllUsers(req,res){

    if(isAdmin(req)){
        try{
            const users = await User.find().select("-password")
            res.json(users)
        }catch(e){
            res.status(500).json({
                error : "Failed to get users"
            })
        }
    }else{
        res.status(403).json({
            error : "Unauthorized"
        })
    }

}


//block or unblock user
export async function BlockOrUnblockUser(req,res){

    const email = req.params.email
    if (isAdmin(req)){
        try{
            const user = await User.findOne(
                {
                    email : email
                }
            )
            if(user == null){
                res.status(404).json({
                    error : "User not found"                 
                })
                return
            }
            const isBlocked = !user.isBlocked
            await User.updateOne(
                {
                    email:email
                },
                {
                    isBlocked:isBlocked
                }
            )
            res.json({
                message: "User blocked/unblocked successfully"
            })
        }catch(e){
            res.status(500).json({
                error : "Failed to block or unblock users"
            })
        }
    }else{
        res.status(403).json({
            error : "Unauthorized"
        })
    }

}
