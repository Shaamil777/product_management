import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

// Create a new category after checking if it already exists
export const createCategoryService = async({name})=>{
    const existingCategory = await Category.findOne({name:{$regex:new RegExp(`${name.trim()}$`,"i")}})
    if(existingCategory){
        throw new Error("Category already exists")
    }
    const category = await Category.create({
        name,
    })
    return category
}

// Fetch all categories from the database
export const getAllCategoriesService = async()=>{
    const categories = await Category.find()
    return categories
}

// Update an existing category name after checking for duplicates
export const updateCategoryService = async(id,{name})=>{
    const existingCategory = await Category.findOne({
        name:{$regex:new RegExp(`${name.trim()}$`,"i")},
        _id:{$ne:id},
    });
    if(existingCategory){
        throw new Error("Category already exists")
    }
    const category = await Category.findByIdAndUpdate(id,{name:name.trim()},{new:true,runValidators:true});

    if(!category){
        throw new Error("Category not found")
    }

    return category
}

// Delete a category only if no sub-categories belong to it
export const deleteCategoryService = async(id)=>{
    const category = await Category.findById(id)
    if(!category){
        throw new Error("Category not found")
    }

    // Protect referential integrity: prevent deleting if sub-categories exist
    const hasSubCategories = await SubCategory.exists({
        category:id,
    })

    if(hasSubCategories){
        throw new Error("Category cannot be deleted as it has sub-categories")
    }

    await category.deleteOne()
    return category
    
}

