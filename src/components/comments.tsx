import { FC } from 'react';
import commentsService from '../services/comments_service';

interface Comment {
    _id: string;
    comment: string;
    sender: string;
    postId: string;
    username?: string;
    avatarUrl?: string;
}

interface CommentsProps {
    comments: Comment[];
    onDeleteComment: (commentId: string) => void;
}

const Comments: FC<CommentsProps> = ({ comments, onDeleteComment }) => {
    const handleDelete = async (commentId: string) => {
        try {
            await commentsService.deleteComment(commentId);
            onDeleteComment(commentId);
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    return (
        <div>
            {comments.map((comment) => (
                <div key={comment._id} className="comment">
                    <p>{comment.comment}</p>
                    <small>By {comment.username}</small>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(comment._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default Comments;