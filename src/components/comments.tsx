import { FC, useState } from 'react';
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
    onUpdateComment: (commentId: string, updatedComment: string) => void;
}

const Comments: FC<CommentsProps> = ({ comments, onDeleteComment, onUpdateComment }) => {
    const userId = localStorage.getItem('userId');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [updatedComment, setUpdatedComment] = useState<string>('');

    const handleDelete = async (commentId: string) => {
        try {
            await commentsService.deleteComment(commentId);
            onDeleteComment(commentId);
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    const handleUpdate = async (commentId: string) => {
        try {
            await commentsService.updateComment(commentId, updatedComment);
            onUpdateComment(commentId, updatedComment);
            setEditingCommentId(null);
        } catch (error) {
            console.error('Failed to update comment', error);
        }
    };

    return (
        <div>
            {comments.map((comment) => (
                <div key={comment._id} className="comment">
                    {editingCommentId === comment._id ? (
                        <div>
                            <input
                                type="text"
                                value={updatedComment}
                                onChange={(e) => setUpdatedComment(e.target.value)}
                            />
                            <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(comment._id)}>Update</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingCommentId(null)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p>{comment.comment}</p>
                            <small>By {comment.username}</small>
                            {userId === comment.sender && (
                                <>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(comment._id)}>Delete</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingCommentId(comment._id); setUpdatedComment(comment.comment); }}>Edit</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Comments;