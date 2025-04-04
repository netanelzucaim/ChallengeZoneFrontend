import { FC, useState } from "react";
import commentsService from "../../services/comments_service";
import "bootstrap/dist/css/bootstrap.min.css";
import "./comments.css"; // Import custom CSS for additional styling

interface Comment {
  _id: string;
  comment: string;
  sender: string;
  postId: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string; // Add createdAt field
}

interface CommentsProps {
  comments: Comment[];
  onDeleteComment: (commentId: string) => void;
  onUpdateComment: (commentId: string, updatedComment: string) => void;
}

const Comments: FC<CommentsProps> = ({
  comments,
  onDeleteComment,
  onUpdateComment,
}) => {
  const userId = localStorage.getItem("userId");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [updatedComment, setUpdatedComment] = useState<string>("");

  const handleDelete = async (commentId: string) => {
    try {
      await commentsService.deleteComment(commentId);
      onDeleteComment(commentId);
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const handleUpdate = async (commentId: string) => {
    try {
      await commentsService.updateComment(commentId, updatedComment);
      onUpdateComment(commentId, updatedComment);
      setEditingCommentId(null);
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  return (
    <div className="comments-container">
      {comments.map((comment) => {
                const formattedDateTime = new Date(comment.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                });        return (
          <div
            key={comment._id}
            className="comment-card mb-3 p-3 shadow-sm rounded"
          >
            {editingCommentId === comment._id ? (
              <div>
                <input
                  type="text"
                  value={updatedComment}
                  onChange={(e) => setUpdatedComment(e.target.value)}
                  className="form-control mb-2"
                />
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleUpdate(comment._id)}
                >
                  Update
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingCommentId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">
                    <img
                      src={comment.avatarUrl}
                      alt="User Avatar"
                      className="rounded-circle me-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    {comment.comment}
                  </p>
                  <small className="text-muted">
                    By {comment.displayName} on {formattedDateTime}
                  </small>
                </div>
                {userId === comment.sender && (
                  <div>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setUpdatedComment(comment.comment);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
