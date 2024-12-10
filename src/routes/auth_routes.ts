import express,{Request,Response} from 'express';
const router  = express.Router();
import authController from '../controllers/auth_controller';

router.post("/register",(req:Request,res:Response) => {
    authController.register(req,res);
})

router.post("/login",(req:Request,res:Response) => {
    authController.login(req,res);
})

export default router;


