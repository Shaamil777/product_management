import { signupService } from "../services/auth.service.js";
import { signupSchema } from "../validators/auth.validator.js";

export const signup = async (req,res,next)=>{
    try {
        const validatedData = signupSchema.parse(req.body)

        const response = await signupService(validatedData)

        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:response
        })
    } catch (error) {
       next(error)
    }
}