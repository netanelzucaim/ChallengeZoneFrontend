import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import userService from '../services/user_service';

interface LikesModalProps {
  show: boolean;
  handleClose: () => void;
  userIds: string[];
}

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
}

const LikesModal: React.FC<LikesModalProps> = ({ show, handleClose, userIds }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userPromises = userIds.map(async (userId) => {
          const { request } = userService.getUser(userId);
          const response = await request;
          return response.data;
        });
        const usersData = await Promise.all(userPromises);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch users', error);
        setError('Error fetching user data...');
      }
    };

    fetchUsers();
  }, [userIds]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Likes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
          {users.map((user) => (
            <li key={user._id} className="list-group-item d-flex align-items-center">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="rounded-circle me-2"
                style={{ width: '30px', height: '30px' }}
              />
              <span>{user.displayName}</span>
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LikesModal;