import bcrypt from "bcrypt"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"



// Register a new user, hash their password, and generate an auth token
export const signupService = async({name,email,password})=>{
    // Check if user already exists
    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new Error("Email already registered")
    }

    // Encrypt password before saving to database
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    // Generate JWT token for authentication
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

// Verify user credentials and generate an auth token on successful login
export const loginService = async({email,password})=>{
    // Find user by email
    const user = await User.findOne({email})
    if(!user){
        throw new Error("User is not registered")
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("Invalid password")
    }

    // Generate JWT token for current session
    const token = generateToken(user._id)
    return {
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        },
        token
    }
}