import { AnimatePresence, motion } from "motion/react"
import GlowingLinear from '../ui/glowing-circle'
import { Button } from '../ui/button'
import { MicIcon, MicOffIcon, XIcon } from 'lucide-react'
import { useVoiceModalStore } from "@/store/companion"
import { useTheme } from "next-themes"
const VoiceModal = () => {
    const { theme } = useTheme();
    const { voiceModalOpen, isRecording, setIsRecording, setVoiceModalOpen } = useVoiceModalStore();
   
    return (
        <AnimatePresence>

            {voiceModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute size-full inset-0 bg-secondary flex items-center justify-center flex-col gap-5">

                    <section className="flex-1 flex items-center">
                        <GlowingLinear />
                    </section>

                    <div className='flex gap-5 py-5'>
                        <Button size={"icon-lg"} variant={isRecording ? "destructive" : theme === "dark" ? "outline" : "default"} className='rounded-full cursor-pointer size-14' onClick={() => setIsRecording(!isRecording)}>
                            {isRecording ? <MicOffIcon size={40} /> : <MicIcon size={40} />}
                        </Button>

                        <Button size={"icon-lg"} variant={theme === "dark" ? "outline" : "default"} className='rounded-full cursor-pointer size-14' onClick={() => setVoiceModalOpen(false)}>
                            <XIcon size={18} />
                        </Button>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default VoiceModal