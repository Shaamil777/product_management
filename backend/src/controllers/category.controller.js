import { success } from "zod";
import { createCategoryService, deleteCategoryService, getAllCategoriesService, updateCategoryService } from "../services/category.service.js";
import { categorySchema } from "../validators/category.validator.js";

export const createCategory = async(req,res,next)=>{
    try {
        const validatedData = categorySchema.parse(req.body)
        const response = await createCategoryService(validatedData)
        res.status(201).json({
            success:true,
            message:"Category created successfully",
            data:response
        })
    } catch (error) {
        next(error)
    }
}

export const getAllCategories = async(req,res,next)=>{
    try {
        const response = await getAllCategoriesService()
        res.status(200).json({
            success:true,
            message:"Categories fetched successfully",
            data:response
        })
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async(req,res,next)=>{
    try {
        const validatedData = categorySchema.parse(req.body)
        const response = await updateCategoryService(req.params.id,validatedData)

        return res.status(200).json({
            success:true,
            message:"Category updated successfully",
            data:response
        })
    } catch (error) {
        next(error)
    }
}

export const deleteCategory = async(req,res,next)=>{
    try {
        await deleteCategoryService(req.params.id)
        return res.status(200).json({
            success:true,
            message:"Category deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}