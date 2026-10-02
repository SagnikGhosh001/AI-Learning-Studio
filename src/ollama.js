import ollama from "ollama";

const quizSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
            minItems: 4,
            maxItems: 4,
          },
          correctAnswer: {
            type: "integer",
            minimum: 0,
            maximum: 3,
          },
          explanation: { type: "string" },
          timestamp: {
            type: "number",
            minimum: 0,
          },
        },
        required: [
          "question",
          "options",
          "correctAnswer",
          "explanation",
          "timestamp",
        ],
      },
    },
  },
  required: ["title", "questions"],
};

export const generateQuiz = async (transcript) => {
  const response = await ollama.chat({
    model: "gemma4:latest",
    format: quizSchema,
    messages: [
      {
        role: "system",
        content: `
          You are an educational quiz generator.

          Generate exactly 10 multiple-choice questions based only
          on the provided video transcript.

          Rules:
          - Each question must have exactly four options.
          - correctAnswer must be a zero-based index (0-3).
          - Avoid duplicate questions.
          - Do not invent facts absent from the transcript.
          - Each question must be answerable from the transcript.
          - timestamp must be the actual start time in seconds
            of the transcript segment supporting the answer.
          - Do not estimate or invent timestamps.
          - Include an explanation grounded in the transcript.
          - Return only the JSON object.
        `,
      },
      {
        role: "user",
        content: `Generate a quiz from this transcript:\n\n${transcript}`,
      },
    ],
  });

  const quiz = JSON.parse(response.message.content);

  if (quiz.questions.length !== 10) {
    throw new Error(
      `Expected 10 questions, received ${quiz.questions.length}`,
    );
  }

  return quiz;
};
