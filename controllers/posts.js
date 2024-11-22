//get all posts from database
const Posts = require("../models/post_model")

const getAllPosts = async (req,res,next) => {
    const query = req.query;
    console.log(query);
    try{
      if(query.owner){
        console.log('hid')
        const posts = await Posts.find({owner: query.owner});
        console.log(posts)
        res.send(posts)
      } else {
        const posts = await Posts.find();
        console.log(posts)
        res.send(posts) 
      }        
    } catch(err){
        res.status(400).send(err.message)
    }
}

module.exports = {getAllPosts}