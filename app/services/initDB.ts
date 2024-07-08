import mongoose from "mongoose";
// const mongodbUrl = process.env.MONGODB_URL ?? "";
//willcheck
//change to process.env.MONGODB_URI ??'';
export const initDb=async():Promise<boolean>=>{
return await new Promise((resolve,reject)=>{
    mongoose.set('strictQuery',false);
    mongoose.connect("mongodb+srv://anirudh75way:75@cluster0.wirznns.mongodb.net/").then(()=>{
        console.log('Db Connected!');
        resolve(true);
    }).catch(reject);
})
}

