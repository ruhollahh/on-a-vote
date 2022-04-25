import { z } from "zod";

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(600),
  options: z
    .array(z.object({ body: z.string().min(1).max(50) }))
    .min(2)
    .max(32),
});

export type CreateQuestion = z.infer<typeof createQuestionValidator>;
