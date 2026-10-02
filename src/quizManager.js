import { generateQuizHTML } from "./htmlGenerator.js";

const QUIZZES_DIR = "./quizzes";
const INDEX_FILE = "./quizzes/index.html";

export const saveQuiz = async (quizJson, videoUrl) => {
  // Ensure quizzes directory exists
  try {
    await Deno.mkdir(QUIZZES_DIR, { recursive: true });
  } catch (err) {
    if (!(err instanceof Deno.errors.AlreadyExists)) {
      throw err;
    }
  }

  const timestamp = new Date().getTime();
  const filename = `quiz_${timestamp}.html`;
  const filePath = `${QUIZZES_DIR}/${filename}`;

  const htmlContent = generateQuizHTML(quizJson, videoUrl);
  await Deno.writeTextFile(filePath, htmlContent);

  await updateIndex(quizJson.title, filename);

  return filePath;
};

const updateIndex = async (title, filename) => {
  let indexContent = "";
  try {
    indexContent = await Deno.readTextFile(INDEX_FILE);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Index doesn't exist, create initial boilerplate
      indexContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Index - AI Learning Studio</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    ul { list-style-type: none; padding: 0; }
    li { background: #f4f4f4; margin: 10px 0; padding: 15px; border-radius: 5px; }
    a { text-decoration: none; color: #007bff; font-weight: bold; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Your Quizzes</h1>
  <ul id="quiz-list">
  </ul>
</body>
</html>
      `;
    } else {
      throw err;
    }
  }

  // Insert the new quiz link into the list
  const listItem = `<li><a href="./${filename}">${title}</a> - Generated on ${
    new Date().toLocaleString()
  }</li>`;

  if (indexContent.includes('<ul id="quiz-list">')) {
    indexContent = indexContent.replace(
      '<ul id="quiz-list">',
      `<ul id="quiz-list">\n    ${listItem}`,
    );
  }

  await Deno.writeTextFile(INDEX_FILE, indexContent);
};
