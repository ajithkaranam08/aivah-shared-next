import { useEffect } from "react";
import ChatInput from "./input";
import { useConversationMutation, useGetChatsMutation } from "@/services/conversation/mutation";
import { useLivekitStore } from "@/store/livekit";
import { useValidateUUID } from "@/services/validate/query";
import { useParams } from "next/navigation";
import ChatInitWithCredit from "./chatInit-with-credit";
import GenerateGreedingText from "./generate-chat";
import { useAudioTrack } from "@/services/conversation/query";
import useConversationStore from "@/store/conversation";
import ChatBubble from "./chat-bubble";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";

const Chat = () => {
    const { connect, room, disconnect } = useLivekitStore();
    const { embedId } = useParams();
    const { data } = useValidateUUID(String(embedId));
    const { mutate, isSuccess } = useConversationMutation();
    const { messages, loadingType } = useConversationStore();
    const { mutate: getChats } = useGetChatsMutation();
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
        if (isSuccess) {
            getChats(Number(SESSION_CONVERSATION_ID.get()));
        }
    }, [getChats, isSuccess])

    useEffect(() => {
        if (!room || room.state !== "connected") return
        const startAudioSafely = async () => {
            await room.startAudio()
        }
        startAudioSafely()
    }, [room])

    console.log({ loadingType })
    return (
        <div className="flex p-5 flex-col h-full">

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {loadingType === "INIT" ?
                    <ChatInitWithCredit room={room} /> :
                    loadingType === "GREEDING" ?
                        <GenerateGreedingText room={room} /> :
                        messages.map(msg => (
                            <ChatBubble key={String(msg.id)} {...msg} />
                        ))
                }
            </div>
            <ChatInput />
        </div>
    );
};

export default Chat;
