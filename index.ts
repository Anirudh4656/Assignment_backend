import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import { initDb } from "./app/services/initDB";
import bodyParser from "body-parser";
import * as http from "http";
import { IUser, UserRole } from "./app/schemas/User";
import authRoutes from "./app/routes/authRoutes";
import userRoutes from "./app/routes/userRoutes";
import adminRoutes from "./app/routes/adminRoutes";
import { initPassport } from "./app/services/passport-jwt";
import { roleAuth } from "./app/middlewares/roleAuth";
import cors from "cors";
import errorHandler from "./app/middlewares/errorHandler";
import multer from "multer";
import path from "path";
import { loadConfig } from "./app/config/config";
import { File } from "./app/schemas/FileSchema";
const app:Express = express();


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
      userId?: User;
    }
  }
}
const storage = multer.diskStorage({
  destination: "./uploads/", // Folder to store uploaded files
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload variable with multer settings
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

const initApp = async (): Promise<void> => {
  dotenv.config();
const port=process.env.PORT ||5000
  initDb();
  initPassport();
  app.get("/file/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("id", id);
    if (!id) {
      return;
    }
    try {
      const file = await File.findById(id);
      if (file) {
        console.log("file", file);
        res.download(file.filepath, file.filename);
      }
    } catch (e) {
      console.log(e);
    }
  });

  app.use("/api", authRoutes);
    app.use("/api/admin", adminRoutes);
  // app.use("/api/admin", roleAuth(UserRole.ADMIN,['/Plans']), adminRoutes);
  app.use("/api", roleAuth(UserRole.USER,['/users/file']), userRoutes);

  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("server is running", port);
  });
};
initApp();
