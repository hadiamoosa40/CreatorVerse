import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Import useNavigate
import "./Video.css";

function VideoG() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ⬅️ Setup navigation

  const handleGenerate = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("User not logged in!");
      return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          email: user.email
        }),
      });

      const data = await response.json();

      // ✅ Handle backend redirect
      if (data.redirect) {
        navigate(data.redirect);
        return;
      }

      if (data.video_url) {
        setVideoUrl(data.video_url);
      } else {
        alert("Error generating video");
      }
    } catch (error) {
      console.error("Error:", error);

      // ✅ Handle 403 error redirect
      if (error.response && error.response.status === 403 && error.response.data.redirect) {
        navigate(error.response.data.redirect);
      } else {
        alert("Failed to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Text-to-Video Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {videoUrl && (
        <div>
          <h3>Generated Video:</h3>
          <video controls width="500">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default VideoG;
