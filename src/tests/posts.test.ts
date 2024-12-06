import request  from "supertest"
import appInit from "../server"
import mongoose from "mongoose"
import postModel from "../models/post_model"
import testPosts from "./tests_post.json"
import {Express} from "express" 
let app:Express;

beforeAll(async ()=>{console.log("before all tests");
    app = await appInit()
    await postModel.deleteMany();
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
        const response = await request(app).post("/posts").send(post);
        console.log(response.statusCode)
        console.log(response.body)
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
        expect(response.body.sender).toBe(post.sender);
        postId = response.body._id;
    }
    })
    test("Test get all post full",async ()=>{
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(testPosts.length)
    })
    test("Test get post by id",async ()=>{
        const response = await request(app).get("/posts/"+postId);
        expect(response.statusCode).toBe(200)
        expect(response.body._id).toBe(postId)
    })
    test("Test filter post by sender",async ()=>{
        const response = await request(app).get("/posts?sender="+testPosts[0].sender);
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(1)
    })    
    test("Test delete post by id",async ()=>{
        const response = await request(app).delete("/posts/"+postId);
        expect(response.statusCode).toBe(200)
        const responseGet = await request(app).get("/posts/"+postId)
        expect(responseGet.statusCode).toBe(404)
    })    
    test("Test create a new post failed",async ()=>{
       
        const response = await request(app).post("/posts").send({
            title: "Test Post 1",
            content: "Test Content 1"
        });
        console.log(response.statusCode)
        console.log(response.body)
        expect(response.statusCode).toBe(400);        
    })

});