import { useState, useEffect } from "react";
import postsService from "../../services/posts_service";
import commentsService from "../../services/comments_service";
import CommentsModal from "../commentsModal/CommentsModal";
import PostFormModal from "../postModal/PostFormModal";
import LikesModal from "../likesModal/LikesModal";
import imageService from "../../services/image_service";
import { Post, Comment } from "../../interfaces"; // Import interfaces
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faThumbsUp,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import "./ItemsList.css"; // Import custom CSS for additional styling

interface ItemsListProps {
  items: Post[];
  onItemSelected: (index: number) => void;
  fetchPosts: () => void;
}

function ItemsList({ items, fetchPosts }: ItemsListProps) {
  const [postItems, setPostItems] = useState<Post[]>(items);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showPostFormModal, setShowPostFormModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>("");
  const [editPostPic, setEditPostPic] = useState<File | null>(null);
  const [likesUserIds, setLikesUserIds] = useState<string[]>([]);

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
    let postPicUrl = "";

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
      postPicUrl = post?.postPic || "";
    }

    try {
      await postsService.updatePost(currentPostId, {
        content: editContent,
        postPic: postPicUrl,
      });
      setIsEditing(false);
      setCurrentPostId(null);
      fetchPosts(); // Refresh the posts list after updating the post
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await postsService.addLikeToPost(postId);
      fetchPosts(); // Refresh the posts list after liking the post
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const handleUnlikePost = async (postId: string) => {
    try {
      await postsService.removeLikeFromPost(postId);
      fetchPosts(); // Refresh the posts list after unliking the post
    } catch (error) {
      console.error("Failed to unlike post", error);
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
      [postId]: prevState[postId].filter(
        (comment) => comment._id !== commentId
      ),
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

  const handleUpdateComment = (
    postId: string,
    commentId: string,
    updatedComment: string
  ) => {
    setComments((prevState) => ({
      ...prevState,
      [postId]: prevState[postId].map((comment) =>
        comment._id === commentId
          ? { ...comment, comment: updatedComment }
          : comment
      ),
    }));
  };

  const handleAddComment = async (postId: string) => {
    try {
      await commentsService.addComment(postId, newComment[postId]);
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

  const handleShowLikesModal = (userIds: string[]) => {
    setLikesUserIds(userIds);
    setShowLikesModal(true);
  };

  const handleCloseLikesModal = () => {
    setShowLikesModal(false);
    setLikesUserIds([]);
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
      <div style={{ position: "relative" }}>
        <button className="btn btn-primary new-post-btn" onClick={onAdd}>
          New Post
        </button>
        <br></br>
        <br></br>

        {postItems.length !== 0 && (
          <div className="container d-flex justify-content-center">
            <ul className="list-group post-list">
              {postItems.map((item, index) => {
                const formattedDateTime = new Date(item.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                });
                return (
                  <li key={index} className="list-group-item post-item">
                    <div className="d-flex align-items-center">
                      <img
                        src={item.avatarUrl}
                        alt="avatar"
                        className="rounded-circle me-3 post-avatar"
                      />
                      <div>
                        <h5 className="mb-1">{item.displayName}</h5>
                        <p className="text-muted">{formattedDateTime}</p>
                      </div>
                    </div>
                    {item.postPic && (
                      <img
                        src={item.postPic}
                        alt="post"
                        className="img-fluid mt-2 mx-auto d-block post-image"
                      />
                    )}
                    <p className="mb-1">{item.content}</p>
                    <p className="text-muted">
                      <span
                        className="comments-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowCommentsModal(item._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faComment} /> Comments
                      </span>
                      : {comments[item._id] ? comments[item._id].length : 0} |
                      <span
                        className="likes-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowLikesModal(item.likes);
                        }}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} /> Likes:{" "}
                        {item.likes.length}
                      </span>
                    </p>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={newComment[item._id] || ""}
                        onChange={(e) =>
                          setNewComment((prevState) => ({
                            ...prevState,
                            [item._id]: e.target.value,
                          }))
                        }
                        placeholder="Add a comment"
                        className="form-control comment-input"
                      />
                      <button
                        className="btn btn-primary btn-sm add-comment-btn"
                        onClick={() => handleAddComment(item._id)}
                      >
                        Add Comment
                      </button>
                      <button
                        className={`btn btn-sm ms-2 like-btn ${
                          userId && item.likes.includes(userId)
                            ? "btn-success"
                            : "btn-outline-primary"
                        }`}
                        onClick={() =>
                          userId &&
                          (item.likes.includes(userId)
                            ? handleUnlikePost(item._id)
                            : handleLikePost(item._id))
                        }
                      >
                        {userId && item.likes.includes(userId)
                          ? "Liked"
                          : "Like"}
                      </button>
                    </div>
                    {userId === item.sender && (
                      <div className="post-actions">
                        <button
                          className="btn btn-danger mt-2 me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item._id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                        <button
                          className="btn btn-secondary mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {currentPostId && comments[currentPostId] && (
        <CommentsModal
          show={showCommentsModal}
          handleClose={handleCloseCommentsModal}
          comments={comments[currentPostId]}
          onDeleteComment={(commentId) =>
            handleDeleteComment(currentPostId, commentId)
          }
          onUpdateComment={(commentId, updatedComment) =>
            handleUpdateComment(currentPostId, commentId, updatedComment)
          }
        />
      )}
      <PostFormModal
        show={showPostFormModal}
        handleClose={handleClosePostFormModal}
        onPostAdded={handlePostAdded}
      />
      <LikesModal
        show={showLikesModal}
        handleClose={handleCloseLikesModal}
        userIds={likesUserIds}
      />
      {isEditing && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsEditing(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editContent" className="form-label">
                    Content
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editContent"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPostPic" className="form-label">
                    Post Picture
                  </label>
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdatePost}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ItemsList;