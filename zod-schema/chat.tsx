import * as z from "zod";

export const chatFormSchema = z.object({
  text: z.string().min(1, "Message is required"),
  file: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

export type ChatFormType = z.infer<typeof chatFormSchema>;
