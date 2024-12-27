//get all posts from database
import postModel, { iPost } from "../models/post_model";
import { Model } from "mongoose";
import {Request,Response} from "express"
import BaseController from "./base_controller";
import { NextFunction } from "express";

class PostController extends BaseController<iPost> {
    constructor(model: Model<iPost>) {
        super(model);
    }

    async create(req: Request, res: Response) {
        try {
            const _id = req.query.userId;
            const post = {
                ...req.body,
                sender: _id
            };
            req.body = post;
            return super.create(req, res);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}


export default new PostController(postModel)