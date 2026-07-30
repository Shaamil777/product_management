import {z} from "zod";

export const subCategorySchema = z.object({
    name:z.string().trim().min(2,"Subcategory name must be atleast 2 characters"),
    category:z.string().min(1,"Category is required"),
})