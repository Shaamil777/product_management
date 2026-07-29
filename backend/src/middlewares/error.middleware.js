import { ZodError } from "zod";

const errorHandler = (err,req,res,next)=>{
    if(err instanceof ZodError){
        const formattedErrors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
        }))

        return res.status(400).json({
            success:false,
            message:"Validation failed",
            errors:formattedErrors
        })
    }
    return res.status(err.statusCode || 500).json({
        success:false,
        message:err.message || "Internal server error",
    })
}

export default errorHandler