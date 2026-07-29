import express from "express"
import { createCategory,getAllCategories, updateCategory,deleteCategory } from "../controllers/category.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/",authMiddleware,createCategory)
router.get("/",getAllCategories)
router.put("/:id",authMiddleware,updateCategory)
router.delete("/:id",authMiddleware,deleteCategory)

export default router