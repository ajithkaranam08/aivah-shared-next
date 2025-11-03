import React from 'react'
import useConversationStore from '@/store/conversation'
import { LoaderFive } from "@/components/ui/loader"
import { useChatInitListener } from '@/services/conversation/query';
import { Room } from 'livekit-client';

const ChatInitWithCredit = ({ room }: { room: Room | null }) => {
    const { greeding } = useConversationStore()
    useChatInitListener(room);
    return greeding.message ? <LoaderFive text={greeding.message} /> : null;
}

export default ChatInitWithCredit
