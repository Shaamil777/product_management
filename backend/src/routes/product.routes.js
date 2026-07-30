import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middlware.js";
import { createProduct,deleteProduct,getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/",authMiddleware,upload.single("image"),createProduct);
router.get("/",getAllProducts);
router.get("/:id",getProductById)
router.put("/:id",authMiddleware,upload.single("image"),updateProduct)
router.delete("/:id",authMiddleware,deleteProduct)

export default router;