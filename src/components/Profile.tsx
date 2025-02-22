import ItemsList from "./ItemsList";
import { useEffect, useState } from "react";
import postsService from "../services/posts_service";
import userService from "../services/user_service";
import imageService from "../services/image_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Post {
  _id: string;
  postPic: string;
  content: string;
  sender: string;
  displayName?: string;
  avatarUrl?: string;
}

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
}

function Profile() {
  const [items, setItems] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedUsername, setUpdatedUsername] = useState<string>('');
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
    const userId = user._id;
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
      await userService.updateUser(userId, { displayName: updatedUsername, avatar: avatarUrl });
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
    <div className="m-3">
      {isLoading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {user && (
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : user.avatar}
              alt="User Avatar"
              className="rounded-circle"
              style={{ width: "100px", height: "100px" }}
            />
            {isEditing && (
              <div className="mt-2">
                <FontAwesomeIcon
                  icon={faImage}
                  onClick={() => document.getElementById('fileInput')?.click()}
                  style={{ cursor: 'pointer' }}
                />
                <input
                  id="fileInput"
                  type="file"
                  accept="image/png, image/jpeg"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={updatedUsername}
                  onChange={(e) => setUpdatedUsername(e.target.value)}
                  className="form-control mb-2"
                />
                <button className="btn btn-primary me-2" onClick={handleUpdateUser}>Save</button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h5  className="p-3 rounded text-white d-inline-block shadow"
  style={{
    background: "linear-gradient(135deg, #6a11cb, #2575fc)", // מעבר צבע סגול-כחול
    fontSize: "1.2rem", // גודל טקסט מעט גדול יותר
    fontWeight: "bold", // הופך את הטקסט למודגש
    letterSpacing: "1px", // מרווח קטן בין האותיות
    border: "2px solid rgba(255, 255, 255, 0.3)", // מסגרת שקופה-לבנה עדינה
    padding: "10px 20px", // ריווח פנימי
    borderRadius: "12px", // פינות מעוגלות יותר
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // צל עדין
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // צל לטקסט כדי להדגיש אותו
  }}>{user.displayName}</h5><br></br>
<button 
  className="m-3 text-white fw-bold"
  style={{
    background: "linear-gradient(135deg,rgb(32, 158, 175),rgb(43, 43, 37))", // מעבר צבע ורוד-אדמדם
    border: "none", // מסיר מסגרת ברירת מחדל
    padding: "12px 24px", // ריווח פנימי נוח
    fontSize: "1rem", // גודל טקסט סטנדרטי ונעים
    borderRadius: "25px", // פינות מעוגלות בצורה אלגנטית
    cursor: "pointer", // מציין שהכפתור לחיץ
    transition: "all 0.3s ease-in-out", // אנימציה רכה
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)", // צל עדין
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // צל קטן לטקסט
  }}
  onMouseOver={(e) => e.currentTarget.style.background = "linear-gradient(135deg,rgb(13, 132, 147),rgb(22, 22, 19))"} // שינוי צבע במעבר עכבר
  onMouseOut={(e) => e.currentTarget.style.background = "linear-gradient(135deg,rgb(32, 158, 175),rgb(43, 43, 37))"} // חזרה לצבע המקורי
  onClick={() => setIsEditing(true)}
>
  Edit Your Details
</button>              </div>
            )}
          </div>
        </div>
      )}
      <ItemsList items={items} onItemSelected={() => {}} fetchPosts={fetchPosts} />
    </div>
  );
}

export default Profile;