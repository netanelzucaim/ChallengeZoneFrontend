import express from 'express';
const router  = express.Router();
import commentController from '../controllers/comment_controller';
import { authMiddleware } from '../controllers/auth_controller';

router.delete("/:id", authMiddleware,commentController.deleteById.bind(commentController));
router.post("/",authMiddleware,commentController.create.bind(commentController));
router.get("/", commentController.getAll.bind(commentController));
//TO DO : implement it
// router.get("/:id", commentsController.getCommentsByPostId);
router.get("/:id",(req,res) =>{
    commentController.getById(req,res)
});
router.put("/:id", (req,res) =>{
    commentController.updateById(req,res)
});

export default router;


