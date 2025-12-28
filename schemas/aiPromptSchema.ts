import { z } from "zod";

export const aiPromptSchema = z.object({
  prompt: z
    .string()
    .min(3, "Prompt is too short")
    .max(60, "Prompt is too long")
    .regex(
      /^[a-zA-Z0-9 ,.'-]+$/,
      "Prompt contains invalid characters"
    ),
});
