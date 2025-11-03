import React from 'react'
import useConversationStore from '@/store/conversation'
import { LoaderFive } from "@/components/ui/loader"
import { useChatInitListener } from '@/services/conversation/query';
import { Room } from 'livekit-client';

const ChatInitWithCredit = ({ room }: { room: Room | null }) => {
    useChatInitListener(room);
    const { greeding } = useConversationStore()
    return <LoaderFive text={greeding.message} />;
}

export default ChatInitWithCredit
