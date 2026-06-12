// Auth
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AuthLayout from "@/layouts/AuthLayout";

// User
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import TrelloBoard from "@/pages/Boards/BoardContent/TrelloBoard";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, layout: AuthLayout },
  { path: "/register", component: Register, layout: AuthLayout },
  { path: "/dashboard", component: Dashboard },
  { path: "/:boardDetail", component: TrelloBoard },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
