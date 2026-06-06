// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// User
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
