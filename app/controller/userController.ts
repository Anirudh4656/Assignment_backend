import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User, IUser } from "../schemas/User";
import { File } from "../schemas/FileSchema";
import { Plan } from "../schemas/PlanSchema";
import { upload } from "../services/multer";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";
import Stripe from "stripe";
import crypto from 'crypto';

export const apikey = async(req: Request, res: Response)=>{
  try{
  const apiKey = crypto.randomBytes(16).toString('hex'); // Generate a random API key
  const apiKeyExpiration = new Date();
  apiKeyExpiration.setDate(apiKeyExpiration.getDate() + 30); // Set expiration date to 30 days from now
  const userDetails = req.user as IUser;
  const user = await User.findById(userDetails.id);
  console.log("userDetails",userDetails)
  if (!user) {
     throw createHttpError(404, "Users not found")
  }
  user.apiKey = apiKey;
  user.apiKeyExpiration = apiKeyExpiration;
  await user.save();
  res.send(createResponse({apiKey,apiKeyExpiration }));
}catch(e){
  console.log(e)
}

}
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
      publicSecret: user?.publicSecret,
    });

    await file.save();
    if (user && name) {
      const newUsedStorage = (user.storageUsage || 0) + name?.size;
      user.storageUsage = newUsedStorage;
      await user.save();
    }

    console.log("in userstorage", user);
    res.send(createResponse(file));
  } catch (e) {
    console.log(e);
  }
};

export const listFiles = async (req: Request, res: Response) => {
  const { page } = req.query;
  console.log("page", page);
  try {
    const LIMIT = 2;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await File.countDocuments({});
    const files = await File.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.send(
      createResponse({
        files,
        currentPage: Number(page),
        NumberOfPages: Math.ceil(total / LIMIT),
      })
    );
  } catch (e) {
    console.log(e);
  }
};

export const createPaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const STRIPE = process.env.STRIPE_SECRET;

  const stripe = new Stripe(STRIPE!);
  const { paymentMethodId, planId } = req.body;
  console.log("in card Payment", planId, paymentMethodId);
  // Retrieve plan details from your database
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw createHttpError(404, "Plan not found");
  }

  const amount = plan.price * 100; // Convert to cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    const user = req.user as IUser;
    console.log("in userId of Plans:", user.id);
    console.log("in userPlans", user);
    if (plan && user) {
      // user?.plan.push(plan);
      user.plan = [plan];
      user.apiUsage = 0;
      user.storageUsage = 0;
      await user.save();
    }
    if (user) {
      res.send(
        createResponse({
          clientSecret: paymentIntent.client_secret,
          user,
          message: "Plans added succesfully",
        })
      );
    }
  } catch (error: any) {
    res.status(500).json(createResponse({ message: error.message, error }));
  }
};

export const userPlans = async (req: Request, res: Response) => {

  const { plansId } = req.params;
  const plan = await Plan.findById(plansId);
  console.log("plan details of given data", plan);
  const userId = req.user as IUser;
  console.log("in userId of Plans:", userId);
  const user = await User.findById(userId.id).populate("plan");
  console.log("in userPlans", user);
  if (plan && user) {
    user.plan = [plan];
    user.apiUsage = 0;
    user.storageUsage = 0;
    await user.save();
  }

  console.log("after plans userDetails:");
  console.log("in userPlans after adding plans", user);
  if (user) {
    res.send(createResponse({ user, message: "Plans added succesfully" }));
  }
};
export const Accesskeys = async (req: Request, res: Response) => {
 
  const { id } = req.params;

  const user = req.user;
  console.log("user of private files", user);

  try {
    const file = await File.findById(id);
    if (!file) {
      throw createHttpError(404, "File not found");
    }
    console.log(
      "accessuser:",
      file.user,
      "id:",
      user?.publicSecret,
      "user:",
      user
    );
    if (file.publicSecret === user?.publicSecret) {
      res.status(200).json(createResponse({ message: "Access granted" }));
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
// export const downloadFile = async (req: Request, res: Response) => {

//   try {
//     const { id } = req.params;
//     console.log("id", id);
//     if (!id) {
//       return;
//     }
//     try {
//       const file = await File.findById(id);
//       if (file) {
//         console.log("file", file);

//         res.download(file.filepath, file.filename);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
