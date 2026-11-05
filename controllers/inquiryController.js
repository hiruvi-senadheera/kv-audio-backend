import Inquiry from "../models/inquiry.js"
import { isAdmin, isCustomer } from "./userController.js"

//add Inquiry
export async function addInquiry(req,res){

    try{
        if(isCustomer(req)){
            const data = req.body
            data.email = req.user.email
            data.phone = req.user.phone

            //auto generate id
            let id = 0;
            const inquiries = await Inquiry.find().sort({id:-1}).limit(1)

            if(inquiries.length == 0){
                id = 1
            }else{
                id = inquiries[0].id + 1
            }

            data.id = id

            const newInquiry = new Inquiry(data)
            const response = await newInquiry.save()
            
            res.json({
                message : "Inquiry added successfully",
                id : response.id
            })
            return
        }else{

        }
    }catch{
        res.status(500).json({
            error : "Failed to add inquiry"
        })
    }

}

//get inquiries
export async function getInquiries(req,res){

    try{
        if(isCustomer(req)){
            const inquiries = await Inquiry.find(
                {
                    email:req.user.email
                }
            )
            res.json(inquiries)
            return
        }else if(isAdmin(req)){
            const inquiries = await Inquiry.find()
            res.json(inquiries)
            return
        }else{
            res.status(403).json(
                {
                    message : "you are not authorized to get inquiries"
                }
            )
        }
    }catch(error){
        res.status(500).json({
            error : "Failed to get inquiries"
        })
    }
}
