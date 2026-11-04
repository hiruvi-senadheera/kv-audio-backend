import Review from "../models/review.js";

// add a new review
export function addReview(req,res){
    console.log(req.user)  
    
    // check if the user is logged in
    if(req.user == null){
        res.status(401).json({
            message : "Please login and try again"
        })
        return
    } 

    const data = req.body

    data.name = req.user.firstName + " " + req.user.lastName
    data.profilePicture = req.user.profilePicture
    data.email = req.user.email

    const newReview = new Review(data)

    newReview.save().then(
        ()=>{
            res.json({
                message : "Review added successfully"
            })
        }
    ).catch(
        (error)=>{
            res.status(500).json({
                error : "Failed to add review"
            })
        }
    )




}