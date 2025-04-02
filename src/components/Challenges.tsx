import ItemsList from "./itemList/ItemsList";
import { useEffect, useState } from "react";
import postsService from "../services/posts_service";
import "bootstrap/dist/css/bootstrap.min.css";
import { Post } from "../interfaces"; // Import interfaces

function Challenges() {
  const [items, setItems] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const response = await postsService.getPostsForChallengeZone();
      const postsWithCreatedAt = response.data.map((post: any) => ({
        ...post,
        createdAt: post.createdAt || new Date().toISOString(), // Ensure createdAt is present
      }));
      setItems(postsWithCreatedAt);
    } catch (error) {
      console.error("Failed to fetch posts", error);
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
      <ItemsList
        items={items}
        onItemSelected={() => {}}
        fetchPosts={fetchPosts}
      />
    </div>
  );
}

export default Challenges;
