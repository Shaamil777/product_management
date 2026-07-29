import bcrypt from "bcrypt"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"


export const signupService = async({name,email,password})=>{
    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new Error("Email already registered")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    const token = generateToken(user._id)

    return {
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
        },
        token
    }
}