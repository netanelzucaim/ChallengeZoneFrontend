import ItemsList from "../itemList/ItemsList";
import { useEffect, useState } from "react";
import postsService from "../../services/posts_service";
import userService from "../../services/user_service";
import imageService from "../../services/image_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { Post, User } from "../../interfaces"; // Import interfaces
import "./Profile.css"; // Import custom CSS for additional styling

function Profile() {
  const [items, setItems] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedUsername, setUpdatedUsername] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await postsService.getPostsForUser();
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setError("Error fetching data...");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not found");
      return;
    }
    try {
      const { request } = userService.getUser(userId);
      const response = await request;
      setUser(response.data);
      setUpdatedUsername(response.data.displayName);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setError("Error fetching user data...");
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;
    const userId = user._id!;
    let avatarUrl = user.avatar;

    if (selectedImage) {
      try {
        const { request } = imageService.uploadImage(selectedImage);
        const response = await request;
        avatarUrl = response.data.url;
      } catch (error) {
        console.error("Failed to upload image", error);
        setError("Error uploading image...");
        return;
      }
    }

    try {
      await userService.updateUser(userId, {
        displayName: updatedUsername,
        avatar: avatarUrl,
      });
      setUser({ ...user, displayName: updatedUsername, avatar: avatarUrl });
      setIsEditing(false);
      fetchPosts(); // Refresh the posts list after updating the user details
    } catch (error) {
      console.error("Failed to update user", error);
      setError("Error updating user data...");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
    fetchUser();
  }, []);

  return (
    <div className="profile-container">
      {isLoading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {user && (
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={
                selectedImage ? URL.createObjectURL(selectedImage) : user.avatar
              }
              alt="User Avatar"
              className="rounded-circle"
            />
            {isEditing && (
              <div className="mt-2 d-flex justify-content-center">
                <FontAwesomeIcon
                  icon={faImage}
                  size="xl"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  style={{ cursor: "pointer" }}
                />
                <input
                  id="fileInput"
                  type="file"
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div className="profile-info">
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={updatedUsername}
                  onChange={(e) => setUpdatedUsername(e.target.value)}
                  className="form-control mb-2"
                />
                <button
                  className="btn btn-primary me-2"
                  onClick={handleUpdateUser}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h5 className="profile-username">
                  Username: {user.username} <br /> Display name:{" "}
                  {user.displayName}
                </h5>
                <button
                  className="btn btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Your Display Name
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <ItemsList
        items={items}
        onItemSelected={() => {}}
        fetchPosts={fetchPosts}
      />
    </div>
  );
}

export default Profile;
