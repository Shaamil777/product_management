import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
const app = express()


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



app.use("/api/auth",authRoutes)

app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"Machine task api runnning"
    })
})

app.use(errorHandler)

export default app