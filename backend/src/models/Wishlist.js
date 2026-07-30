import mongoose from "mongoose";
import product from "./Product.js";

const wishlistSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
},{
    timestamps:true
})

const Wishlist = mongoose.model("Wishlist",wishlistSchema)
export default Wishlist