let apiRoot = "";

if (import.meta.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:3001";
}

if (import.meta.env.BUILD_MODE === "production") {
  apiRoot =
    import.meta.env.VITE_API_URL || "https://trello-clone-api.onrender.com/v1";
}

export const API_ROOT = apiRoot;
