//this code is also available on multer documentation
//this middleware uploades the files to local storage which then further uploads to cloudinary

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); //destination to local file storage
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
