import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  handleGenerateQuiz,
  handleGetQuizzes,
  handleGetQuizById,
} from "./handlers.js";

export const createApp = () => {
  const app = new Hono();

  app.use("/*", cors());

  app.post("/api/generate", handleGenerateQuiz);
  app.get("/api/quizzes", handleGetQuizzes);
  app.get("/api/quizzes/:id", handleGetQuizById);

  return app;
};
