import multer from "multer"
import path from "path"
import fs from "fs"

const uploadPath = "uploads/products"

if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath,{recursive:true})
}

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,uploadPath)
    },
    filename: (req,file,callback)=>{
        const uniqueName = Date.now() + "-" + Math.round(Math.random * 1e9) + path.extname(file.originalname);
        callback(null,uniqueName)
    }
})

const fileFilter = (req,file,callback)=>{
    const allowedType = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ]

    if(allowedType.includes(file.mimetype)){
        callback(null,true)
    }else{
        callback(new Error("Only image files are allowed"))
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize:2*1024*1024
    }
})

export default upload