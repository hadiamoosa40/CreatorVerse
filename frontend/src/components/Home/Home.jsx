import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const items = [
    { title: "Conversation", icon: "💬", path: "/conversation" },
    { title: "Music Generation", icon: "🎵", path: "/music-generation" },
    { title: "Image Generation", icon: "🖼️", path: "/image-generation" },
    { title: "Video Generation", icon: "🎥", path: "/video-generation" },
    { title: "Code Generation", icon: "💻", path: "/code-generation" },
  ];

  return (
    <div className="main-content d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="text-center mb-4">
        <h1>Explore the power of AI</h1>
        <p className="text-muted">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="items-container w-100" style={{ maxWidth: "400px" }}>
        {items.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="card p-3 my-2 d-flex justify-content-between align-items-center text-decoration-none text-dark"
          >
            <span>
              <span className="me-2">{item.icon}</span> {item.title}
            </span>
            <span>➡️</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
