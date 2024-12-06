import mongoose from "mongoose";
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title:{
        type: String, 
        required: true
    },  sender: {
        type: String,
        required: true
    }, content: {
        type: String,
        required: true
    }
});

const postModel = mongoose.model("Post", postSchema);
export default postModel