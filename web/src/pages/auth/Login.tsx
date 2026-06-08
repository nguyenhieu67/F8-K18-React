import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthI } from "@/utils/type";
import { fetchApi } from "@/utils/api";
import { loginSchema, validationForm } from "@/utils/validate";
import { EyeCloseIcon, EyeIcon } from "@/components/Icons";

export default function Login() {
  const formData = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState<AuthI>(formData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationForm(loginSchema, form, setErrors)) return;

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
    <div className="bg-trello-bg flex h-screen flex-col items-center justify-center">
      <h1 className="text-trello-heading-text mb-10 text-3xl">Login Trello</h1>
      <form
        className="rounded-xl bg-white p-7.5 shadow-md"
        onSubmit={handleLogin}
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label
            className="text-trello-label-text text-sm font-bold"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            className={`rounded-md border px-2 py-1 outline-none ${errors.email ? "border-red-500" : ""}`}
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
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <label
            className="text-trello-label-text text-sm font-bold"
            htmlFor="password"
          >
            Password:
          </label>
          <div
            className={`flex items-center justify-between rounded-md border px-2 py-1 ${errors.password ? "border-red-500" : ""}`}
          >
            <input
              className="mr-2 w-full outline-none"
              type={showPassword ? "text" : "password"}
              autoComplete="password"
              placeholder="Nhập password bất kỳ..."
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password}</span>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="mr-10 min-w-30 cursor-pointer rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-400"
            onClick={() => navigate("/register")}
          >
            Đăng kí
          </button>
          <button
            className="min-w-30 cursor-pointer rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-400"
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
