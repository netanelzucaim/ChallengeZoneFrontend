import request  from "supertest"
import appInit from "../server"
import mongoose from "mongoose"
import postModel from "../models/post_model"
import testPosts from "./tests_post.json"
import {Express} from "express" 
import userModel from "../models/user_model"

let app:Express;

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

beforeAll(async ()=>{console.log("before all tests");
    app = await appInit()
    await postModel.deleteMany();
    await userModel.deleteMany();
    await request(app).post("/auth/register").send(userInfo)
    const response = await request(app).post("/auth/login").send(userInfo)
    userInfo.token = response.body.token;
    userInfo._id = response.body._id;   
});
afterAll(()=> {console.log("after all tests");
mongoose.connection.close()});
let postId = "";

describe("Posts test", ()=>{
    test("Test get all post empty",async ()=>{
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(0)
    })
    test("Test create a new post",async ()=>{
        for(const post of testPosts){
        const response = await request(app).post("/posts").set("authorization","JWT "+ userInfo.token).send(post);
        console.log(response.statusCode)
        console.log(response.body)
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
        expect(response.body.sender).toBe(userInfo._id);
        postId = response.body._id;
    }
    })
    test("Test get all post full",async ()=>{
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(testPosts.length)
    })
    //TODO: implement this test and get by query in the baseController 
    // test("Test get post by id",async ()=>{
    //     const response = await request(app).get("/posts/"+postId);
    //     expect(response.statusCode).toBe(200)
    //     expect(response.body._id).toBe(postId)
    // })
    test("Test filter post by sender",async ()=>{
        const response = await request(app).get("/posts?sender="+userInfo._id);
        const posts =   response.body;
        for(const post of posts){
            expect(post.sender).toBe(userInfo._id)
        }
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(testPosts.length)
    })    
    test("Test delete post by id",async ()=>{
        const response = await request(app).delete("/posts/"+postId).set("authorization","JWT "+ userInfo.token); 
        expect(response.statusCode).toBe(200)
        const responseGet = await request(app).get("/posts/"+postId)
        expect(responseGet.statusCode).toBe(404)
    })    
    test("Test create a new post failed",async ()=>{
       
        const response = await request(app).post("/posts").send({
            title: "Test Post 1",
            seneder: "nati"
        });
        console.log(response.statusCode)
        console.log(response.body)
        expect(response.statusCode).not.toBe(200);        
    })

});