import commentModel from "../models/comment_model";
import baseController from "./base_controller"
import {Request,Response} from "express"

const createComment = async (req: Request,res:Response) => {
    baseController.create(req,res,commentModel)    
};

const getComments = async (req: Request,res:Response) => {
    baseController.getAll(req,res,commentModel)    
};

const getCommentById = async (req: Request,res:Response) => {
    baseController.getById(req,res,commentModel)
};
//TO DO : migrating to bae_controller
// const getCommentsByPostId = async (req: Request,res:Response) => {
//     const postId = req.params.id;
//     if (postId) {
//         try{
//             const comments = await Comments.find({ postId: postId});
//             if (comments.length > 0) {
//                 return res.send(comments);
//             } else {
//                 return res.status(404).send("There are no comments found");
//             }
//         } catch (err) {
//             return res.status(400).send(err.message);
//         }
//     }
//     return res.status(400).send(err.message);
// };

const deleteComment = async (req: Request,res:Response) => {
    baseController.deleteById(req,res,commentModel)    
}

const updateCommentById = async (req: Request,res:Response) => {
    baseController.updateById(req,res,commentModel)    
};
//TO DO : adding getCommentsByPostId
// export default {getComments,getCommentsByPostId,createComment,deleteComment, updateCommentById}
export default {getComments,createComment,deleteComment, updateCommentById,getCommentById}