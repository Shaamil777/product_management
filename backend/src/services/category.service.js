import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

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

export const getAllCategoriesService = async()=>{
    const categories = await Category.find()
    return categories
}

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

export const deleteCategoryService = async(id)=>{
    const category = await Category.findById(id)
    if(!category){
        throw new Error("Category not found")
    }

    const hasSubCategories = await SubCategory.exists({
        category:id,
    })

    if(hasSubCategories){
        throw new Error("Category cannot be deleted as it has sub-categories")
    }

    await category.deleteOne()
    return category
    
}
