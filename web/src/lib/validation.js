import * as z from "zod";

const money = z.coerce.number({ error: "Enter a number" }).min(0, { error: "Can't be negative" }).max(1e10);
const count = z.coerce.number({ error: "Enter a whole number" }).int({ error: "Use a whole number" }).min(0, { error: "Can't be negative" }).max(1e7);
const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? new Date(v) : null))
  .refine((d) => d === null || !Number.isNaN(d.getTime()), { error: "Pick a valid date" });

export const passwordSchema = z.string().min(8, { error: "Use at least 8 characters" }).regex(/[0-9]/, { error: "Include at least one number" });

export const signupSchema = z.object({
  workspace: z.string().trim().min(1, { error: "Name your business or store" }).max(80),
  name: z.string().trim().min(1, { error: "Enter your name" }).max(80),
  email: z.email({ error: "Enter a valid email" }).trim().toLowerCase(),
  password: passwordSchema,
  sample: z.coerce.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email" }).trim().toLowerCase(),
  password: z.string().min(1, { error: "Enter your password" }),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, { error: "Give the product a name" }).max(120),
  sku: z.string().trim().max(40).optional(),
  category: z.string().trim().max(40).optional(),
  price: money,
  cost: money.optional().default(0),
  stock: count,
  reorderLevel: count.default(5),
  expiryDate: optionalDate,
  description: z.string().trim().max(1000).optional().default(""),
});

export const movementSchema = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i),
  type: z.enum(["sale", "restock", "writeoff"]),
  quantity: z.coerce.number({ error: "Enter a quantity" }).int({ error: "Use a whole number" }).min(1, { error: "At least 1" }).max(1e6),
  unitPrice: money.optional(),
  note: z.string().trim().max(200).optional().default(""),
});

export const memberSchema = z.object({
  name: z.string().trim().min(1, { error: "Enter their name" }).max(80),
  email: z.email({ error: "Enter a valid email" }).trim().toLowerCase(),
  password: passwordSchema,
  role: z.enum(["admin", "staff"]),
});

export const workspaceSchema = z.object({
  name: z.string().trim().min(1, { error: "Name your workspace" }).max(80),
  currency: z.enum(["NGN", "USD", "GBP", "EUR", "KES", "GHS", "ZAR"]),
});

// { field: "first error message" } for forms
export function fieldErrors(error) {
  const flat = z.flattenError(error).fieldErrors;
  return Object.fromEntries(Object.entries(flat).map(([k, v]) => [k, v?.[0]]));
}

// Form fields without Next's internal "$ACTION_…" entries, safe to echo back
export function formValues(formData) {
  return Object.fromEntries([...formData.entries()].filter(([key]) => !key.startsWith("$")));
}
