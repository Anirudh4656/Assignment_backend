import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../schemas/User';
import { File } from '../schemas/FileSchema';
import { Plan } from '../schemas/PlanSchema';
// import multer from 'multer';
import path from 'path';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({ storage });

// export const uploadFile = [
//   upload.single('file'),
//   asyncHandler(async (req: Request, res: Response) => {
//     const user = req.user as IUser;
//     const { isPublic } = req.body;

//     const file = new File({
//       user: user._id,
//       filename: req.file?.filename,
//       filepath: req.file?.path,
//       isPublic,
//     });

//     await file.save();
//     res.status(201).json(file);
//   }),
// ];

export const listFiles = asyncHandler(async (req: Request, res: Response) => {
  // const files = await File.find({ user: req.user._id });
  // res.json(files);
});
