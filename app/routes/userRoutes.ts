import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import expressAsyncHandler from "express-async-handler";
import {

  listFiles,keys,
  uploadFile,
  userPlans
} from "../controller/userController";

router.post("/users/uploadfile", expressAsyncHandler(uploadFile));
router.get("/users/file", expressAsyncHandler(listFiles));
router.get("/users/keys", expressAsyncHandler(keys));
router.post("/users/plans/:plansId", expressAsyncHandler(userPlans));

export default router;
