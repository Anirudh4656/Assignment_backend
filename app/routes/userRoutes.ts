import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import expressAsyncHandler from "express-async-handler";
import {

  listFiles
} from "../controller/userController";

// router.post("/users/uploadfile", expressAsyncHandler(uploadFile));
router.get("/users/file", expressAsyncHandler(listFiles));

export default router;
