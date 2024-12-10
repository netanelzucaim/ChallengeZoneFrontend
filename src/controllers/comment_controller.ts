import commentModel,{iComment} from "../models/comment_model";
import createController from "./base_controller"
const commentController = createController<iComment>(commentModel)

export default commentController

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


//TO DO : adding getCommentsByPostId
// export default {getComments,getCommentsByPostId,createComment,deleteComment, updateCommentById}