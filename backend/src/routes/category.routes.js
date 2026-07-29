import express from "express"
import { createCategory } from "../controllers/category.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/",authMiddleware,createCategory)

export default router