import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const envConfig = createEnv({
    server: {
        GENERATE_SOURCEMAP: z.coerce.boolean().default(false),
    },
    client: {
        NEXT_PUBLIC_LIVEKIT_TOKEN_ENDPOINT: z.string().min(1),
        NEXT_PUBLIC_WEBSOCKET_URL: z.string().min(1),
        NEXT_PUBLIC_API_URL: z.string().min(1),
        NEXT_PUBLIC_URL: z.string().min(1),
        NEXT_PUBLIC_SPEECH_KEY: z.string().min(1),
        NEXT_PUBLIC_SPEECH_REGION: z.string().min(1),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_LIVEKIT_TOKEN_ENDPOINT: process.env.NEXT_PUBLIC_LIVEKIT_TOKEN_ENDPOINT,
        NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
        NEXT_PUBLIC_SPEECH_KEY: process.env.NEXT_PUBLIC_SPEECH_KEY,
        NEXT_PUBLIC_SPEECH_REGION: process.env.NEXT_PUBLIC_SPEECH_REGION,
    },
});

export default envConfig;