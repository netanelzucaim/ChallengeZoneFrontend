import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface iComment{
    user: string;
    content: string;
    postId: string;
}
const commentSchema = new Schema<iComment>({
    user: {
        type: String,
        required: true,
    },content: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true,
    }
  });


const Comments = mongoose.model<iComment>("Comment", commentSchema);
export default Comments; 