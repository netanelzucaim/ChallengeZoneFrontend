import express from 'express';
const router  = express.Router();
import postController from '../controllers/post_controller';

router.get("/:id",(req,res) =>{
    postController.getById(req,res)
});
router.post("/",postController.create.bind(postController));
router.get("/",postController.getAll.bind(postController));
router.put("/:id",(req,res) =>{
    postController.updateById(req,res)
});
router.delete("/:id", postController.deleteById.bind(postController));

export default router;