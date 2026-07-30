
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";

// Add or remove a product from the user's wishlist
export const toggleWishlistService = async(userId,productId)=>{
    const product = await Product.findById(productId)
    if(!product){
        throw new Error("Product not found")
    }

    let wishlist = await Wishlist.findOne({
        user:userId
    })

    if(!wishlist){
        wishlist = await Wishlist.create({
            user:userId,
            products:[]
        })
    }

    const productExists = wishlist.products.some(
        (id)=>id.toString()===productId
    );

    if(productExists){
        wishlist.products = wishlist.products.filter(
            (id)=>id.toString()!==productId
        )
        await wishlist.save()

        return {
            isWishlisted: false,
            message: "Product removed from wishlist",
            wishlist
        }
    }
    wishlist.products.push(productId);
    await wishlist.save();

    return {
    isWishlisted: true,
    message: "Product added to wishlist",
    wishlist
}

}

// Fetch the user's wishlist along with category and subcategory details
export const getWishlistService = async (userId)=>{
    const wishlist = await Wishlist.findOne({
        user:userId
    }).populate({
        path:"products",
        populate:[
            {
                path:"category",
                select:"name"
            },
            {
                path:"subCategory",
                select:"name"
            }
        ]
    })

    const products = (wishlist?.products || []).filter(Boolean);

    return { ...wishlist?._doc, products };
}

