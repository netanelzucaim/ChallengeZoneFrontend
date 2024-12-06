import express from 'express';
const router  = express.Router();
import post from '../controllers/post';

router.get("/:id",(req,res) =>{
    post.getPostById(req,res)
});
router.post("/",post.createPost);
router.get("/",post.getPosts);
router.put("/:id",(req,res) =>{
    post.updatePostById(req,res)
});
router.delete("/:id", post.deletePost);

export default router;