import React, { useEffect } from 'react'
import ChatBubble from './bubble'
import ChatInput from './input'
import { useConversationMutation } from '@/services/conversation/mutation'
interface ChatProps {
    chatBotId: number
}

const Chat = ({ chatBotId }: ChatProps) => {

    const { mutate } = useConversationMutation();

    useEffect(() => {
        mutate()
    }, [])

    return (
        <div className='flex p-5 flex-col h-full justify-end gap-2'>
            <ChatBubble timestamp={new Date()} message="Hello! How can I assist you today? asdsafsfs aefsdfgsdfafa faw fasf afadafa adafadfsad faf af" sender="bot" />
            <ChatBubble timestamp={new Date()} message="Hello! How can asdsfsefa f afaedfsdf sedgfesdgsdg sdgsdg sgag sdgs gsg sgsgsgs gsgsdgsdg sgsdgs dgdssgsg" sender="user" />
            <ChatInput />
        </div>
    )
}

export default Chat