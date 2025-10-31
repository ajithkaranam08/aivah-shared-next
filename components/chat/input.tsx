import { cn } from '@/lib/utils'
import { AudioLinesIcon, MicIcon, PlusIcon } from 'lucide-react'

const InputChat = ({ className }: { className?: string }) => {

    return (
        <div className={cn(`grid col-span-4 w-full min-h-12 max-h-max  bg-secondary px-5 my-2 items-center rounded-3xl`, className)}>

            <IconHover>
                <PlusIcon size={18} />
            </IconHover>
            <textarea id='chat-textarea' placeholder='Ask anything' className=' h-7 resize-none focus:outline-none' />
            <IconHover>
                <MicIcon size={18} />
            </IconHover>

            <IconHover active>
                <AudioLinesIcon size={18} />
            </IconHover>


        </div>
    )
}

export default InputChat


const IconHover = ({ children, active }: { children: React.ReactNode, active?: boolean }) => {
    return (
        <span className={cn(`size-9 rounded-full p-2 cursor-pointer flex items-center justify-center transition-all duration-200`, active ? 'bg-background/80 dark:bg-background/80' : 'hover:bg-background/80 hover:dark:bg-background/80')}>
            {children}
        </span>
    )
}