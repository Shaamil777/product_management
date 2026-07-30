import { createSubCategory,deleteSubCategory,getAllSubCategories,updateSubCategory } from "../controllers/subCategory.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",authMiddleware,createSubCategory)
router.get("/",getAllSubCategories)
router.put("/:id",authMiddleware,updateSubCategory)
router.delete("/:id",authMiddleware,deleteSubCategory)

export default router