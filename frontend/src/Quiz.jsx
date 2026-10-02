import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const API_URL = "http://localhost:8000/api";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API_URL}/quizzes/${id}`);
        if (!res.ok) throw new Error("Quiz not found");
        const data = await res.json();
        setQuizData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let currentScore = 0;
    quizData.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  const getYouTubeTimestampLink = (videoUrl, timestamp) => {
    try {
      const urlObj = new URL(videoUrl);
      let videoId = "";
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v");
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      }
      return videoId ? `https://youtu.be/${videoId}?t=${Math.floor(timestamp)}` : null;
    } catch {
      return null;
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!quizData) return null;

  return (
    <div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", minHeight: "48px" }}>
        <IconButton 
          onClick={() => navigate("/quizzes")} 
          sx={{ 
            position: "absolute",
            left: 0,
            backgroundColor: 'rgba(255,255,255,0.7)', 
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': { backgroundColor: 'white' }
          }}
          aria-label="back to library"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: '1.2rem', color: 'var(--text-main)' }} />
        </IconButton>
        <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", padding: "0 60px" }}>
          {quizData.title}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        {quizData.questions.map((q, index) => {
          const isCorrect = answers[index] === q.correctAnswer;
          const showFeedback = submitted;
          let cardClass = "question-card";
          if (showFeedback) {
            cardClass += isCorrect ? " correct-bg" : " incorrect-bg";
          }

          const timestampLink = getYouTubeTimestampLink(quizData.videoUrl, q.timestamp);

          return (
            <div key={index} className={cardClass}>
              <h3>{index + 1}. {q.question}</h3>
              <div className="options">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="option">
                    <label>
                      <input 
                        type="radio" 
                        name={`q-${index}`} 
                        value={optIndex}
                        checked={answers[index] === optIndex}
                        onChange={() => handleOptionChange(index, optIndex)}
                        disabled={submitted}
                      />
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
              
              {showFeedback && (
                <div className="feedback">
                  <p><strong>Explanation:</strong> {q.explanation}</p>
                  {timestampLink && (
                    <p><a href={timestampLink} target="_blank" rel="noreferrer">Watch relevant part</a></p>
                  )}
                  {!isCorrect && (
                    <p className="correction">Correct Answer: {q.options[q.correctAnswer]}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {!submitted && (
          <button type="submit" className="primary-btn" disabled={Object.keys(answers).length !== quizData.questions.length}>
            Submit Quiz
          </button>
        )}
      </form>

      {submitted && (
        <div className="results">
          <h2>You scored {score} out of {quizData.questions.length} ({Math.round((score / quizData.questions.length) * 100)}%)</h2>
        </div>
      )}
    </div>
  );
}

export default Quiz;
