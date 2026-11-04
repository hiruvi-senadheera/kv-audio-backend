import mongoose from "mongoose";

//create a schema(structure) for user
const userSchema = new mongoose.Schema({

    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        default : "customer"
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    }

})

// create a model for user (create a connection between schema and database)
const User = mongoose.model("User", userSchema)

export default User;