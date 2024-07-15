import mongoose from "mongoose";


export const initDb=async():Promise<boolean>=>{
    const Mongo_db =process.env.MONG_URL
    if (!Mongo_db) {
        throw new Error('MONG_URL environment variable is not defined.');
      }
console.log("mongodb",Mongo_db);
return await new Promise((resolve,reject)=>{
    mongoose.set('strictQuery',false);
    mongoose.connect(Mongo_db).then(()=>{
        console.log('Db Connected!');
        resolve(true);
    }).catch(reject);
})
}

