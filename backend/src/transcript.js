import { fetchTranscript } from "youtube-transcript";

const formatTranscript = (transcript) => {
  return transcript
    .map((segment, index) => {
      return [
        `Segment: ${index + 1}`,
        `Text: ${segment.text}`,
        `Start time: ${(segment.offset / 1000).toFixed(3)} seconds`,
        `Duration: ${(segment.duration / 1000).toFixed(3)} seconds`,
        `Language: ${segment.lang}`,
      ].join("\n");
    })
    .join("\n\n");
};

export const getTranscript = async (url) => {
  let transcript;
  try {
    // Try to get the English transcript explicitly first
    transcript = await fetchTranscript(url, { lang: "en" });
  } catch (err) {
    // If English is not available, fallback to the default/auto-generated one
    transcript = await fetchTranscript(url);
  }
  return formatTranscript(transcript);
};
