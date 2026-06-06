import * as z from "zod";

const emailRule = z
  .string()
  .min(1, "Vui lòng nhập email.")
  .pipe(z.string().email("Email không đúng định dạng."));

const passwordRule = z
  .string()
  .min(1, "Vui lòng nhập mật khẩu.")
  .pipe(
    z
      .string()
      .min(8, "Mật khẩu phải từ 8 ký tự.")
      .regex(/[a-zA-Z]/, "Phải chứa ít nhất 1 chữ cái.")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 con số."),
  );

export const loginSchema = z.object({
  email: emailRule,
  password: passwordRule,
});

export const registerSchema = loginSchema
  .extend({
    userName: z
      .string()
      .min(1, "Vui lòng nhập tên.")
      .pipe(z.string().min(5, "Tên phải có ít nhất 5 ký tự")),
    confirmPassword: z.string().min(1, "Vui lòng nhập xác nhận mật khẩu."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validationForm = (schema: any, formData: any, setErrors: any) => {
  const result = schema.safeParse(formData);

  if (result.success) {
    setErrors({});
    return true;
  }

  const newErrors: Record<string, string> = {};
  result.error.issues.forEach((issue: { path: string[]; message: string }) => {
    const fieldName = issue.path[0] as string;
    if (!newErrors[fieldName]) {
      newErrors[fieldName] = issue.message;
    }
  });

  setErrors(newErrors);
  return false;
};
