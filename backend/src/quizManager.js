const QUIZZES_DIR = "./quizzes";
const INDEX_FILE = "./quizzes/index.json";

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
  const id = `quiz_${timestamp}`;
  const filename = `${id}.json`;
  const filePath = `${QUIZZES_DIR}/${filename}`;

  const quizData = {
    id,
    videoUrl,
    timestamp,
    ...quizJson
  };

  await Deno.writeTextFile(filePath, JSON.stringify(quizData, null, 2));
  await updateIndex(id, quizJson.title, videoUrl, timestamp);

  return quizData;
};

export const getQuizzesIndex = async () => {
  try {
    const indexContent = await Deno.readTextFile(INDEX_FILE);
    return JSON.parse(indexContent);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return [];
    }
    throw err;
  }
};

export const getQuizById = async (id) => {
  const filePath = `${QUIZZES_DIR}/${id}.json`;
  try {
    const content = await Deno.readTextFile(filePath);
    return JSON.parse(content);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return null;
    }
    throw err;
  }
};

const updateIndex = async (id, title, videoUrl, timestamp) => {
  let indexData = [];
  try {
    const indexContent = await Deno.readTextFile(INDEX_FILE);
    indexData = JSON.parse(indexContent);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }

  indexData.unshift({
    id,
    title,
    videoUrl,
    timestamp,
  });

  await Deno.writeTextFile(INDEX_FILE, JSON.stringify(indexData, null, 2));
};
