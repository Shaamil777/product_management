import {productSchema}  from "../validators/Product.validator.js";
import { createProductService,deleteProductService,getAllProductByIdService,getAllProductsService,updateProductService } from "../services/product.service.js";

// Helper function to extract uploaded image paths from request files
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

// Parse product variants and image files, then create a new product
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

// Fetch paginated products based on search and category filters
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

// Fetch detailed information of a single product by ID
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

// Validate input payload and uploaded images, then update product by ID
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

// Delete a product by ID and remove its stored image files
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