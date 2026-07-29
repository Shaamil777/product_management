import jwt from "jsonwebtoken"
import User from "../models/User.js"

const authMiddleware = async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer")){
            throw new Error("Not authorized , token is missing")
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findById(decoded.id).select("-password")
        if(!user){
            throw new Error("User not found")
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export default authMiddleware