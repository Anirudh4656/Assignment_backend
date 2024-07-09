import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User,IUser } from '../schemas/User';
import { File } from '../schemas/FileSchema';
import { Plan } from '../schemas/PlanSchema';
import multer from "multer";
import path from 'path';
import { createResponse } from '../helper/response';

const storage = multer.diskStorage({
  destination: ( cb:any) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

export const uploadFile =  (async (req: Request, res: Response) => {
    const user = req.user as IUser ;
    const { isPublic } = req.body;

    const file = new File({
      user: "668d0576e50a2bfbc0822157",
      filename: req.file?.filename,
      filepath: req.file?.path,
      isPublic,
    });

    await file.save();
    res.send(createResponse(file));

  })


export const listFiles = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser ;
  const files = await File.find({ user:user});
  console.log("in files",files)
  res.send(createResponse(files));
});
export const userPlans = asyncHandler(async (req: Request, res: Response) => {
  const { plansId } = req.params;
  console.log("planid:668bd001235daa5ebe6d56ce",plansId);
  const plan = await Plan.findById(plansId);
  console.log("plan details of given data",plan);
  const userId = req.user as IUser ;
  const user = await User.findById(userId).populate("plan");
  console.log("in userPlans",user);
  if(plan && user){
    user?.plan.push(plan);
    //which will execute first 
    await user.save();
  }
  console.log("in userPlans after adding plans",user);
res.send(createResponse({message:"Plans added succesfully"}));
  // user.plans.push(...plans.map(plan => plan._id));
  // user.plan = plan;
  //   
  // console.log("in files",files)
  // res.send(createResponse(files));
  // user.plan = planId;
  // await user.save();
});
export const keys=asyncHandler(async(req:Request,res:Response)=>{
  const user = req.user as IUser ;
  try {
    const userKeys = await User.findById(user._id).select('apiKey publicSecret');
    // if (!userKeys) return res.status(404).json({ message: 'User not found' });
    // res.json({ apiKey: user.apiKey, publicSecret: user.publicSecret });
  } catch (err) {
    // res.status(500).json({ error: err.message });
  }
})