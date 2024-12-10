import express,{Express} from 'express';
const app = express();
import dotenv from 'dotenv' 
dotenv.config();
import mongoose from "mongoose";
import postRouter from "./routes/post_routes" 
import commentRouter from "./routes/comment_routes" 

import bodyParser from "body-parser";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/posts',postRouter)
app.use('/comments',commentRouter)
const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open",function(){
    console.log("connected to the database");
})


const initApp = () => {
    return new Promise<Express>( (resolve,reject) =>{
        if(process.env.DB_CONNECT == undefined) {
        console.log("DB_CONNECT IS IS UNDEFINED")
        reject("DB_CONNECT is not defined in .env file");
    } else {
        mongoose.connect(process.env.DB_CONNECT).then(()=>{
            resolve(app)
        }).catch((error) => {
            reject(error);
          });
       }
    })
}

export default initApp