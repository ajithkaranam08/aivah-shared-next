import * as z from 'zod'

export const chatFormSchema = z.object({
    text: z.string().min(1, "Message is required"),
});

export type ChatFormType = z.infer<typeof chatFormSchema>;
