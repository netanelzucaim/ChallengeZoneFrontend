//get all posts from database
import {Request,Response} from "express"
import { Model } from "mongoose";


class BaseController<T> {
    model: Model<T>;
    constructor(model: any){
        this.model = model;
    }
    async getAll (req: Request,res:Response) {
        const query = req.query;
        try {
            if (query.sender){ 
            const postsOfSender = await this.model.find({sender: query.sender});
            console.log(postsOfSender);
            res.send(postsOfSender);
        } else {
            const posts = await this.model.find();
            res.send(posts);      
        }        
        } catch(err){
            if (err instanceof Error) {
            res.status(400).send(`${err.message} - make sure you attach sender id `)
            }
        }
    };

    async getById (req: Request,res:Response) {
        const id = req.params.id;
        console.log(req.body);
        try{
            const post = await this.model.findById(id);
            if (post) {
                return res.send(post);
            } else {
                return res.status(404).send("Post not found");
            }
        } catch (err) {
            if (err instanceof Error) {
            return res.status(400).send(err.message);
            }
        }
        
    };

    async updateById (req: Request,res:Response) {
        const id = req.params.id;
        console.log(req.body);
        try {
            const post = await this.model.findById(id);
            if (post) {
                //need to fix
                // post.content = req.body.content;
                await post.save();
                return res.status(200).send(post);
            } else {
                return res.status(404).send("Post not found");
            }
        } catch (err) {
            if (err instanceof Error) {
            return res.status(400).send(err.message);
            }
        }
    };

    async create(req: Request,res:Response) {
        console.log(req.body);
        try {
            const post = await this.model.create(req.body);
            res.status(201).send(post);
        } catch (err) {
            res.status(400).send(err);
        }
    };

    async deleteById (req: Request,res:Response) {
        const id = req.params.id;
        console.log("id to be deleted is "+ id)
        try {
            await this.model.findByIdAndDelete(id);
            res.status(200).send();
        } catch (err) {
            res.status(400).send(err);
        }
    };
}
//TO DO: understand what to export - they both or just one?
export const createController = <T>(model:Model<T>)=>{
return new BaseController(model);
}
export default BaseController

