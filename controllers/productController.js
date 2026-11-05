import Product from "../models/product.js";


// add product
export async function addProduct(req,res){
    // console.log(req.user)

    // check if the user is logged in
    if(req.user == null){
        res.status(401).json({
            error : "Please login and try again"
        })
        return
    }

    // check if the user is admin
    if(req.user.role != "admin"){
        res.status(403).json({
            message : "You are not authorized to add product"
        })
        return      
        }  

    const data = req.body
    const newProduct = new Product(data)
    // newProduct.save().then(
    //     ()=>{
    //         res.json({
    //             message : "Product added successfully"
    //         })
    //     }
    // ).catch(
    //     (error)=>{
    //         res.status(500).json({
    //             error : "Failed to add product"
    //         })
    //     }
    // )
    try{
        await newProduct.save()
        res.json(
            {
                message : "product added successfully"
            }
        )
    }catch(error){
        res.status(500).json({
            error : "Failed to add product"
        })
    }
}


//view product
export async function getProducts(req,res){

    let isAdmin = false
    if(req.user != null){
        if(req.user.role == "admin"){
            isAdmin = true
        }
    }

    try{
        if(isAdmin){
            const products = await Product.find()
            res.json(products)
            return
        }else{
            const products = await Product.find({availability:true});
            res.json(products)
        }
    }catch(error){
        res.status(500).json({
            error : "Failed to get products"
        })
    }
}