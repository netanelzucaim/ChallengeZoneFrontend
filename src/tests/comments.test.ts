import request  from "supertest"
import appInit from "../server"
import mongoose from "mongoose"
import commentModel from "../models/comment_model"
import testComments from "./tests_comment.json"
import {Express} from "express" 
let app:Express;
//TODO: implement this tests by jwt 
beforeAll(async ()=>{console.log("before all tests");
    app = await appInit()
    await commentModel.deleteMany();
});
afterAll(()=> {console.log("after all tests");
mongoose.connection.close()});
let commentId = "";

describe("Comments test", ()=>{
    test("Test get all comment empty",async ()=>{
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(0)
    })
    test("Test create a new comment",async ()=>{
        for(const comment of testComments){
        const response = await request(app).post("/comments").send(comment);
        console.log(response.statusCode)
        console.log(response.body)
        expect(response.statusCode).toBe(201);
        expect(response.body.postId).toBe(comment.postId);
        expect(response.body.content).toBe(comment.content);
        expect(response.body.user).toBe(comment.user);
        commentId = response.body._id;
    }
    })
    test("Test get all comments full",async ()=>{
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(testComments.length)
    })
    test("Test get comment by id",async ()=>{
        const response = await request(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200)
        expect(response.body._id).toBe(commentId)
    })
    //TO DO:
    //  test("Test filter comment by sender",async ()=>{
    //     const response = await request(app).get("/comments?sender="+testComments[0].sender);
    //     expect(response.statusCode).toBe(200)
    //     expect(response.body.length).toBe(1)
    // })    
    test("Test delete comment by id",async ()=>{
        console.log("comment id is "+ commentId)
        const response = await request(app).delete("/comments/" + commentId);
        expect(response.statusCode).toBe(200)
        const responseGet = await request(app).get("/comments/" + commentId)
        expect(responseGet.statusCode).toBe(404)
    })    
    test("Test create a new comment failed",async ()=>{
        const response = await request(app).post("/comments").send({
            user: "Test comment 1",
            content: "Test Comment 1"
        });
        console.log(response.statusCode)
        console.log(response.body)
        expect(response.statusCode).toBe(400);        
    })

});