import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import "./QuizLibrary.css";

const API_URL = "http://localhost:8000/api";

function QuizLibrary() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${API_URL}/quizzes`);
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      } else {
        throw new Error("Failed to fetch quizzes");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="library-container">
      <div className="library-header-container">
        <IconButton 
          onClick={() => navigate("/")} 
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.7)', 
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': { backgroundColor: 'white' },
            mr: 3 
          }}
          aria-label="back to home"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: '1.2rem', color: 'var(--text-main)' }} />
        </IconButton>
        
        <div className="library-header-text">
          <h1 className="library-title">Your Quizzes</h1>
          <p className="library-subtitle">Review and retake your previously generated quizzes</p>
        </div>
      </div>

      {loading ? (
        <p style={{textAlign: "center", fontWeight: "600"}}>Loading quizzes...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="library-content">
          {quizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes generated yet. Go back and generate your first one!</p>
            </div>
          ) : (
            <ul className="quiz-grid">
              {quizzes.map((q) => (
                <li key={q.id}>
                  <Link to={`/quiz/${q.id}`} className="quiz-card-link">
                    <h3>{q.title}</h3>
                  </Link>
                  <span className="date">Generated on {new Date(q.timestamp).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizLibrary;
