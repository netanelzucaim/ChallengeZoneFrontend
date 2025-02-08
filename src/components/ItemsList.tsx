import { useState, useEffect } from "react";
import postsService from "../services/posts_service";
import commentsService from "../services/comments_service";
import CommentsModal from "./CommentsModal";
import PostFormModal from "./PostFormModal";
import imageService from "../services/image_service";

interface Post {
  _id: string;
  content: string;
  sender: string;
  avatarUrl: string;
  postPic?: string; // Make postPic optional
  username: string;
  comments: string[]; // Add comments array
}

interface Comment {
  _id: string;
  comment: string;
  sender: string;
  postId: string;
  username?: string;
  avatarUrl?: string;
}

interface ItemsListProps {
  items: Post[];
  onItemSelected: (index: number) => void;
  fetchPosts: () => void;
}

function ItemsList({ items, onItemSelected, fetchPosts }: ItemsListProps) {
  const [postItems, setPostItems] = useState<Post[]>(items);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showPostFormModal, setShowPostFormModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>('');
  const [editPostPic, setEditPostPic] = useState<File | null>(null);

  useEffect(() => {
    setPostItems(items);
    items.forEach((item) => {
      fetchComments(item._id);
    });
  }, [items]);

  const onAdd = () => {
    setShowPostFormModal(true);
  };

  const onDelete = async (postId: string) => {
    try {
      const { request } = postsService.deletePost(postId);
      await request;
      setPostItems(postItems.filter((item) => item._id !== postId));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const onEdit = (post: Post) => {
    setIsEditing(true);
    setEditContent(post.content);
    setEditPostPic(null);
    setCurrentPostId(post._id);
  };

  const handleUpdatePost = async () => {
    if (!currentPostId) return;
    let postPicUrl = '';

    if (editPostPic) {
      try {
        const { request } = imageService.uploadImage(editPostPic);
        const response = await request;
        postPicUrl = response.data.url;
      } catch (error) {
        console.error("Failed to upload image", error);
        return;
      }
    } else {
      const post = postItems.find((item) => item._id === currentPostId);
      postPicUrl = post?.postPic || '';
    }

    try {
      await postsService.updatePost(currentPostId, { content: editContent, postPic: postPicUrl });
      setIsEditing(false);
      setCurrentPostId(null);
      fetchPosts(); // Refresh the posts list after updating the post
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data } = await postsService.getCommentsForPost(postId);
      setComments((prevState) => ({
        ...prevState,
        [postId]: data,
      }));
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setComments((prevState) => ({
      ...prevState,
      [postId]: prevState[postId].filter((comment) => comment._id !== commentId),
    }));
    setPostItems((prevState) =>
      prevState.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter((id) => id !== commentId),
          };
        }
        return post;
      })
    );
  };

  const handleUpdateComment = (postId: string, commentId: string, updatedComment: string) => {
    setComments((prevState) => ({
      ...prevState,
      [postId]: prevState[postId].map((comment) =>
        comment._id === commentId ? { ...comment, comment: updatedComment } : comment
      ),
    }));
  };

  const handleAddComment = async (postId: string) => {
    try {
      const { data } = await commentsService.addComment(postId, newComment[postId]);
      setNewComment((prevState) => ({
        ...prevState,
        [postId]: "",
      }));
      fetchComments(postId); // Fetch comments again to re-render
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleShowCommentsModal = (postId: string) => {
    setCurrentPostId(postId);
    setShowCommentsModal(true);
  };

  const handleCloseCommentsModal = () => {
    setShowCommentsModal(false);
    setCurrentPostId(null);
  };

  const handleClosePostFormModal = () => {
    setShowPostFormModal(false);
  };

  const handlePostAdded = () => {
    fetchPosts(); // Refresh the posts list after a new post is added
  };

  const userId = localStorage.getItem("userId");

  return (
    <>
      {postItems.length === 0 && <p>No items</p>}
      {postItems.length !== 0 && (
        <ul className="list-group">
          {postItems.map((item, index) => (
            <li key={index} className="list-group-item">
              <div className="d-flex align-items-center">
                <img
                  src={item.avatarUrl}
                  alt="avatar"
                  className="rounded-circle me-3"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <h5 className="mb-1">{item.username}</h5>
                </div>
              </div>
              {item.postPic && <img src={item.postPic} alt="post" className="img-fluid mt-2" />}
              <p className="mb-1">{item.content}</p>
              <p className="text-muted">
                <span
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowCommentsModal(item._id);
                  }}
                >
                  Comments
                </span>
                : {comments[item._id] ? comments[item._id].length : 0}
              </p>
              {/* Display number of comments */}
              <div className="mt-2">
                <input
                  type="text"
                  value={newComment[item._id] || ""}
                  onChange={(e) =>
                    setNewComment((prevState) => ({ ...prevState, [item._id]: e.target.value }))
                  }
                  placeholder="Add a comment"
                />
                <button className="btn btn-primary btn-sm" onClick={() => handleAddComment(item._id)}>
                  Add Comment
                </button>
              </div>
              {userId === item.sender && (
                <>
                  <button
                    className="btn btn-danger mt-2 me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item._id);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-primary m-3" onClick={onAdd}>
        Add
      </button>
      {currentPostId && comments[currentPostId] && (
        <CommentsModal
          show={showCommentsModal}
          handleClose={handleCloseCommentsModal}
          comments={comments[currentPostId]}
          onDeleteComment={(commentId) => handleDeleteComment(currentPostId, commentId)}
          onUpdateComment={(commentId, updatedComment) => handleUpdateComment(currentPostId, commentId, updatedComment)}
        />
      )}
      <PostFormModal show={showPostFormModal} handleClose={handleClosePostFormModal} onPostAdded={handlePostAdded} />
      {isEditing && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editContent" className="form-label">Content</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editContent"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPostPic" className="form-label">Post Picture</label>
                  <input
                    type="file"
                    className="form-control"
                    id="editPostPic"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditPostPic(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdatePost}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ItemsList;