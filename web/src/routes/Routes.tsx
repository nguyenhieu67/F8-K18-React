import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
