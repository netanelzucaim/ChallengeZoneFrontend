import ItemsList from "./ItemsList";
import { useEffect, useState } from "react";
import postsService from "../services/posts_service";
import { Post } from "../interfaces"; // Import interfaces

function Home() {
  const [items, setItems] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const response = await postsService.getPosts();
      const filteredPosts = (response.data as unknown as Post[]).filter(
        (post: Post) => post.sender !== import.meta.env.VITE_SENDER_ID
      );
      setItems(filteredPosts);
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

export default Home;
