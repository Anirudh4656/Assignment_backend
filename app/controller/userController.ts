import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User, IUser } from "../schemas/User";
import { File } from "../schemas/FileSchema";
import { Plan } from "../schemas/PlanSchema";
import { upload } from "../..";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";
// import Cryptr from "Cryptr";


export const uploadFile = async (req: Request, res: Response) => {
  let file;
  try {
    await new Promise<void>((resolve, reject) => {
      upload(req, res, (err: any) => {
        if (err) {
          return reject(err);
        }
        if (!req.file) {
          return reject(new Error("No file selected!"));
        }
        resolve();
      });
    });

    const user = req.user as IUser;
    console.log("in user of upload file", user);
    const { isPublic } = req.body;
    console.log("inPublic", isPublic);
    const name = req.file;
    console.log("inPublic", name?.filename);

    file = new File({
      user: user.id,
      filename: name?.filename,
      filepath: name?.path,
      isPublic,
      filesize: name?.size,
    });

    await file.save();
    const userRecord = await User.findById(user.id);
    if (userRecord && name) {
      const newUsedStorage = (userRecord.storageUsage || 0) + name?.size;
      userRecord.storageUsage = newUsedStorage;
      await userRecord.save();
    }

    console.log("in userstorage", userRecord);
    res.send(createResponse(file));
  } catch (e) {
    console.log(e);
  }
};

export const listFiles = async (req: Request, res: Response) => {
  try {
    const mediaFiles = await File.find().sort({ _id: -1 });
    res.send(createResponse(mediaFiles));
  } catch (e) {
    console.log(e);
  }
};

export const userPlans = async (req: Request, res: Response) => {
  const { plansId } = req.params;
  console.log("planid:668bd001235daa5ebe6d56ce", plansId);
  const plan = await Plan.findById(plansId);
  console.log("plan details of given data", plan);
  const userId = req.user as IUser;
  console.log("in userId of Plans:", userId.id);
  const user = await User.findById(userId.id).populate("plan");
  console.log("in userPlans", user);
  if (plan && user) {
    // user?.plan.push(plan);
    user.plan = [plan];
    user.apiUsage = 0
    await user.save();
  }
  // userDetails.plan = plan.id;
 
 
  console.log("after plans userDetails:",)
  console.log("in userPlans after adding plans", user);
  if (user) {
    res.send(createResponse({ user, message: "Plans added succesfully" }));
  }
};
export const Accesskeys = async (req: Request, res: Response) => {
  const { accessKey, id } = req.body;
  console.log("accessKey:", accessKey, "id:", id);

  try {
    const file = await File.findById(id);
    console.log(
      "file.user:",
      file?.user,
      "accesskey is same:",
      accessKey,
    );
    if (!file) {
      throw createHttpError(404, "File not found");
    }
    if (file.user.toString() === accessKey) {
      res.send(createResponse({ statusCode: 200, message: "Access granted" }));
    } else {
      throw createHttpError(401, "Invalid access key");
    }
  } catch (error) {
    if (error instanceof createHttpError.HttpError) {
      res
        .status(error.statusCode)
        .json(createResponse({ message: error.message }));
    } else {
      res.status(500).json(createResponse({ message: "Server error", error }));
    }
  }
};
//unused
// const humanReadableSize = (bytes: number | undefined) => {
//   if (bytes) {
//     const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
//     if (bytes === 0) return "0 Byte";
//     const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
//     return Math.round(bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
//   }
// };
// export const DLFile = async (req: Request, res: Response) => {
//   const file = await File.findById(req.params.id);

//   if (file) {
//     console.log("file", file);
//     res.download(file.filepath, file.filename);
//   }
// };
// export const listFile = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const files = await File.findById(id);
//     // const humanReadableFileSize = humanReadableSize(files?.filesize);
//     // const encryptedToken = generateEncryptedToken(files?._id);
//     // const fileUrl = `http://localhost:5000/api/file/${encryptedToken}`;
//   } catch (e) {
//     console.log(e);
//   }
// };
// const generateEncryptedToken = (id: string) => {
//   const cryptr = new Cryptr("ffffg"); // Replace with your secret key
//   const currentTime = new Date().getTime();
//   const expirationTime = new Date(currentTime + 10 * 60 * 1000).getTime();
//   const tokenString = `${expirationTime}-${id}`;
//   const encryptedToken = cryptr.encrypt(tokenString);
//   return encryptedToken;
// };