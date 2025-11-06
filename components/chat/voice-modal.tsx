import { AnimatePresence, motion } from "motion/react"
import GlowingCircle from '../ui/glowing-circle'
import { Button } from '../ui/button'
import { MicIcon, MicOffIcon, XIcon } from 'lucide-react'
import { useVoiceModalStore } from "@/store/companion"
const VoiceModal = () => {
    const { voiceModalOpen, isRecording, setIsRecording, setVoiceModalOpen } = useVoiceModalStore()
    return (
        <AnimatePresence>

            {voiceModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute size-full inset-0 bg-secondary flex items-center justify-center flex-col gap-5">

                    <GlowingCircle />

                    <div className='flex gap-5'>
                        <Button size={"icon-lg"} variant={isRecording ? "destructive" : "outline"} className='rounded-full cursor-pointer' onClick={() => setIsRecording(!isRecording)}>
                            {isRecording ? <MicOffIcon size={18} /> : <MicIcon size={18} />}
                        </Button>

                        <Button size={"icon-lg"} variant={"outline"} className='rounded-full cursor-pointer' onClick={() => setVoiceModalOpen(false)}>
                            <XIcon size={18} />
                        </Button>


                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default VoiceModal