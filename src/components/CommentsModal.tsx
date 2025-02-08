import { FC } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Comments from './Comments';

interface Comment {
    _id: string;
    comment: string;
    sender: string;
    postId: string;
    username?: string;
    avatarUrl?: string;
}

interface CommentsModalProps {
    show: boolean;
    handleClose: () => void;
    comments: Comment[];
    onDeleteComment: (commentId: string) => void;
    onUpdateComment: (commentId: string, updatedComment: string) => void;
}

const CommentsModal: FC<CommentsModalProps> = ({ show, handleClose, comments, onDeleteComment, onUpdateComment }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Comments comments={comments} onDeleteComment={onDeleteComment} onUpdateComment={onUpdateComment} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CommentsModal;