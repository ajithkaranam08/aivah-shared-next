import { useEffect } from "react";
import { useParams } from "next/navigation";

import ChatInput from "./input";
import ChatBubble from "./chat-bubble";
import ChatInitWithCredit from "./chatInit-with-credit";

import { useConversationMutation, useGetChatsMutation } from "@/services/conversation/mutation";
import { useValidateUUID } from "@/services/validate/query";
import { useAudioTrack } from "@/services/conversation/query";
import { useLivekitStore } from "@/store/livekit";
import useConversationStore from "@/store/conversation";

import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import GenerateChat from "./generate-chat";

const Chat = () => {
    // ---------- 1️⃣ URL Params & Store State ----------
    const { embedId } = useParams();
    const { connect, room, disconnect } = useLivekitStore();
    const { messages, loadingType } = useConversationStore();

    // ---------- 2️⃣ API Hooks ----------
    const { data: sessionData } = useValidateUUID(String(embedId));
    const { mutate: initConversation, isSuccess } = useConversationMutation();
    const { mutate: getChats } = useGetChatsMutation();

    // ---------- 3️⃣ Side-effect Hooks ----------
    // Start audio stream
    useAudioTrack(room);

    // Initialize conversation + LiveKit connection
    useEffect(() => {
        initConversation(undefined, {
            onSuccess: () => {
                if (sessionData) connect(sessionData);
            },
        });
        return () => disconnect();
    }, [sessionData, initConversation, connect, disconnect]);

    // Fetch previous chat messages after successful init
    useEffect(() => {
        if (isSuccess) {
            const conversationId = Number(SESSION_CONVERSATION_ID.get());
            if (conversationId) getChats({ conversationId, page: "1", limit: "20" });
        }
    }, [isSuccess, getChats]);



    // ---------- 4️⃣ Render ----------
    return (
        <div className="flex flex-col h-full p-5">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {loadingType === "INIT" ? (
                    <ChatInitWithCredit room={room} />
                ) : (
                    messages.map((msg) => (
                        <ChatBubble key={String(msg.id)} {...msg} />
                    ))
                )}
                <GenerateChat room={room} />
            </div>
            <ChatInput />
        </div>
    );
};

export default Chat;
