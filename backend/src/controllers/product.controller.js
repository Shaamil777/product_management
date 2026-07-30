import {productSchema}  from "../validators/Product.validator.js";
import { createProductService,deleteProductService,getAllProductByIdService,getAllProductsService } from "../services/product.service.js";

export const createProduct = async(req,res,next)=>{
    try {
        if(req.body.variants){
            req.body.variants = JSON.parse(req.body.variants)
        }

        const validatedData = productSchema.parse(req.body)
        const image = req.file?`uploads/products/${req.file.filename}`:null;
        const product = await createProductService(validatedData,image)
        return res.status(201).json({
            success:true,
            message:"Product created successfully",
            data:product
        })
    } catch (error) {
        next(error)
    }
}

export const getAllProducts = async(req,res,next)=>{
    try {
        const products = await getAllProductsService(req.query)
        return res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            data:products
        })
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req,res,next)=>{
    try {
        const product = await getAllProductByIdService(req.params.id)
        return res.status(200).json({
            success:true,
            data:product
        })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async(req,res,next)=>{
    try {
        if(req.body.variants){
            req.body.variants = JSON.parse(req.body.variants)
        }

        const validatedData = productSchema.parse(req.body)
        const image = req.file?`uploads/products/${req.file.filename}`:null;

        const product = await updateProductService(req.params.id,validatedData,image);
        return res.status(200).json({
            success:true,
            message:"Product updated Successfully",
            data:product
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req,res,next)=>{
    try {
        await deleteProductService(req.params.id)

        return res.status(200).json({
            success:true,
            message:"Product deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}