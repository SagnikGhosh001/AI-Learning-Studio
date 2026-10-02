import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QuizLibrary from "./pages/QuizLibrary";
import Quiz from "./Quiz";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizzes" element={<QuizLibrary />} />
          <Route path="/quiz/:id" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
