import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import type { AuthI } from "../utils/type";

export default function Login() {
  const formData = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState<AuthI>(formData);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allUsers = (await fetchApi.get("/users")) as any[];

      const matchedUser = allUsers.find(
        (u) => u.email === form.email && u.password === form.password,
      );

      if (matchedUser) {
        const responseMock = {
          accessToken:
            "access_token_mock_" + Math.random().toString(36).substring(2),
          refreshToken:
            "refresh_token_mock_" + Math.random().toString(36).substring(2),
          user: {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
          },
        };

        localStorage.setItem("access_token", responseMock.accessToken);
        localStorage.setItem("refresh_token", responseMock.refreshToken);
        localStorage.setItem("current_user", JSON.stringify(responseMock.user));

        navigate("/dashboard");
      } else {
        alert("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến json-server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="mb-5 text-3xl">Login Trello</h2>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-1.25">
          <label className="text-sm text-gray-600" htmlFor="email">
            Email:
          </label>
          <input
            className="rounded-lg border p-2"
            type="email"
            autoComplete="email"
            placeholder="Nhập email bất kỳ..."
            id="email"
            name="email"
            value={form.email}
            autoFocus
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 flex flex-col gap-1.25">
          <label className="text-sm text-gray-600" htmlFor="password">
            Password:
          </label>
          <input
            className="rounded-lg border p-2"
            type="password"
            autoComplete="password"
            placeholder="Nhập password bất kỳ..."
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="cursor-pointer rounded-lg bg-blue-400 px-5 py-2 text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Đang kết nối..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
}
