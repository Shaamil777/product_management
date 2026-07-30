import mongoose from "mongoose";
import { string } from "zod";

const variantSchema = new mongoose.Schema({
        ram:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true,
            min:0
        },
        quantity:{
            type:Number,
            required:true,
            min:0
        }
    },
    {
        _id:true
    }
)

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:string,
        default:null
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubCategory",
        required:true
    },
    variants:[variantSchema]
},{timestamps:true})

const product = mongoose.model("Product",productSchema)
export default product