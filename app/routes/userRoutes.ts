import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import apiKeyLimit from "../middlewares/apiKeyLimit";
import expressAsyncHandler from "express-async-handler";

import {
  listFiles,
  Accesskeys,
  uploadFile,
  userPlans,
  createPaymentIntent,
  downloadFile
} from "../controller/userController";
import verifyApiKey from "../middlewares/verifyApikey";

router.post("/users/uploadfile",verifyApiKey, apiKeyLimit, expressAsyncHandler(uploadFile));
router.post("/users/keys/:id",verifyApiKey, apiKeyLimit, expressAsyncHandler(Accesskeys));
router.post("/users/plans/:plansId",expressAsyncHandler(userPlans));
router.get("/users/file",expressAsyncHandler(listFiles));
router.get("/users/file/download/:id",verifyApiKey,expressAsyncHandler(downloadFile));
router.post("/users/create-payment-intent",verifyApiKey, expressAsyncHandler(createPaymentIntent));

export default router;
//unused routes
// router.get("/file/:id",expressAsyncHandler(DLFile));
// router.get("/users/file/:id", expressAsyncHandler(listFile));