import {productSchema}  from "../validators/Product.validator.js";
import { createProductService,deleteProductService,getAllProductByIdService,getAllProductsService,updateProductService } from "../services/product.service.js";

const getUploadedImages = (req) => {
    let list = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
        list = req.files.images.map(f => `uploads/products/${f.filename}`);
    } else if (req.files && req.files.image && req.files.image.length > 0) {
        list = req.files.image.map(f => `uploads/products/${f.filename}`);
    } else if (req.file) {
        list = [`uploads/products/${req.file.filename}`];
    }
    return list;
};

export const createProduct = async(req,res,next)=>{
    try {
        if(req.body.variants){
            req.body.variants = JSON.parse(req.body.variants)
        }

        const validatedData = productSchema.parse(req.body)
        const imageList = getUploadedImages(req);
        const image = imageList.length > 0 ? imageList[0] : null;
        const product = await createProductService(validatedData,image,imageList)
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
            message:"Products details fetched successfully",
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
        const imageList = getUploadedImages(req);
        const image = imageList.length > 0 ? imageList[0] : null;

        const product = await updateProductService(req.params.id,validatedData,image,imageList);
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