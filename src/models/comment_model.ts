import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default iComment{
 
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
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
  });


const Comments = mongoose.model<iComment>("Comment", commentSchema);
export default Comments; 