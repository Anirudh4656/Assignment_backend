import express from "express";
import { Request, Response } from "express";
const router = express.Router();
// import apiAuth from "./app/middlewares/apiAuth";
import apiKeyLimit from "../middlewares/apiKeyLimit";
import expressAsyncHandler from "express-async-handler";
import {
  listFile,
  listFiles,Accesskeys,
  uploadFile,
  userPlans,
  DLFile
} from "../controller/userController";

router.post("/users/uploadfile", apiKeyLimit,expressAsyncHandler(uploadFile));
router.get("/file/:id",expressAsyncHandler( DLFile));
router.get("/users/file/:id", expressAsyncHandler(listFile));
router.post("/users/keys", expressAsyncHandler(Accesskeys));
router.post("/users/plans/:plansId", expressAsyncHandler(userPlans));
router.get("/users/file", expressAsyncHandler(listFiles));
export default router;
