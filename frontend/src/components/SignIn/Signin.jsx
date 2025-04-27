import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Import navigate
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./Signup.css"; // CSS file for styling

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", name: "", password: "" });
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 🚀 Initialize navigate

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const route = isLogin ? "signin" : "signup";
  
    try {
      const res = await axios.post(`http://localhost:5000/${route}`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // 🚀
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Auth failed:", err.response?.data || err.message);
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/google-signin", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // 🚀
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };
  
  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      {!user ? (
        <form onSubmit={handleFormSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInput}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInput}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInput}
            required
          />
          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
      ) : (
        <div className="profile">
          <h3>Welcome, {user.name}!</h3>
          {user.picture && <img src={user.picture} alt="Profile" />}
        </div>
      )}

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
          Switch
        </button>
      </p>

      {!user && (
        <div className="oauth-buttons">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
      )}
    </div>
  );
};

export default Signup;
