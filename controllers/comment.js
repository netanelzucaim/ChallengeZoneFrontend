const Comments = require("../models/comment_model")

const createComment = async (req,res,next) => {
    console.log(req.body)
    try{
    const comment = await Comments.create(req.body)
    res.status(201).send(comment);
    } catch (error) {
    res.status(400).send(error.message);
    }
}

const deleteComment = async (req,res,next) => {
    try{
    const id = req.params.id; 
    console.log(id)
    const comment = await Comments.findById(id)
    if(!comment){
        res.status(200).send(`id ${id} does not exist`);
    } else {
        const comment = await Comments.findByIdAndDelete(id)
        res.status(200).send(`succesfully delete comment with id of ${id}`);
    }
    } catch (error) {   
    res.status(400).send(error.message);
    }
}

module.exports = {createComment,deleteComment}