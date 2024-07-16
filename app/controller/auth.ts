import { type IUser, User } from "../schemas/User";
import { createResponse } from "../helper/response";
import { createUserTokens } from "../services/passport-jwt";

//validate

export const loginUser = async (req: any, res: any) => {
  console.log("in login user",req.user)
  console.log("in user token", req.user._doc);

  const createToken = createUserTokens(req.user._doc!);
  console.log("in createToken", createToken);
  res.send(createResponse({ ...createToken, user: req.user._doc }));
};

export const registerUser = async (req: any, res: any) => {
  const { username, email, password } = req.body as IUser;
  const duplicateUser = await User.findOne({ email });

  if (duplicateUser) {
    return res.send(
      createResponse({ msg: "Invalid credentials or user blocked" })
    );
  } //will change to through http error
  const user = new User({ email, password, username });
  await user.save();
  // const { password: _p, ...result } = user;
  const tokens = createUserTokens(user);
  console.log("success", user);
  res.send(createResponse({ ...tokens,user}));
};
