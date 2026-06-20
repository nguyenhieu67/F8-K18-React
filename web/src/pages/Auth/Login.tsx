import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { AuthI } from "@/utils/type";
import { fetchApi } from "@/utils/api";
import { loginSchema, validationForm } from "@/utils/validate";
import {
  ExclamationTriangleIcon,
  EyeCloseIcon,
  EyeIcon,
} from "@/components/Icons";

interface LoginResponse {
  _id: string;
  email: string;
  username: string;
  theme: ["light" | "dark"];
  createdAt: number;
  accessToken: string;
  refreshToken: string;
}

export default function Login() {
  const formData = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState<AuthI>(formData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hasEdited, setHasEdited] = useState<boolean>(false);
  const navigate = useNavigate();
  const isSubmitting = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (isCorrect) {
      setHasEdited(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationForm(loginSchema, form, setErrors)) return;
    if (isSubmitting.current) return;

    isSubmitting.current = true;
    setHasEdited(false);
    try {
      const response = await fetchApi.post<LoginResponse>("/users/login", {
        ...form,
      });

      const user = {
        id: response._id,
        email: response.email,
        name: response.username,
      };

      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("refresh_token", response.refreshToken);
      localStorage.setItem("current_user", JSON.stringify(user));

      toast.success("Chúc mừng bạn đăng nhập thành công");

      const redirect = localStorage.getItem("redirect_after_login");
      if (redirect) {
        localStorage.removeItem("redirect_after_login");
        navigate(redirect);
      } else {
        navigate("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 404) {
        // Email không tồn tại hoặc sai password BE trả 404 cho cả 2 case
        setIsCorrect(true);
      } else {
        console.error("Lỗi:", error);
        toast.error("Không thể kết nối đến server!");
      }
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <div className="bg-trello-bg flex h-screen flex-col items-center justify-center">
      <h1 className="text-trello-heading-text mb-10 text-3xl">Login Trello</h1>

      <div
        className={`opacity-0 transition-opacity duration-200 ${isCorrect ? "opacity-100" : ""}`}
      ></div>

      <form
        className="w-md rounded-xl bg-white p-8 shadow-md"
        onSubmit={handleLogin}
        noValidate
      >
        {isCorrect && (
          <div
            className={`mb-4 flex items-center rounded-md px-3 py-1 text-[#e96354] transition-opacity duration-200 ${hasEdited ? "bg-red-100 opacity-60" : "bg-red-200"}`}
          >
            <ExclamationTriangleIcon fillColor="#e74d3c" />
            <p className="ml-2 text-sm">
              Nhập sai email hoặc mật khẩu. Xin vui lòng thử lại.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label
            className="text-trello-label-text text-sm font-bold"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            className={`rounded-md border px-2 py-1 outline-none ${errors.email || isCorrect ? "border-red-500" : ""}`}
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
            className={`flex items-center justify-between rounded-md border px-2 py-1 ${errors.password || isCorrect ? "border-red-500" : ""}`}
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
            className={`min-w-30 rounded-lg p-2 text-white ${isCorrect && !hasEdited ? "cursor-not-allowed bg-gray-400" : "cursor-pointer bg-blue-500 hover:bg-blue-400"}`}
            type="submit"
            disabled={isCorrect && !hasEdited}
          >
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
}
