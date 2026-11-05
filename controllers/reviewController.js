import Review from "../models/review.js"

export function addReview(req,res){
    // console.log(req.user)

    // check if the user is logged in
    if(req.user == null){
        res.status(401).json({
            error : "Please login and try again"
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


// export function getReviews(req,res){

//     const user = req.user

//     if(user == null || user.role != "admin"){
//         Review.find({
//             isApproved : true
//         }).then(
//             (reviews)=>{
//                 res.json(reviews)
//         })
//         return
//     }

//     if(user.role == "admin"){
//         Review.find().then(
//             (reviews)=>{
//                 res.json(reviews)
//         })
//     }

// }

export async function getReviews(req,res){

    const user = req.user

    try{
        if(user.role == "admin"){
            const reviews = await Review.find();
            res.json(reviews)
        }else{
            const reviews = await Review.find({isApproved:true});
            res.json(reviews)
        }
    }catch(error){
        res.json(500).json(
            {
                error : "failed to get reviews"
            }
        )
    }
    

}
    
export function deleteReview(req,res){

    const email = req.params.email

    if(req.user == null){
        res.status(401).json({
            error : "Please login and try again"
        })
        return
    }

    if(req.user.role == "admin"){
        Review.deleteOne({
            email : email
        }).then(
            ()=>{
                res.json({
                    message : "Review deleted successfully"
                })
            }
        ).catch(
            ()=>{
                res.status(500).json({
                    error : "Failed to delete review"
                }) 
            }
        )
        return
    }

    if(req.user.role == "customer"){

        if(req.user.email == email){
            Review.deleteOne({
                email : email
            }).then(
                ()=>{
                    res.json({
                        message : "Review deleted successfully"
                    })
                }
            ).catch(
                ()=>{
                    res.status(500).json({
                        error : "Failed to delete review"
                    }) 
                }
            )  
        }else{
            res.status(403).json({
                error : "You are not authorized to delete this review"
            })
        }

    }

    
} 


export function approveReview(req,res){

    const email = req.params.email

    if(req.user == null){
        res.status(401).json({
            error : "Please login and try again"
        })
        return
    }

    if(req.user.role == "admin"){
        Review.updateOne(
            {
                email : email
            },
            {
                isApproved : true
            }
        ).then(
            ()=>{
                res.json({
                    message : "Review approved successfully"
                })
            } 
        ).catch(
            ()=>{
                res.status(500).json({
                    error : "Failed to approve review"
                }) 
            }
        )
        return
    }else{
        res.status(403).json({
            error : "You are not admin. only admin can approve reviews"
        })
    }

}