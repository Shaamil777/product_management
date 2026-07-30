import { signupService , loginService } from "../services/auth.service.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";

// Handle user signup request, validate input data, and return auth token
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

// Handle user login request, validate credentials, and return auth token
export const login = async (req,res,next)=>{
    try {
        const validatedData = loginSchema.parse(req.body)

        const response = await loginService(validatedData)

        res.status(200).json({
            success:true,
            message:"Login successfull",
            data:response
        })
    } catch (error) {
        next(error)
    }
}