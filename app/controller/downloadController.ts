import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User, IUser } from "../schemas/User";
import { File } from "../schemas/FileSchema";
import { Plan } from "../schemas/PlanSchema";
import { upload } from "../services/multer";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";
export const downloadFile = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
    console.log("id", id);
    if (!id) {
      return;
    }
    try {
      const file = await File.findById(id);
      if (file) {
        console.log("file", file);

        res.download(file.filepath, file.filename);
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};