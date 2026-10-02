import { generateQuiz } from "./ollama.js";
import { getTranscript } from "./transcript.js";
import { saveQuiz, getQuizzesIndex, getQuizById } from "./quizManager.js";

export const handleGenerateQuiz = async (c) => {
  try {
    const body = await c.req.json();
    const { videoUrl, numQuestions = 10 } = body;

    if (!videoUrl) {
      return c.json({ error: "videoUrl is required" }, 400);
    }

    console.log(`Generating quiz for ${videoUrl} with ${numQuestions} questions...`);
    
    const transcript = await getTranscript(videoUrl);
    const quizJson = await generateQuiz(transcript.toString(), numQuestions);
    const savedQuiz = await saveQuiz(quizJson, videoUrl);

    return c.json(savedQuiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return c.json({ error: error.message }, 500);
  }
};

export const handleGetQuizzes = async (c) => {
  try {
    const quizzes = await getQuizzesIndex();
    return c.json(quizzes);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
};

export const handleGetQuizById = async (c) => {
  try {
    const id = c.req.param("id");
    const quiz = await getQuizById(id);
    if (!quiz) {
      return c.json({ error: "Quiz not found" }, 404);
    }
    return c.json(quiz);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
};
