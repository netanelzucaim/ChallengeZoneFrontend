import express,{Express} from 'express';
const app = express();
import dotenv from 'dotenv' 
dotenv.config();
import mongoose from "mongoose";
import postRouter from "./routes/post_routes" 

import bodyParser from "body-parser";

const initApp = () => {
    return new Promise<Express>(async (resolve,reject) =>{
        const db = mongoose.connection;
        db.on("error",console.error.bind(console, "connection error:"));
        db.once("open",function(){
            console.log("connected to the database");
        })
        if(process.env.DB_CONNECT == undefined) {
        console.log("DB_CONNECT IS IS UNDEFINED")
        reject();
       } else {
        mongoose.connect(process.env.DB_CONNECT).then(()=>{
            // const commentRouter = require('../routes/comment_routes.js') 
            
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({extended: true}));
            app.use('/posts',postRouter)
            // app.use('/comments',commentRouter)
            resolve(app)
        })
       }
    })
}

export default initApp