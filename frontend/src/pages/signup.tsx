import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const API_URL='http://localhost:5879/api';
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_URL}/signup`, {
        email,
        password,
      });
      if (res.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      setError("Signup failed. User may already exist.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Navbar></Navbar><br></br>
      <div className="card shadow-lg p-4 rounded" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
        <div className="mt-3 text-center">
          Already have an account? <Link href="/login" className="text-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
