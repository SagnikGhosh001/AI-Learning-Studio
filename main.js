import { getTranscript } from "./src/transcript.js";
import { getUserInput } from "./src/userInput.js";

const main = async () => {
  try {
    const url = getUserInput("Please give the video url :- ");
    const transcript = await getTranscript(url);
    console.log(transcript);
  } catch (error) {
    console.log(error.message);
  }
};

main();
