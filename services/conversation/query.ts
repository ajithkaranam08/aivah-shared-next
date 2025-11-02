import { SESSION_CONVERSATION_ID } from '@/helper/storage'
import { useConversationMutation } from './mutation'

export const conversationKeys = {
    create: (id: string) => ['conversation', id] as const,
}

export const useConversation = async () => {
    const { mutate } = useConversationMutation();
    const conversationId = SESSION_CONVERSATION_ID.get();

}


