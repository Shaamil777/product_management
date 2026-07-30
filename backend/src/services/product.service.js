import mongoose from "mongoose";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Product from "../models/Product.js";
import path from "path"
import fs from "fs"

// Create a new product after validating category, sub-category, and RAM variants
export const createProductService = async(productData,image,images = [])=>{
    const {name,description,category,subCategory,variants} = productData

    const existingCategory = await Category.findById(category)
    if(!existingCategory){
        throw new Error("Categor not found")
    }

    const existingSubCategory = await SubCategory.findById(subCategory)
    if(!existingSubCategory){
        throw new Error("Sub-Category not found")
    }
    
    if(existingSubCategory.category.toString()!==category){
        throw new Error("Selected subcategory does not belong to this category")
    }

    const existingProduct = await Product.findOne({
        name:{
            $regex:new RegExp(`^${name.trim()}$`,"i")
        }
    })
    if(existingProduct){
        throw new Error("Product already exists")
    }

    variants.sort((a,b)=>a.ram - b.ram)

    const ramSet = new Set()
    for(const variant of variants){

        if(ramSet.has(variant.ram)){
            throw new Error(`Duplicate RAM variant: ${variant.ram}`)
        }
        ramSet.add(variant.ram)
    }

    const product = await Product.create({
        name:name.trim(),
        description:description.trim(),
        image: image || (images && images.length > 0 ? images[0] : null),
        images: images && images.length > 0 ? images : (image ? [image] : []),
        category,
        subCategory,
        variants
    })
    return product
}


// Fetch paginated products with search and category filtering
export const getAllProductsService = async (query)=>{
    const {search,category,subCategory,page=1,limit=10}=query

    const filter={}
    if(search){
        filter.name={
            $regex:search,
            $options:"i",
        }
    }

    if(category){
        filter.category = category
    }
    if(subCategory){
        filter.subCategory = subCategory
    }

    const skip = (page-1) * limit

    const products = await Product.find(filter)
    .populate("category","name")
    .populate("subCategory","name")
    .sort({createdAt:-1})
    .skip(skip)
    .limit(Number(limit))
    
    const totalProducts = await Product.countDocuments(filter);
    return {
        products,
        pagination:{
            totalProducts,
            currentPage:Number(page),
            totalPages:Math.ceil(totalProducts/Number(limit))
        }
    }
}

// Fetch a single product by its ID with populated category names
export const getAllProductByIdService = async (id)=>{
    if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
    const product = await Product.findById(id)
    .populate("category","name")
    .populate("subCategory","name")

    if(!product){
        throw new Error("Product not found")
    }
    return product
}

// Update product details and replace old uploaded images if new ones are provided
export const updateProductService = async (id,productData,image,images = [])=>{
    const {name,description,category,subCategory,variants} = productData

    const product = await Product.findById(id)
    if(!product){
        throw new Error('Product not found')
    }

    const existingCategory = await Category.findById(category)
    if(!existingCategory){
        throw new Error("Category not found")
    }

    const existingSubCategory = await SubCategory.findById(subCategory)
    if(!existingSubCategory){
        throw new Error("Sub-category not found")
    }
    
    if(existingSubCategory.category.toString()!==category){
        throw new Error("Selected subcategory does not belong to this category")
    }

    const duplicateProduct = await Product.findOne({
        name:{
            $regex:new RegExp(`^${name.trim()}$`,"i")
        },
        _id:{$ne:id}
    })

    if(duplicateProduct){
        throw new Error("Product already exists")
    }

    variants.sort((a,b)=>a.ram - b.ram)

    const ramSet = new Set()

    for(const variant of variants){
        if(ramSet.has(variant.ram)){
            throw new Error(`Duplicate RAM variant: ${variant.ram}`)
        }
        ramSet.add(variant.ram)
    }
    product.name = name.trim()
    product.description = description.trim()
    product.category = category
    product.subCategory = subCategory
    product.variants = variants
    if (images && images.length > 0) {
        const oldImages = new Set([
            product.image,
            ...(Array.isArray(product.images) ? product.images : [])
        ]);
        for (const oldImg of oldImages) {
            if (oldImg && !images.includes(oldImg)) {
                const imagePath = path.join(process.cwd(), oldImg);
                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (e) {}
                }
            }
        }
        product.images = images;
        product.image = images[0];
    } else if (image) {
        const oldImages = new Set([
            product.image,
            ...(Array.isArray(product.images) ? product.images : [])
        ]);
        for (const oldImg of oldImages) {
            if (oldImg && oldImg !== image) {
                const imagePath = path.join(process.cwd(), oldImg);
                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (e) {}
                }
            }
        }
        product.image = image;
        product.images = [image];
    }
    await product.save()
    return product
}

// Delete a product from the database and remove its image files from server storage
export const deleteProductService = async (id)=>{
    const product = await Product.findById(id)
    if(!product){
        throw new Error("product not found")
    }

    const allImages = new Set([
        product.image,
        ...(Array.isArray(product.images) ? product.images : [])
    ]);

    for (const img of allImages) {
        if (img) {
            const imagePath = path.join(process.cwd(), img);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (e) {}
            }
        }
    }

    await product.deleteOne()
    return product
}