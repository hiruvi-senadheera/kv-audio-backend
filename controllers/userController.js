import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import axios from "axios"
import nodemailer from "nodemailer"
import OTP from "../models/otp.js"

dotenv.config() //load environment variables from .env file

const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "hiruvisenadeera@gmail.com",
            pass: "pztshziceqlvwali"
        }
})

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

                if(user.isBlocked){
                    res.status(403).json({
                        error : "Your account is blocked. Please contact the admin."
                    })
                }

                const isPasswordValid = bcrypt.compareSync(data.password, user.password);
                if(isPasswordValid){
                    const token = jwt.sign({
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        role : user.role,
                        profilePicture : user.profilePicture,
                        phone : user.phone,
                        emailVerified : user.emailVerified   
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



export function getUser(req,res){
    if(req.user != null){
        res.json(req.user)
    }else{
        res.status(403).json({
            error : "Unauthorized"
        })
    }
}

//google login
export async function loginWithGoogle(req,res){
    // https://www.googleapis.com/oauth2/v3/userInfo
    const accessToken = req.body.accessToken
    console.log(accessToken)
    try{
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        })
        console.log(response.data)
        const user = await User.findOne({
            email : response.data.email
        })
        if(user != null){
            const token = jwt.sign(
                {
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email,
                    role : user.role,
                    profilePicture : user.profilePicture,
                    phone : user.phone,
                    emailVerified : true
                },process.env.JWT_SECRET)
                    
                res.json({
                    message : "Login successful",
                    token : token,
                    user : user
                }
            )
        }else{
            const newUser = new User(
                {
                    email : response.data.email,
                    password : "123",
                    firstName : response.data.given_name,
                    lastName : response.data.family_name,
                    address : "Not Given",
                    phone : "Not Given",
                    profilePicture : response.data.picture ,
                    emailVerified : true        
                }
            )
            const savedUser = await newUser.save()
            const token = jwt.sign(
                {
                    firstName : savedUser.firstName,
                    lastName : savedUser.lastName,
                    email : savedUser.email,
                    role : savedUser.role,
                    profilePicture : savedUser.profilePicture,
                    phone : savedUser.phone

                },process.env.JWT_SECRET)
                    
                res.json({
                    message : "Login successful",
                    token : token,
                    user : savedUser
                }
            )
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            error : "Failed to login with google"
        })
    }
    

}


// send otp
export async function sendOTP(req,res) {

    if(req.user == null){
        res.status(403).json({
            error : "Unauthorized"
        })
        return
    }

    //generate number between 1000 and 9999
    const otp = Math.floor(Math.random()*9000)+1000
    //save otp in database
    const newOTP = new OTP({
        email : req.user.email,
        otp : otp
    })
    await newOTP.save()

    
    const message = {
        from: "hiruvisenadeera@gmail.com",
        to: req.user.email,
        subject: "Validating OTP",
        text: "Your otp code is "+otp
    }

    transport.sendMail(message, (err,info)=>{
        if(err){
            console.log(err)
            res.status(500).json({
                error : "Failed to sent OTP"
            })
        }else{
            console.log(info)
            res.json({
                    message : "OTP sent successfully",
            })
        }
    })
}


//verify otp
export async function verifyOTP(req,res){
    if(req.user == null){
        res.status(403).json({
            error : "Unauthorized"
        })
        return
    }
    const code = req.body.code

    const otp = await OTP.findOne({
        email: req.user.email,
        otp: code
    })

    if(otp == null){
        res.status(404).json({
            error : "Invalid OTP"
        })
        return
    }else{
        await OTP.deleteOne({
            email: req.user.email,
            otp: code
        })

        await User.updateOne({
            email: req.user.email
        },{
            emailVerified: true
        })

        res.json({
                    message : "Email verified successfully",
            })
    }
}