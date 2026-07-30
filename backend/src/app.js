import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import errorHandler from "./middlewares/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import productRoutes from "./routes/product.routes.js"
import subCategoryRoutes from "./routes/subCategory.routes.js"
const app = express()


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/uploads",express.static(path.join(process.cwd(),"uploads")))



app.use("/api/auth",authRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/subCategory",subCategoryRoutes)
app.use("/api/product",productRoutes)

app.use(errorHandler)

export default app