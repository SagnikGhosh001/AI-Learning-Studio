import { createApp } from "./src/createApp.js";

const app = createApp();

console.log("Starting server on http://localhost:8000");
Deno.serve({ port: 8000 }, app.fetch);
