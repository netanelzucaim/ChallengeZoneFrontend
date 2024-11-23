//get all posts from database
const Comments = require("../models/comment_model")

const createComment = async (req,res,next) => {
    console.log(req.body)
    try{
    const post = await Comments.create(req.body)
    res.status(201).send(post);
    } catch (error) {
    res.status(400).send(error.message);
    }
}


module.exports = {createComment}