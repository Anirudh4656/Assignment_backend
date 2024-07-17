import multer from 'multer';
import path from 'path';



const storage = multer.diskStorage({
    destination: "./uploads/", // Folder to store uploaded files
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  
  export const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("myFile"); // 'myFile' is the name attribute in the HTML form
  
  // Check file type
  function checkFileType(
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  }
  