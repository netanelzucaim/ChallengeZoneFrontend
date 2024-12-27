import express, { Request, Response } from 'express';
import commentController from '../controllers/comment_controller';
import { authMiddleware } from '../controllers/auth_controller';

const router = express.Router();

router.delete("/:id", authMiddleware, commentController.deleteItem.bind(commentController));
router.post("/", authMiddleware, commentController.createItem.bind(commentController));
router.get("/", (req: Request, res: Response) => {
    commentController.getAll(req, res);
});
// TO DO : implement it
// router.get("/:id", commentsController.getCommentsByPostId);
router.get("/:id", (req, res) => {
    commentController.getById(req, res);
});
router.put("/:id", (req, res) => {
    commentController.updateById(req, res);
});

export default router;


