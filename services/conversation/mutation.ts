import { useMutation } from "@tanstack/react-query"
import conversationAPi, { ConversationApiProps } from "./api"
import { ipAddress } from "@/lib/utils";
import { v4 as uuidV4 } from "uuid"
import { SESSION_CONVERSATION_ID, SESSION_ID } from "@/helper/storage";
import { useCompanionStore } from "@/store/companion";


type Conversation = {
    conversationId: number;
    message: string;
    userSessionId: number
} | null

export const useConversationMutation = () => {
    const {setConfigureConversation} = useCompanionStore();
    return useMutation<Conversation, Error>({
        mutationFn: async () => {
            const conversationId = SESSION_CONVERSATION_ID.get();
            if (!conversationId) {
                const getIp = await ipAddress();
                const uuid = uuidV4();
                const response = await conversationAPi.create({
                    deliveryType: "companion",
                    ipAddress: getIp,
                    sessionId: uuid
                });
                setConfigureConversation(response.conversationId);
                return response;
            } else {
                setConfigureConversation(Number(conversationId));
                return null;
                
            }
        },

        onSuccess: (data) => {
            if(data && data.conversationId) {
                SESSION_CONVERSATION_ID.set(String(data.conversationId));
                SESSION_ID.set(String(data.userSessionId));
            }
        }
    })
}