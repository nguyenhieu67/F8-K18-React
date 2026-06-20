let apiRoot = "";

if (import.meta.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:5001";
}

if (import.meta.env.BUILD_MODE === "production") {
  apiRoot = "https://trello-clone-web-coral.vercel.app";
}

export const API_ROOT = apiRoot;
