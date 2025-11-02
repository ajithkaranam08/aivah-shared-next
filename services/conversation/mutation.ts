import { useMutation } from "@tanstack/react-query"
import conversationAPi, { ConversationApiProps } from "./api"
import { ipAddress } from "@/lib/utils";
import { v4 as uuidV4 } from "uuid"
import { SESSION_CONVERSATION_ID } from "@/helper/storage";


type Conversation = {
    conversationId: number;
    message: string;
    userSessionId: number
} 

export const useConversationMutation = () => {
    return useMutation<Conversation, Error>({
        mutationFn: async () => {
            const conversationId = SESSION_CONVERSATION_ID.get();
            if (!conversationId) {
                const getIp = await ipAddress();
                const uuid = uuidV4();
                return await conversationAPi.create({
                    deliveryType: "companion",
                    ipAddress: getIp,
                    sessionId: uuid
                })
            } else {
                return {}
            }
        },

        onSuccess: (data) => {
            if(data.conversationId) {

            }
        }
    })
}