import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const API_URL = "http://localhost:8000/api";

function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!videoUrl) return;

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, numQuestions }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }
      
      navigate(`/quiz/${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">AI Learning Studio</h1>
        <p className="home-subtitle">Transform any YouTube video into an interactive quiz instantly.</p>
      </div>
      
      <div className="home-content-centered">
        <div className="card generator-card">
          <h2 className="section-title">Generate a New Quiz</h2>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>YouTube Video URL</label>
              <input 
                type="text" 
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Questions</label>
              <input 
                type="number" 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(parseInt(e.target.value))} 
                min="1" 
                max="20"
              />
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Analyzing Video & Generating Quiz..." : "Generate Quiz"}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="library-link-container">
          <Link 
            to="/quizzes" 
            className="secondary-btn"
            style={loading ? { pointerEvents: "none", opacity: 0.5 } : {}}
          >
            View Previous Quizzes →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
