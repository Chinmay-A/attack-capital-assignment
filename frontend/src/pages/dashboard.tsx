import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const API_URL = "http://localhost:5879/api";

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/post`,
        { title, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.status === 200) {
        setMessage("Post added successfully");
        setTitle("");
        setContent("");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setMessage("Failed to add post");
      }
    }
  };

  return (
    <div className="container mt-5">
        <Navbar></Navbar><br></br>
      <h2 className="text-center">Add a Post</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handlePostSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
};

export default Dashboard;
