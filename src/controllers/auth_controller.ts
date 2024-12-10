import {Request,Response,NextFunction} from "express"
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
type TokenPayload = {
    _id:string;
}

const register = async (req: Request,res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }
    try {
        // Your registration logic here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);  
    const newUser = await userModel.create({ email: email, password: hashedPassword });
    res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error);
    }
}

const login = async (req: Request,res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("wrong Email or password");
    }
    try{
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).send("User not found");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send("Invalid email or password");
    }
    if(!process.env.TOKEN_SECRET){
        return res.status(500).send("missing auth configuration");
    }
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
    res.status(200).send({
        email: user.email,
        token: token,
        _id: user._id
    });
    } catch(err) {
        res.status(400)
    }
}


export const authMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const authHeader  =  req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) { 
        res.status(401).send("missing token");
        return;
    }
    if(!process.env.TOKEN_SECRET){
         res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err: any, data) => {
        if (err) {
            res.status(403).send("Invalid token");
            return;
        }
        const payload = data as TokenPayload
        req.query.userId = payload._id
        next();
    });
 }

export default {register,login,authMiddleware}