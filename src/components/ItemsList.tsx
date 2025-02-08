import { useState, useEffect } from "react";
import postsService from "../services/posts_service";
import commentsService from "../services/comments_service";
import Comments from "./Comments";

interface Post {
    _id: string,
    content: string,
    sender: string,
    avatarUrl: string,
    postPic?: string, // Make postPic optional
    username: string,
    comments: string[] // Add comments array
}

interface Comment {
    _id: string,
    comment: string,
    sender: string,
    postId: string,
    username?: string,
    avatarUrl?: string
}

interface ItemsListProps {
    items: Post[],
    onItemSelected: (index: number) => void
}

function ItemsList({ items, onItemSelected }: ItemsListProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [postItems, setPostItems] = useState<Post[]>(items);
    const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setPostItems(items);
        items.forEach(item => {
            fetchComments(item._id);
        });
    }, [items]);

    console.log("PostsList component");

    const onSelect = (index: number) => {
        console.log("click ", index)
        setSelectedIndex(index);
    }

    const onAdd = () => {
        console.log("add")
    }

    const onSelectComplete = () => {
        console.log("select complete")
        onItemSelected(selectedIndex);
    }

    const onDelete = async (postId: string) => {
        try {
            const { request } = postsService.deletePost(postId);
            await request;
            console.log('Post deleted successfully');
            // Remove the deleted item from the state
            setPostItems(postItems.filter(item => item._id !== postId));
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    }

    const fetchComments = async (postId: string) => {
        try {
            const { data } = await postsService.getCommentsForPost(postId);
            setComments(prevState => ({
                ...prevState,
                [postId]: data
            }));
        } catch (error) {
            console.error('Failed to fetch comments', error);
        }
    }

    const handleDeleteComment = (postId: string, commentId: string) => {
        setComments(prevState => ({
            ...prevState,
            [postId]: prevState[postId].filter(comment => comment._id !== commentId)
        }));
        setPostItems(prevState => prevState.map(post => {
            if (post._id === postId) {
                return {
                    ...post,
                    comments: post.comments.filter(id => id !== commentId)
                };
            }
            return post;
        }));
    };

    const handleUpdateComment = (postId: string, commentId: string, updatedComment: string) => {
        setComments(prevState => ({
            ...prevState,
            [postId]: prevState[postId].map(comment => comment._id === commentId ? { ...comment, comment: updatedComment } : comment)
        }));
    };

    const handleAddComment = async (postId: string) => {
        try {
            const { data } = await commentsService.addComment(postId, newComment[postId]);
            setNewComment(prevState => ({
                ...prevState,
                [postId]: ''
            }));
            fetchComments(postId); // Fetch comments again to re-render
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    const userId = localStorage.getItem('userId');

    return (
        <>
            {postItems.length === 0 && <p>No items</p>}
            {postItems.length !== 0 &&
                <ul className="list-group">
                    {postItems.map((item, index) => (
                        <li
                            key={index}
                            className={`list-group-item ${selectedIndex === index ? "active" : ""}`}
                            onClick={() => { onSelect(index) }}
                        >
                            <div className="d-flex align-items-center">
                                <img src={item.avatarUrl} alt="avatar" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
                                <div>
                                    <h5 className="mb-1">{item.username}</h5>
                                </div>
                            </div>
                            {item.postPic && <img src={item.postPic} alt="post" className="img-fluid mt-2" />}
                            <p className="mb-1">{item.content}</p>
                            <p className="text-muted">
                                Comments: {comments[item._id] ? comments[item._id].length : 0}
                            </p> {/* Display number of comments */}
                            {comments[item._id] && <Comments comments={comments[item._id]} onDeleteComment={(commentId) => handleDeleteComment(item._id, commentId)} onUpdateComment={(commentId, updatedComment) => handleUpdateComment(item._id, commentId, updatedComment)} />} {/* Render Comments component */}
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={newComment[item._id] || ''}
                                    onChange={(e) => setNewComment(prevState => ({ ...prevState, [item._id]: e.target.value }))}
                                    placeholder="Add a comment"
                                />
                                <button className="btn btn-primary btn-sm" onClick={() => handleAddComment(item._id)}>Add Comment</button>
                            </div>
                            {userId === item.sender && (
                                <button className="btn btn-danger mt-2" onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}>Delete</button>
                            )}
                        </li>
                    ))}
                </ul>
            }
            <button className="btn btn-primary m-3" onClick={onAdd}>Add</button>
            <button className="btn btn-primary" onClick={onSelectComplete}>Select</button>
        </>
    );
}

export default ItemsList;