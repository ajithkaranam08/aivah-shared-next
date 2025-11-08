import * as z from "zod";

export const chatFormSchema = z.object({
  text: z.string().min(1, "Message is required"),
  fileUrl: z.string().optional(),
  file: z.instanceof(File).optional(),
});

export type ChatFormType = z.infer<typeof chatFormSchema>;
