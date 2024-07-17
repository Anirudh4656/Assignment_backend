import express from "express";
import { Request, Response } from "express";
const router = express.Router();


import { downloadFile } from "../controller/downloadController";
import expressAsyncHandler from "express-async-handler";

router.get("/users/file/download/:id", expressAsyncHandler(downloadFile));
export default router;