import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(30, { message: "First name must be at most 30 characters." })
    .regex(/^[A-Za-z\s'-]+$/, {
      message: "First name contains invalid characters.",
    }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(30, { message: "Last name must be at most 30 characters." })
    .regex(/^[A-Za-z\s'-]+$/, {
      message: "Last name contains invalid characters.",
    }),
  phoneNumber: z
    .string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be at most 15 digits." })
    .regex(/^\+?\d{10,15}$/, {
      message: "Phone number must be valid and contain only digits.",
    }),
  password: z.string().min(8),
});

export type userFormData = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  phoneNumber: RegisterSchema.shape.phoneNumber,
  password: RegisterSchema.shape.password,
});

export type loginFormData = z.infer<typeof LoginSchema>;
