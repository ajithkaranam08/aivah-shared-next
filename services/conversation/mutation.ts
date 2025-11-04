import { useMutation } from "@tanstack/react-query";
import conversationAPi, { ConversationApiProps } from "./api";
import { ipAddress } from "@/lib/utils";
import { v4 as uuidV4 } from "uuid";
import { SESSION_CONVERSATION_ID, SESSION_ID } from "@/helper/storage";
import { useCompanionStore } from "@/store/companion";
import { ChatMessage, ChatRequest } from "@/types/chat";
import { ApiResponseWithChat } from "@/types/response";
import useConversationStore from "@/store/conversation";
import { Room } from "livekit-client";

type Conversation = {
  conversationId: number;
  message: string;
  userSessionId: number;
};

export const useConversationMutation = () => {
  const { setConfigureConversation } = useCompanionStore();
  return useMutation<Conversation, Error>({
    mutationFn: async () => {
      const conversationId = SESSION_CONVERSATION_ID.get();
      const sessionId = SESSION_ID.get();

      if (!conversationId || !sessionId) {
        const getIp = await ipAddress();
        const uuid = uuidV4();
        const response = await conversationAPi.create({
          deliveryType: "companion",
          ipAddress: getIp,
          sessionId: uuid,
        });
        setConfigureConversation(response.conversationId);
        return response;
      } else {
        setConfigureConversation(Number(conversationId));
        return {
          conversationId: Number(conversationId),
          message: "fallback",
          userSessionId: Number(sessionId),
        };
      }
    },
    onSuccess: (data) => {
      if (data && data.conversationId) {
        SESSION_CONVERSATION_ID.set(String(data.conversationId));
        SESSION_ID.set(String(data.userSessionId));
      }
    },
  });
};

export const useSyncChatMutation = () => {
  return useMutation<unknown, Error, ConversationApiProps["syncChat"]>({
    mutationFn: async (body) => {
      return await conversationAPi.syncChat(body);
    },
  });
};

export const useGetChatsMutation = () => {
  const { setMessages } = useConversationStore();
  return useMutation<ApiResponseWithChat, Error, number>({
    mutationFn: async (conversationId) => {
      return await conversationAPi.getChats(conversationId);
    },
    onSuccess: (values) => {
      const messages: ChatMessage[] = values.chats.map((msg) => ({
        id: String(msg.chatId),
        sender: "bot",
        content: msg.chat,
        timestamp: new Date(msg.dateTime),
      }));
      setMessages(messages);
    },
  });
};

export const useCreateChatMutation = (room: Room | null) => {
  const { setMessages } = useConversationStore();
  return useMutation<unknown, Error, ChatMessage>({
    mutationFn: async (body) => {
      if (room) {
        room?.localParticipant.sendText(body.content, {
          topic: "lk.chat",
        });
      }
      return true;
    },
    onSuccess: (_, values) => {
      console.log({ values, room });
      if (room) {
        setMessages(values);
      }
    },
  });
};
