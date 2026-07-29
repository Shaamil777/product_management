import {z} from "zod"

export const signupSchema = z.object({
    name:z.string().trim().min(3,"Name must be atleast 3 characters"),
    email:z.email("Invalid email address"),
    password:z.string().min(6,"Password must be atleast 6 characters")
})

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});