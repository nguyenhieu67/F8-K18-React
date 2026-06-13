// Auth
import AuthLayout from "@/layouts/AuthLayout";

// User
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import TrelloBoard from "@/pages/Boards/BoardContent/TrelloBoard";
import Invite from "@/pages/Invite";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, layout: AuthLayout },
  { path: "/register", component: Register, layout: AuthLayout },
  { path: "/dashboard", component: Dashboard },
  { path: "/invite/:boardId/:inviteToken", component: Invite },
  { path: "/:boardDetail", component: TrelloBoard },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
