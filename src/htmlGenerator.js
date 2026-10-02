export const generateQuizHTML = (quizJson, videoUrl) => {
  const { title, questions } = quizJson;

  let questionsHTML = "";
  questions.forEach((q, index) => {
    let optionsHTML = "";
    q.options.forEach((opt, optIndex) => {
      optionsHTML += `
        <div class="option">
          <input type="radio" id="q${index}_opt${optIndex}" name="q${index}" value="${optIndex}">
          <label for="q${index}_opt${optIndex}">${opt}</label>
        </div>
      `;
    });

    // YouTube timestamp link
    // Extract video ID from URL
    let videoId = "";
    try {
      const urlObj = new URL(videoUrl);
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v");
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      }
    } catch (e) {
      // Ignore
    }

    const timestampLink = videoId
      ? `<a href="https://youtu.be/${videoId}?t=${
        Math.floor(q.timestamp)
      }" target="_blank">Watch relevant part</a>`
      : "";

    questionsHTML += `
      <div class="question-card" id="q${index}-card">
        <h3>${index + 1}. ${q.question}</h3>
        ${optionsHTML}
        <div class="feedback" id="feedback-${index}" style="display: none;">
          <p class="explanation"><strong>Explanation:</strong> ${q.explanation}</p>
          <p class="timestamp">${timestampLink}</p>
        </div>
        <input type="hidden" id="correct-${index}" value="${q.correctAnswer}">
      </div>
    `;
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - AI Learning Studio</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    .question-card { background: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ddd; }
    .option { margin-bottom: 10px; }
    button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
    button:hover { background: #0056b3; }
    .feedback { margin-top: 15px; padding: 10px; border-radius: 5px; background: #e9ecef; }
    .correct-bg { background: #d4edda !important; border-color: #c3e6cb !important; }
    .incorrect-bg { background: #f8d7da !important; border-color: #f5c6cb !important; }
    #results { margin-top: 20px; font-size: 1.2em; font-weight: bold; display: none; }
    .back-link { display: inline-block; padding: 8px 15px; background-color: #e9ecef; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .back-link:hover { background-color: #dee2e6; text-decoration: none; }
  </style>
</head>
<body>
  <div style="margin-bottom: 20px;">
    <a href="./index.html" class="back-link">← Back to Quizzes</a>
  </div>
  <h1>${title}</h1>
  <form id="quiz-form">
    ${questionsHTML}
    <button type="button" onclick="submitQuiz()">Submit Quiz</button>
  </form>
  <div id="results"></div>

  <script>
    function submitQuiz() {
      let score = 0;
      const total = ${questions.length};

      for (let i = 0; i < total; i++) {
        const selected = document.querySelector(\`input[name="q\${i}"]:checked\`);
        const correct = document.getElementById(\`correct-\${i}\`).value;
        const feedback = document.getElementById(\`feedback-\${i}\`);
        const card = document.getElementById(\`q\${i}-card\`);

        feedback.style.display = "block";

        if (selected && selected.value === correct) {
          score++;
          card.classList.add("correct-bg");
        } else {
          card.classList.add("incorrect-bg");
        }
        
        // Disable inputs after submit
        const inputs = document.querySelectorAll(\`input[name="q\${i}"]\`);
        inputs.forEach(input => input.disabled = true);
      }

      const resultsDiv = document.getElementById("results");
      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = \`You scored \${score} out of \${total} (\${((score/total)*100).toFixed(0)}%)\`;
    }
  </script>
</body>
</html>
  `;
  return html;
};
