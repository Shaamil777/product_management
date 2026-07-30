import { createSubCategoryService, deleteSubCategoryService, getAllSubCategoriesService, updateSubCategoryService } from "../services/subCategory.service.js";
import { subCategorySchema } from "../validators/subCategory.validator.js";

export const createSubCategory = async(req,res,next)=>{
    try {
        const validatedData = subCategorySchema.parse(req.body)
        const response = await createSubCategoryService(validatedData)
        return res.status(201).json({
            success:true,
            message:"SubCategory created successfully",
            data:response
        })
    } catch (error) {
        next(error)
    }
}

export const getAllSubCategories = async (req,res,next)=>{
    try {
        const {category} = req.query;
        const response = await getAllSubCategoriesService(category)
        return res.status(200).json({
            success:true,
            data:response
        })
    } catch (error) {
        next(error)
    }
}

export const updateSubCategory = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const validatedData = subCategorySchema.parse(req.body)
        const response = await updateSubCategoryService(id,validatedData)
        return res.status(200).json({
            success:true,
            message:"SubCategory updated successfully",
            data:response
        })
    } catch (error) {
        next(error)
    }
}

export const deleteSubCategory = async(req,res,next)=>{
    try {
        await deleteSubCategoryService(req.params.id)
        return res.status(200).json({
            success:true,
            message:"SubCategory deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

