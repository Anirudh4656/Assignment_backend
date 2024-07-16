import express from "express";
import { Request, Response } from "express";
const router = express.Router();


import {
  listFiles,
  Accesskeys,
  uploadFile,
  userPlans,
  createPaymentIntent,
} from "../controller/userController";

// router.post("/users/uploadfile", expressAsyncHandler(uploadFile));