import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.literal(true, { errorMap: () => ({ message: 'You must agree to our privacy policy' }) }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const assessmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  consent: z.literal(true, { errorMap: () => ({ message: 'You must agree to our privacy policy' }) }),
  answers: z.record(z.string(), z.number().min(1).max(4)),
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;
