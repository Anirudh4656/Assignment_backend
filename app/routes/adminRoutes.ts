import express from "express";
import {
  blockUser,
  createPlan,
  deleteUser,
  Users,
} from "../controller/adminController";
import expressAsyncHandler from "express-async-handler";
const router = express.Router();

router.patch("/users/block/:id", expressAsyncHandler(blockUser));
router.get("/users", expressAsyncHandler(Users));
router.post("/create", expressAsyncHandler(createPlan));
router.delete("/users/delete/:id", expressAsyncHandler(deleteUser));

export default router;
