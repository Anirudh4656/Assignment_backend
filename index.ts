import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import { initDb } from "./app/services/initDB";
import bodyParser from "body-parser";
import * as http from "http";
import { IUser, UserRole } from "./app/schemas/User";
import authRoutes from "./app/routes/authRoutes";
import userRoutes from "./app/routes/userRoutes";
import adminRoutes from "./app/routes/adminRoutes";
import downloadRoutes from "./app/routes/downloadRoutes";
import { initPassport } from "./app/services/passport-jwt";
import { roleAuth } from "./app/middlewares/roleAuth";
import cors from "cors";
import errorHandler from "./app/middlewares/errorHandler";
import multer from "multer";
import path from "path";
import { loadConfig } from "./app/config/config";
import { File } from "./app/schemas/FileSchema";
import { downloadFile } from "./app/controller/downloadController";
const app: Express = express();

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

// Initialize upload variable with multer settings

const initApp = async (): Promise<void> => {
  dotenv.config();
  const port = process.env.PORT || 5000;
  initDb();
  initPassport();

  app.use("/api", downloadRoutes);

  app.use("/api", authRoutes);

  app.use("/api/admin", roleAuth(UserRole.ADMIN, ["/Plans"]), adminRoutes);
  app.use("/api", roleAuth(UserRole.USER, ["/users/file"]), userRoutes);

  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("server is running", port);
  });
};
initApp();
