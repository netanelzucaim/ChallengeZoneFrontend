//get all posts from database
import postModel,{iPost} from "../models/post_model";
import {Request,Response} from "express"
import createController from "./base_controller"


const postController = createController<iPost>(postModel)

export default postController