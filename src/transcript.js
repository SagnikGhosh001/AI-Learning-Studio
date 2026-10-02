import { fetchTranscript } from "youtube-transcript";

export const getTranscript = async (url) => {
  const transcript = await fetchTranscript(url);
  return transcript;
};
