import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller.js"


const router = express.Router()

router.post("/:productId",authMiddleware,toggleWishlist)
router.get("/",authMiddleware,getWishlist)

export default router