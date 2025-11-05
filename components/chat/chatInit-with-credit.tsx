import React from 'react'
import useConversationStore from '@/store/conversation'
import { LoaderFive } from "@/components/ui/loader"
import { useChatInitListener } from '@/services/conversation/query';
import { Room } from 'livekit-client';

const ChatInitWithCredit = ({ room }: { room: Room | null }) => {
    const { greeting } = useConversationStore()
    useChatInitListener(room);
    return greeting.message ?
        <div className='flex-1 flex justify-center items-center h-full'>
            <LoaderFive text={greeting.message} />
        </div>
        : null;
}

export default ChatInitWithCredit
