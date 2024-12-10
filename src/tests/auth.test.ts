import request  from "supertest"
import appInit from "../server"
import mongoose from "mongoose"
import {Express} from "express" 
import userModel from "../models/user_model"
import postModel from "../models/post_model"
let app:Express;

beforeAll(async ()=>{console.log("before all tests");
    app = await appInit()
    await userModel.deleteMany();
    await postModel.deleteMany();
});
afterAll(()=> {console.log("after all tests");
mongoose.connection.close()}); 
type UserInfo = {
    email:string;
    password:string;
    token?:string;
    _id?:string;
}
const userInfo:UserInfo = {
    email: "nati@gmail.com",
    password: "123456"
}

describe("Auth Test", ()=>{
    test("Auth Registration",async ()=>{
    const response = await request(app).post("/auth/register").send(userInfo)   
    expect(response.body)
    expect(response.statusCode).toBe(201)
    })
    test("Auth Failed",async ()=>{
        const response = await request(app).post("/auth/register").send(userInfo)   
        expect(response.body)
        expect(response.statusCode).not.toBe(201)
        })
    test("Auth Login",async ()=>{
        const response = await request(app).post("/auth/login").send(userInfo)   
        expect(response.body)
        expect(response.statusCode).toBe(200)
        const token = response.body.token;
        console.log(token + " token")
        expect(token).toBeDefined();
        expect(token).not.toBeNull();
        expect(token).not.toBe("");
        const userId = response.body._id;
        expect(userId).not.toBe("")
        userInfo.token = token; 
        userInfo._id = userId; 
        })
    test("get Protected API",async ()=>{    
        const response = await request(app).post("/posts").send({
            sender: userInfo._id,
            title: "My first post",
            content: "this is my first post"    
        })   
    expect(response.statusCode).not.toBe(201)

    const response2 = await request(app).post("/posts").set({
        authorization: 'jwt ' + userInfo.token
    }).send({
        sender: userInfo._id,
        title: "My first post",
        content: "this is my first post"    
    })   
    expect(response2.statusCode).toBe(201)
    })
   
    
    test("get Protected API invalid",async ()=>{    

    const response2 = await request(app).post("/posts").set({
        authorization: 'jwt ' + userInfo.token + "1"
    }).send({
        sender: userInfo._id,
        title: "My first post",
        content: "this is my first post"    
    })   
    expect(response2.statusCode).toBe(403)
    })
  });