import jwt from "jsonwebtoken";
import { User, type IUser } from '../schemas/User';
import bcrypt from "bcrypt";
import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import createError from "http-errors";
import { Strategy as LocalStrategy} from 'passport-local';

const isValidPassword=async function(value:string,password:string){
    const compare=await bcrypt.compare(value,password);
    return compare;
}
export const initPassport=():void =>{
    //user login
  passport.use(
    "jwt",
    new Strategy(
        {
            secretOrKey:"dghfghghjghjghjghj",
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async(token:any,done:any)=>{
            try{
                done(null,token.user);
            }catch(error){
                done(error);
            }
        }
    )
  )
        passport.use(
            "login", 
            new LocalStrategy({
                usernameField:'email',
                passwordField:'password',
             
            },
        async(email,password,done)=>{
            try{
                const user:IUser |null =await User.findOne({email});
                console.log(`I AM IN USER ${user}`);
                if(!user){
                    done(createError(401, "User not found!"), false);
                    return
                }
                if(user.isBlocked){
                    done(createError(401, "User is blocked, Contact to admin"), false);
                    return 
                }
                const validate=await isValidPassword(password,user.password)
               
                if (!validate) {
                    done(createError(401, "Invalid email or password"), false);
                    return;
                  }
                  const {password:_p,...result}=user;
                  console.log("passport check ") ;
                  done(null, result, { message: "Logged in Successfully" });

            
            }catch(error){
                return done(error);
            }
        }
        
        )
        )}
    
    // passport.serializeUser((user: IUser, done) => {
    //     done(null, user.id);
    //   });
      
//       passport.deserializeUser(async (id, done) => {
//         try {
//           const user = await User.findById(id);
//           done(null, user);
//         } catch (error) {
//           done(error, null);
//         }
//       });
//     )
// }
// (user: Omit<IUser, "password">

export const createUserTokens=(user:any)=>{
    const jwtSecret=process.env.JWT_SECRET ?? '';
    console.log("checking user",user);
    const payload = {
        email:user.email, 
        id:user._id ,
        role:user.role,
        user:user.username
    }
    console.log("payload ",payload) ;
    const token =jwt.sign(payload,"dghfghghjghjghjghj",{expiresIn:"1h"});
    return {accessToken:token,refreshToken:""}
}
export const decodeToken = (token: string) => {
    const decode = jwt.decode(token);
    return decode as IUser;
  };
  