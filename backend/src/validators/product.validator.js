import {z} from "zod";

const variantSchema = z.object({
  ram: z
    .string()
    .min(1, "RAM must be atleast 1 GB"),

  price: z.coerce
    .number()
    .min(1, "Price must be greater than 0"),

  quantity: z.coerce
    .number()
    .min(0, "Quantity cannot be negative"),
});

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  category: z.string().min(1, "Category is required"),

  subCategory: z.string().min(1, "Subcategory is required"),

  variants: z
    .array(variantSchema)
    .min(1, "At least one variant is required"),
});