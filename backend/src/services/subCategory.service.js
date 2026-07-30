import Category from "../models/Category.js";
import product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";

// Create a new sub-category under a specific category after duplicate checks
export const createSubCategoryService = async({name,category})=>{
    const existingCategory = await Category.findById(category);
    if(!existingCategory){
        throw new Error("Category not found!")
    }
    
    const existingSubCategory = await SubCategory.findOne({
        category,
        name:{
            $regex:new RegExp(`^${name.trim()}$`,"i"),
        },
    });
    if(existingSubCategory){
        throw new Error("Sub-Category already exists")
    }

    const subCategory = await SubCategory.create({
        name:name.trim(),
        category,
    })

    return subCategory
}

// Fetch all sub-categories, optionally filtered by category ID
export const getAllSubCategoriesService = async(categoryId)=>{
    const filter={}
    if(categoryId){
        filter.category = categoryId
    }

    const subCategories = await SubCategory.find(filter).populate('category',"name").sort({createdAt:-1})
    return subCategories
}

// Update sub-category name and parent category after checking for duplicates
export const updateSubCategoryService = async(id,{name,category})=>{
    const subCategory = await SubCategory.findById(id)
    if(!subCategory){
        throw new Error("Sub-category not found")
    }

    const existingCategory = await Category.findById(category)
    if(!existingCategory){
        throw new Error("Category not found")
    }

    const duplicate = await SubCategory.findOne({
        category,
        name:{
            $regex:new RegExp(`^${name.trim()}$`,"i"),
        },
        _id:{$ne:id}
    });

    if(duplicate){
        throw new Error("Subcategory already exists in this category")
    }
    subCategory.name = name.trim()
    subCategory.category = category

    await subCategory.save()
    return subCategory
}

// Delete a sub-category only if no products are linked to it
export const deleteSubCategoryService=async(id)=>{
    const subCategory = await SubCategory.findById(id);
    if(!subCategory){
        throw new Error("Sub-category not found")
    }
    // Protect referential integrity: prevent deleting if products exist
    const hasProduct = await product.exists({
        subCategory:id
    })

    if(hasProduct){
        throw new Error("Sub-category cannot be deleted as it has products")
    }
    await subCategory.deleteOne()
    return true
}