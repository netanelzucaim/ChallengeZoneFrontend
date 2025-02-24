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

function Challenges() {
  const [items, setItems] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedUsername, setUpdatedUsername] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await postsService.getPostsForChallengeZone();
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      console.log("Failed to fetch posts", error);

      setError("Error fetching data...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, []);

  return (
    <div className="m-3">
      {isLoading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      <ItemsList items={items} onItemSelected={() => { }} fetchPosts={fetchPosts} />
    </div>
  );
}

export default Challenges