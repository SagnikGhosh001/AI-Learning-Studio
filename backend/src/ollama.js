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

export const generateQuiz = async (transcript, numQuestions = 10) => {
  let allQuestions = [];
  let quizTitle = "Generated Quiz";

  const currentMessages = [
    {
      role: "system",
      content: `
        You are an educational quiz generator.

        Generate exactly ${numQuestions} multiple-choice questions based only
        on the provided video transcript.

        Rules:
        - All text (including title, questions, options, and explanations) MUST be in English. Do not use any other language.
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
  ];

  let remainingQuestions = numQuestions;

  // We can loop a few times to try and get the full amount
  for (let i = 0; i < 3; i++) {
    console.log(`Requesting ${remainingQuestions} questions from Ollama...`);

    // We update the system prompt dynamically if we're doing a follow-up
    if (i > 0) {
      currentMessages[0].content = `
        You are an educational quiz generator.
        You already generated ${allQuestions.length} questions.
        Generate exactly ${remainingQuestions} more multiple-choice questions based only on the provided video transcript.
        Make sure they are NEW questions, different from what you already generated.
        
        Rules:
        - All text MUST be in English. Do not use Arabic or any other language.
        - Each question must have exactly four options.
        - correctAnswer must be a zero-based index (0-3).
        - Avoid duplicate questions.
        - Do not invent facts absent from the transcript.
        - Each question must be answerable from the transcript.
        - timestamp must be the actual start time in seconds of the transcript segment supporting the answer.
        - Return only the JSON object.
      `;
    }

    const response = await ollama.chat({
      model: "gemma4:latest",
      format: quizSchema,
      messages: currentMessages,
    });

    const quiz = JSON.parse(response.message.content);

    if (i === 0 && quiz.title) {
      quizTitle = quiz.title;
    }

    if (quiz.questions && quiz.questions.length > 0) {
      allQuestions = [...allQuestions, ...quiz.questions];
    }

    remainingQuestions = numQuestions - allQuestions.length;

    if (remainingQuestions <= 0) {
      // If we got too many, just truncate
      allQuestions = allQuestions.slice(0, numQuestions);
      break;
    }

    console.log(
      `Got ${quiz.questions.length} questions. Still need ${remainingQuestions}.`,
    );

    // Add the AI's response and our follow-up to the chat history
    currentMessages.push({
      role: "assistant",
      content: response.message.content,
    });

    currentMessages.push({
      role: "user",
      content:
        `This is the transcript you used. You generated ${allQuestions.length} questions so far. Please add ${remainingQuestions} more new questions. Return a JSON object with the new questions array under "questions".`,
    });
  }

  if (allQuestions.length === 0) {
    throw new Error("Failed to generate any questions.");
  }

  return {
    title: quizTitle,
    questions: allQuestions,
  };
};
