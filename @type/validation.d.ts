interface VoiceSetup {
    voiceEnv: string
    voiceId: number;
    voiceSetup: string;
    voiceType: string;
}

export interface ChatbotDetails {
    details: {
        uuid: string;
        customerId: number;
        chatbotId: number;
        llmModelId: number;
        avatarId: number;
        avatarUrl: string;
        avatarType: string;
        llmModel: string;
        chatType: string;
        isTalkToLlm: boolean;
        knowledgebaseType: string;
        token: string;
        voiceId: string;
        voiceSetup: VoiceSetup;
    }
}