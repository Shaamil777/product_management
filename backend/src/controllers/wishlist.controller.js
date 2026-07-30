import { getWishlistService, toggleWishlistService } from "../services/wishlist.service.js";

export const toggleWishlist = async (req,res,next)=>{
    try {
        const response = await toggleWishlistService(req.user._id,req.params.productId)

        return res.status(200).json({
            success:true,
            ...response,
        })
    } catch (error) {
        next(error)
    }
}

export const getWishlist = async (req,res,next)=>{
    try {
        const wishlist = await getWishlistService(req.user._id);

        return res.status(200).json({
            success:true,
            data:wishlist
        });
    } catch (error) {
        next(error)
    }
}