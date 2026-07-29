import { createCategoryService } from "../services/category.service.js";
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