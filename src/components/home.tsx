import ItemsList from "./ItemsList";
import { useEffect, useState } from "react";
import postsService, { CanceledError } from "../services/posts_service";

interface Post {
  _id: string;
  postPic: string;
  content: string;
  sender: string;
  displayName?: string;
  avatarUrl?: string;
}

function Home() {
  const [items, setItems] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const response = await postsService.getPosts();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      setError('Error fetching data...');
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

export default Home;