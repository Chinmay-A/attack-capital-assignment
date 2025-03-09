import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const API_URL='http://localhost:5879/api';
        const res = await axios.get(`${API_URL}/posts`);
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mt-4">
        <Navbar></Navbar>
      <h2 className="text-center">Latest Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="card my-3 p-3">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <small className="text-muted">By {post.author_email}</small>
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No posts available</p>
      )}
    </div>
  );
}
