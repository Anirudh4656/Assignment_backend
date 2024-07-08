import express from "express";
const router = express.Router();
import { User, type IUser } from "../schemas/User";
import passport from "passport";
import { catchError, validate } from "../middlewares/validations";
import { loginUser, registerUser } from "../controller/auth";
import expressAsyncHandler from "express-async-handler";
router.post(
  "/signin",
  passport.authenticate("login", { session: false }),
  validate("users:login"),
  catchError,
  expressAsyncHandler(loginUser)
);
router.post(
  "/signup",
  validate("users:create"),
  catchError,
  expressAsyncHandler(registerUser)
);

// router.put("/:id", updateUser);

export default router;
