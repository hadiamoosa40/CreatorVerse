import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Add this!
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ⬅️ Setup navigation

  const generateImage = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
    if (!user || !user.email) {
      alert("User not logged in!");
      return;
    }

    setLoading(true);
    setImageUrl('');
    try {
      const response = await axios.post('http://localhost:5000/generate-image', { 
        prompt,
        email: user.email 
      });

      // ✅ Handle backend redirect
      if (response.data.redirect) {
        navigate(response.data.redirect);
        return;
      }

      setImageUrl(response.data.image_url);
    } catch (error) {
      console.error('Error generating image:', error);

      // ✅ Handle 403 error redirect
      if (error.response && error.response.status === 403 && error.response.data.redirect) {
        navigate(error.response.data.redirect);
      } else {
        alert('Failed to generate image.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Image Generation</h1>
      <p>Turn your prompt into an image.</p>

      <div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          style={{ padding: '10px', width: '300px' }}
        />
        <button onClick={generateImage} style={{ marginLeft: '10px', padding: '10px 20px' }}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div style={{ marginTop: '30px', minHeight: '400px' }}>
        {loading && <p>Loading...</p>}
        {imageUrl && <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', height: 'auto' }} />}
        {!loading && !imageUrl && <p>No images generated.</p>}
      </div>
    </div>
  );
}

export default App;
