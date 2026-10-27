import { z } from 'zod';

// Helper to compute age from birthdate (YYYY-MM-DD)
export function calculateAge(birthDateStr: string): number {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const SignupSchema = z
  .object({
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z
      .string()
      .regex(/^(\+91)?[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    displayName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(40, 'Name must be 40 characters or less'),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be formatted as YYYY-MM-DD')
      .refine(
        (dateStr) => {
          const age = calculateAge(dateStr);
          return age >= 18;
        },
        { message: 'You must be at least 18 years old to join PairUp AI' }
      ),
    acceptedTerms: z
      .boolean()
      .refine((val) => val === true, 'You must accept the Terms and Privacy Policy')
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or mobile number is required to sign up',
    path: ['email']
  });

export const LoginSchema = z.object({
  identifier: z.string().min(3, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required')
});

export const VerifyOtpSchema = z.object({
  identifier: z.string().min(3, 'Identifier is required'),
  otp: z.string().length(6, 'Verification code must be 6 digits')
});

export const RequestOtpSchema = z.object({
  identifier: z.string().min(3, 'Email or phone number is required')
});

export const PasswordResetSchema = z.object({
  token: z.string().min(10, 'Invalid reset token'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
