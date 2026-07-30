import jwt from "jsonwebtoken"
import User from "../models/User.js"

const authMiddleware = async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer")){
            const error = new Error("Not authorized , token is missing")
            error.statusCode = 401
            throw error
        }

        const token = authHeader.split(" ")[1]
        if(!token || token === "null" || token === "undefined"){
            const error = new Error("Not authorized , token is missing")
            error.statusCode = 401
            throw error
        }

        let decoded;
        try {
            decoded = jwt.verify(token,process.env.JWT_SECRET)
        } catch (jwtErr) {
            const error = new Error("Not authorized , token is invalid or expired")
            error.statusCode = 401
            throw error
        }

        const user = await User.findById(decoded.id).select("-password")
        if(!user){
            const error = new Error("User not found")
            error.statusCode = 401
            throw error
        }
        req.user = user
        next()
    } catch (error) {
        error.statusCode = error.statusCode || 401
        next(error)
    }
}

export default authMiddleware