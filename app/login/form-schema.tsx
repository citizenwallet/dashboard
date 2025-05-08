import * as z from 'zod';

export const emailFormSchema = z.object({
  email: z
    .string({
      required_error: 'Enter email address'
    })
    .min(1, {
      message: 'Enter email address'
    })
    .email({
      message: 'Invalid email address'
    }),
  type: z.enum(["email"]),
});

export const otpFormSchema = z.object({
  code: z
    .string({
      required_error: 'Enter one-time password'
    })
    .min(6, {
      message: 'Your one-time password must be 6 characters.'
    })
});
