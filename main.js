import { generateQuiz } from "./src/ollama.js";
import { getTranscript } from "./src/transcript.js";
import { getUserInput } from "./src/userInput.js";
import { saveQuiz } from "./src/quizManager.js";

const main = async () => {
  try {
    const url = getUserInput("Please give the video url :- ");
    console.log("Retrieving transcript...");
    const transcript = await getTranscript(url);
    console.log("Transcript retrieved...");
    console.log("Sending transcription to model...");
    const quizJson = await generateQuiz(transcript.toString());
    console.log("Quiz generated successfully!");
    
    console.log("Saving quiz to HTML...");
    const filePath = await saveQuiz(quizJson, url);
    console.log(`Quiz saved to ${filePath}`);
    console.log("You can view all your quizzes at ./quizzes/index.html");
  } catch (error) {
    console.log(error.message);
  }
};

main();
