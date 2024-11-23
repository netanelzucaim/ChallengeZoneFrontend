//get all posts from database
const Posts = require("../models/post_model")

const getPosts = async (req,res,next) => {
    console.log("arrived");
    const query = req.query;
    console.log(query);
    try{

      if(query.sender){ 
        const postsOfSender = await Posts.find({userId: query.sender});
        console.log(postsOfSender)
        res.send(postsOfSender)
      } else {
        console.log(`params are ${req.query}`)
        const posts = await Posts.find();
        console.log(posts)
        res.send(posts)      
      }        
    } catch(err){
        res.status(400).send(`${err.message} - make sure you attach sender id `)
    }
}
const getAllPosts = async (req,res,next) => {
    try{
        const posts = await Posts.find();
        console.log(posts)
        res.send(posts)         
    } catch(err){
        res.status(400).send(err.message)
    }
}
const getPostById = async (req,res,next) => {
    const id = req.params.id;
    if(id){
        try{
            const post = await Posts.findById(id)
            if(post){
                return res.send(post);
            } else{
                return res.status(404).send("post not found")
            }
        }catch(err) {
            return res.status(400).send(err.message)
        }
    }
}
const createPost = async (req,res,next) => {
    console.log(req.body)
    try{
    const post = await Posts.create(req.body)
    res.status(201).send(post);
    } catch (error) {
    res.status(400).send(error.message);
    }
}

module.exports = {getAllPosts,getPostById,createPost,getPosts}