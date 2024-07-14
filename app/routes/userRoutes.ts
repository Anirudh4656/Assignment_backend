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
} from "../controller/userController";

router.post("/users/uploadfile", apiKeyLimit, expressAsyncHandler(uploadFile));
router.post("/users/keys", apiKeyLimit, expressAsyncHandler(Accesskeys));
router.post("/users/plans/:plansId", expressAsyncHandler(userPlans));
router.get("/users/file", expressAsyncHandler(listFiles));
router.post("/users/create-payment-intent", expressAsyncHandler(createPaymentIntent));

export default router;
//unused routes
// router.get("/file/:id",expressAsyncHandler(DLFile));
// router.get("/users/file/:id", expressAsyncHandler(listFile));