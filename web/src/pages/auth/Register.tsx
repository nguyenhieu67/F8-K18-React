import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "@/utils/api";
import { registerSchema, validationForm } from "@/utils/validate";
import { EyeCloseIcon, EyeIcon } from "@/components/Icons";

export default function Register() {
  const formData = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [form, setForm] = useState(formData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationForm(registerSchema, form, setErrors)) return;

    setLoading(true);

    try {
      const payload = {
        name: form.userName,
        email: form.email,
        password: form.password,
        avatar: "",
        theme: "light",
        createdAt: new Date().toISOString(),
      };

      await fetchApi.post("/users", payload);

      setForm(formData);
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-trello-bg flex h-screen flex-col items-center justify-center">
      <h1 className="text-trello-heading-text mb-10 text-3xl">Register</h1>
      <form
        className="flex min-w-75 flex-col gap-4 rounded-xl bg-white p-7.5 shadow-md"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Tên tài khoản */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="user-name"
            className="text-trello-label-text text-sm font-bold"
          >
            Tên tài khoản:
          </label>
          <input
            className={`rounded-md border px-2 py-1 outline-none ${errors.userName ? "border-red-500" : ""}`}
            placeholder="Nhập tên tài khoản..."
            id="user-name"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            autoFocus
            required
          />
          {errors.userName && (
            <span className="text-xs text-red-500">{errors.userName}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-trello-label-text text-sm font-bold"
          >
            Email:
          </label>
          <input
            className={`rounded-md border px-2 py-1 outline-none ${errors.email ? "border-red-500" : ""}`}
            type="email"
            autoComplete="email"
            placeholder="Nhập email..."
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-trello-label-text text-sm font-bold"
          >
            Mật khẩu:
          </label>
          <div
            className={`flex items-center justify-between rounded-md border px-2 py-1 ${errors.password ? "border-red-500" : ""}`}
          >
            <input
              className="mr-2 w-full outline-none"
              type={showPassword ? "text" : "password"}
              autoComplete="password"
              placeholder="Nhập mật khẩu..."
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

        {/* Confirm password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirm-password"
            className="text-trello-label-text text-sm font-bold"
          >
            Xác nhận mật khẩu:
          </label>
          <div
            className={`flex items-center justify-between rounded-md border px-2 py-1 ${errors.confirmPassword ? "border-red-500" : ""}`}
          >
            <input
              className="mr-2 w-full outline-none"
              type={showConfirm ? "text" : "password"}
              autoComplete="confirm-password"
              placeholder="Nhập lại mật khẩu..."
              id="confirm-password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                setShowConfirm(!showConfirm);
              }}
            >
              {showConfirm ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">
              {errors.confirmPassword}
            </span>
          )}
        </div>
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            className="mr-10 min-w-30 cursor-pointer rounded-md bg-cyan-500 p-2 text-white hover:bg-cyan-400"
            onClick={() => navigate("/login")}
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="min-w-30 cursor-pointer rounded-md bg-blue-500 p-2 text-white hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Đang đăng kí..." : "Đăng kí"}
          </button>
        </div>
      </form>
    </div>
  );
}
