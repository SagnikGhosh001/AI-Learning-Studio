# Full-Stack Transition Plan: AI Learning Studio

To move from static HTML generation to a dynamic React frontend and Deno backend, we'll split the project into two distinct parts.

## 1. Backend: Deno API (using Hono)

Instead of running a CLI script, the Deno application will become an HTTP server using the Hono framework that exposes REST APIs.

### Proposed Endpoints
*   **`POST /api/generate`**
    *   **Payload:** `{ "videoUrl": "...", "numQuestions": 10 }`
    *   **Action:** Fetches the YouTube transcript, prompts Ollama (dynamically adjusting the prompt based on `numQuestions`), saves the resulting JSON to a `quizzes/` directory (e.g., `quiz_123456.json`), and returns the quiz data.
*   **`GET /api/quizzes`**
    *   **Action:** Reads the `quizzes/` directory and returns a list of all available quizzes (metadata like title, ID, and creation date).
*   **`GET /api/quizzes/:id`**
    *   **Action:** Returns the specific JSON file for a requested quiz.

### Technical Stack
*   **Deno + Hono:** We will use Hono for easy routing and built-in CORS handling.
*   **Storage:** We will continue saving files locally, but save them as `.json` files instead of `.html` in the `quizzes/` folder.

## 2. Frontend: React Application

We will initialize a modern React application (using Vite) to handle the UI and user interactions.

### Proposed Views / Components
*   **Home Page (`/`)**
    *   **Generator Form:** An input field for the YouTube URL, a number input for the desired number of questions, and a "Generate" button.
    *   **Loading State:** A spinner or progress indicator while waiting for the Deno backend and Ollama to finish processing.
    *   **Quiz Library:** A list/grid of previously generated quizzes fetched from `GET /api/quizzes`. Clicking one navigates to the quiz page.
*   **Quiz Page (`/quiz/:id`)**
    *   Fetches the quiz JSON from the backend.
    *   Renders the questions, options, and "Submit" button dynamically based on the JSON.
    *   Handles the logic for grading, showing explanations, and displaying YouTube timestamp links.
    *   Includes a "Back to Home" button.

### Technical Stack
*   **React + Vite:** Fast, modern frontend tooling.
*   **Styling:** We can use standard CSS or a library of your choice (e.g., Tailwind CSS).
*   **Routing:** `react-router-dom` to handle navigation between the Home page and individual Quiz pages.

---

## Execution Steps

1.  **Refactor Backend:** 
    *   Update `deno.json` to include Hono.
    *   Rewrite `main.js` to start a Hono server instead of a CLI script.
    *   Update `ollama.js` to accept a dynamic `numQuestions` variable.
    *   Modify `quizManager.js` to save `.json` files instead of `.html` and remove the `htmlGenerator.js`.
2.  **Initialize Frontend:** Create the React app in a `frontend/` folder using Vite.
3.  **Build Frontend - API Integration:** Create API service functions in React to communicate with our Deno endpoints.
4.  **Build Frontend - Home Page:** Build the URL/Question form and the quiz listing page.
5.  **Build Frontend - Quiz Page:** Recreate the interactive quiz UI in React and test the end-to-end flow.
