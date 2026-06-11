import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    navigate("/dashboard");
  }, [navigate]);

  return <div>Home Page</div>;
}
