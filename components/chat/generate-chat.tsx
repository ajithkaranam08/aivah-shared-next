import useConversationStore from '@/store/conversation'
import { useChatTranscription } from '@/services/conversation/query';
import { Room } from 'livekit-client';

const GenerateGreedingText = ({ room }: { room: Room | null }) => {
    const { transcription } = useConversationStore();

    useChatTranscription(room);

    console.log({ transcription })

    return null
}

export default GenerateGreedingText
