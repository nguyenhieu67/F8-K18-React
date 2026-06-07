// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// User
// import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Board from "../pages/Board";

const publicRoutes = [
  // { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/board", component: Board },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
