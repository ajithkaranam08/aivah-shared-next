import { useEffect, useEffectEvent, useRef } from 'react'
import ChatBubble from './bubble'
import ChatInput from './input'
import { useConversationMutation } from '@/services/conversation/mutation'
import { useLivekitStore } from '@/store/livekit'
import { useValidateUUID } from '@/services/validate/query'
import { useParams } from 'next/navigation'
import { useLiveKitChatGreeting } from '@/services/conversation/query'
const Chat = () => {
    const { connect , room} = useLivekitStore();
    useLiveKitChatGreeting(room)

    const { embedId } = useParams();
    const { data } = useValidateUUID(String(embedId))
    const { mutate } = useConversationMutation();

    const onMutate = useEffectEvent(() => {
        return {
            mutate,
            connect
        }
    })

    useEffect(() => {
        onMutate().mutate()
    }, [])

    const audioPlaybackRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        onMutate().connect(data)
    }, [data])

    return (
        <div className='flex p-5 flex-col h-full justify-end gap-2'>

            <ChatBubble timestamp={new Date()} message="Hello! How can I assist you today? asdsafsfs aefsdfgsdfafa faw fasf afadafa adafadfsad faf af" sender="bot" />
            <ChatBubble timestamp={new Date()} message="Hello! How can asdsfsefa f afaedfsdf sedgfesdgsdg sdgsdg sgag sdgs gsg sgsgsgs gsgsdgsdg sgsdgs dgdssgsg" sender="user" />
            <ChatInput />
            {/* hidden audio element mount point */}
            <div ref={audioPlaybackRef} className="hidden" />
        </div>
    )
}

export default Chat