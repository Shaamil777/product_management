import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middlware.js";
import { createProduct,deleteProduct,getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

const multiUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.post("/",authMiddleware,multiUpload,createProduct);
router.get("/",getAllProducts);
router.get("/:id",getProductById)
router.put("/:id",authMiddleware,multiUpload,updateProduct)
router.delete("/:id",authMiddleware,deleteProduct)

export default router;