import express from 'express';
const router  = express.Router();
import commentsController from '../controllers/comment_controller';

router.delete("/:id", commentsController.deleteComment);
router.post("/",commentsController.createComment);
router.get("/", commentsController.getComments);
//TO DO : implement it
// router.get("/:id", commentsController.getCommentsByPostId);
router.get("/:id", commentsController.getCommentById);
router.put("/:id", commentsController.updateCommentById);

export default router;