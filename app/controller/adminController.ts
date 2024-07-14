import { Request, Response } from "express";
import { User, UserRole } from "../schemas/User";
import createHttpError from "http-errors";
import { createResponse } from "../helper/response";

import { Plan } from "../schemas/PlanSchema";

export const createPlan = async (req: Request, res: Response) => {
  const {
    name,
    price,
    apiLimit,
    storageLimit,
    domainLimit,
    apiLimitPerSecond,
  } = req.body;
  const user=req.user;
  console.log("in user of getPlans",user);
  const userDetails = await User.findById(user?.id).populate({
    path: "plan",
  });;

  if (!userDetails) {
    throw createHttpError(404, 'User not found');
  }
  const plan = new Plan({
    name,
    price,
    apiLimit,
    storageLimit,
    domainLimit,
    apiLimitPerSecond,
  });

  await plan.save();
 
  res.send(createResponse({ msg: "Plans Created", plan }));
  //test
  
};
export const getPlans = async (req: Request, res: Response) => {
  try {
  
    const plans = await Plan.find();
    console.log("in backend of get plans", plans);
    res.send(createResponse(plans));
  } catch (error) {
    throw createHttpError(401, { message: "error getting Plan" });
  }
};
export const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const user = await User.findById(id);
  console.log(user);
  if (!user) {
    //i am not able to use return here?
    throw createHttpError(404, {
      message: `Invalid User not found`,
    });
  }
  console.log(user.isBlocked);
  if (user.isBlocked == true) {
    user.isBlocked = false;
  } else {
    user.isBlocked = true;
  }

  await user.save();
  console.log(user);
  res.send(createResponse({ msg: "User blocked" }));
};
export const Users = async (req: Request, res: Response) => {

  try {
    const users = await User.find();
    console.log(users);
    res.send(createResponse(users));
  } catch (e) {
    console.log(e);
  }

};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.send(createResponse({ msg: "User Deleted" }));
  } catch (e) {
    console.log(e);
  }
};
