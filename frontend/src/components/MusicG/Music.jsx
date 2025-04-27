import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Add this
import axios from 'axios';
import './Music.css';

const MusicGeneration = () => {
  const [prompt, setPrompt] = useState('lofi hip hop');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ⬅️ Setup navigation

  const generateMusic = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("User not logged in!");
      return;
    }

    setLoading(true);
    setAudioUrl(null);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/gen-music", {
        prompt,
        email: user.email
      });

      const data = response.data;

      // ✅ Handle backend redirect
      if (data.redirect) {
        navigate(data.redirect);
        return;
      }

      if (data.audio_url) {
        setAudioUrl(data.audio_url);
      } else {
        setError('Error generating music. Please try again.');
      }
    } catch (err) {
      console.error(err);

      // ✅ Handle 403 error redirect
      if (err.response && err.response.status === 403 && err.response.data.redirect) {
        navigate(err.response.data.redirect);
      } else {
        setError('Failed to communicate with the backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Generate Music</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter music prompt"
        className="input-box"
      />

      <button onClick={generateMusic} className="generate-btn" disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <p className="error-message">{error}</p>}

      <div className="music-player">
        {audioUrl ? (
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          !loading && <p>No music generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default MusicGeneration;
