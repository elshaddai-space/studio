
import { z } from 'zod';

export const businessTypes = ["Sole Proprietorship", "LLP", "Pvt Ltd", "Partnership"] as const;

export const BusinessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name cannot be empty."),
  businessType: z.enum(businessTypes, {
    errorMap: () => ({ message: `Invalid business type. Please choose from: ${businessTypes.join(', ')}.` })
  }),
  contactPerson: z.string().min(1, "Contact person name cannot be empty."),
  gstin: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format. It should be like 22AAAAA0000A1Z5.")
    .optional()
    .or(z.literal(''))
    .transform(value => value === '' ? undefined : value), 
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid phone number. Must be in +91XXXXXXXXXX format (e.g., +919876543210)."),
  email: z.string()
    .email("Invalid email address.")
    .optional()
    .or(z.literal(''))
    .transform(value => value === '' ? undefined : value), 
});

export type BusinessDetails = z.infer<typeof BusinessDetailsSchema>;


// Auth Schemas
export const SignupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
