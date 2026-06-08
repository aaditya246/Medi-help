// import multer from 'multer';

// const storage=multer.diskStorage({
//     filename:function(req,file,callback){
//         callback(null,file.originalname)
//     }
// })

// const upload=multer({storage})

// export default upload

import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
});

const upload = multer({ storage: storage })

<<<<<<< HEAD
export default upload


// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({ storage });

// export default upload;
=======
export default upload
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
