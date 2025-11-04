import { useRef, useEffect } from "react";
import ChatInput from "./input";
import { useConversationMutation } from "@/services/conversation/mutation";
import { useLivekitStore } from "@/store/livekit";
import { useValidateUUID } from "@/services/validate/query";
import { useParams } from "next/navigation";
import ChatInitWithCredit from "./chatInit-with-credit";
import GenerateChat from "./generate-chat";
import { useAudioTrack } from "@/services/conversation/query";
import useConversationStore from "@/store/conversation";
import ChatBubble from "./chat-bubble";

const Chat = () => {
    const { connect, room, disconnect } = useLivekitStore();
    const { embedId } = useParams();
    const { data } = useValidateUUID(String(embedId));
    const { mutate } = useConversationMutation();
    const { messages } = useConversationStore();

    useAudioTrack(room);

    useEffect(() => {
        mutate(undefined, {
            onSuccess: () => {
                if (data) connect(data);
            }
        });
        return () => disconnect();
    }, [data]);

    useEffect(() => {
        if (!room || room.state !== "connected") return
        const startAudioSafely = async () => {
            await room.startAudio()
        }
        startAudioSafely()
    }, [room])


    return (
        <div className="flex p-5 flex-col h-full justify-end gap-2">
            <ChatInitWithCredit room={room} />
            <GenerateChat room={room} />
            {messages.map(((msg) => (
                <ChatBubble key={String(msg.timestamp)} {...msg} />
            )))}
            <ChatInput />
        </div>
    );
};

export default Chat;
