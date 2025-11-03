import React from 'react'
import useConversationStore from '@/store/conversation'
import { LoaderFive } from "@/components/ui/loader"

const GreedingChat = () => {
    const { greeding } = useConversationStore()
    return <LoaderFive text={greeding.message} />;
}

export default GreedingChat