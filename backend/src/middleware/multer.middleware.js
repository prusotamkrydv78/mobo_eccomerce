import multer from "multer";

const storage = multer.diskStorage({
  
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/webp') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage,fileFilter }) 

export default upload