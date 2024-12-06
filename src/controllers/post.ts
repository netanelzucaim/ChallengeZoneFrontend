//get all posts from database
import postModel from "../models/post_model";
import {Request,Response} from "express"

const getPosts = async (req: Request,res:Response) => {
        const query = req.query;
    console.log(query);
    try {
        if (query.sender){ 
        const postsOfSender = await postModel.find({sender: query.sender});
        console.log(postsOfSender);
        res.send(postsOfSender);
      } else {
        const posts = await postModel.find();
        console.log(posts);
        res.send(posts);      
      }        
    } catch(err){
        if (err instanceof Error) {
        res.status(400).send(`${err.message} - make sure you attach sender id `)
        }
    }
};

const getPostById = async (req: Request,res:Response) => {
    const id = req.params.id;
    console.log(req.body);
    try{
        const post = await postModel.findById(id);
        if (post) {
            return res.send(post);
        } else {
            return res.status(404).send("Post not found");
        }
    } catch (err) {
        if (err instanceof Error) {
        return res.status(400).send(err.message);
        }
    }
    
};

const updatePostById = async (req: Request,res:Response) => {
    const id = req.params.id;
    console.log(req.body);
    try {
        const post = await postModel.findById(id);
        if (post) {
            post.content = req.body.content;
            await post.save();
            return res.status(200).send(post);
        } else {
            return res.status(404).send("Post not found");
        }
    } catch (err) {
        if (err instanceof Error) {
        return res.status(400).send(err.message);
        }
    }
};

const createPost = async (req: Request,res:Response) => {
    console.log(req.body);
    try {
        const post = await postModel.create(req.body);
        res.status(201).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};

const deletePost = async (req: Request,res:Response) => {
    const postId = req.params.id;
    try {
         await postModel.findByIdAndDelete(postId);
        res.status(200).send();
    } catch (err) {
        res.status(400).send(err);
    }
};


export default {getPosts,getPostById,updatePostById,createPost,deletePost}