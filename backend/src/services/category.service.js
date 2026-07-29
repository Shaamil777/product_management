import Category from "../models/Category.js";

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

