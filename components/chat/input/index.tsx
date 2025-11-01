import { cn } from '@/lib/utils'
import { AudioLinesIcon, MicIcon, PlusIcon } from 'lucide-react'
import { TooltipInput } from './tooltip'

import FileInput from './file'
import EditorInput from './editor'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const formSchema = z.object({
    text: z.string().min(1, "Message is required"),
})

const ChatInput = ({ className }: { className?: string }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: '',
        },
    })


    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        form.reset()
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='group/composer w-full' >
                <FileInput />
                <div className={cn(`bg-slate-100 cursor-text overflow-clip bg-clip-padding p-2.5 contain-inline-size dark:bg-[#303030] grid grid-cols-[auto_1fr_auto] [grid-template-areas:'header_header_header'_'leading_primary_trailing'_'._footer_.'] group-data-expanded/composer:[grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing'] shadow-short transform-3d origin-[50%_50%] rounded-3xl`, className)}>

                    <EditorInput />

                    <div className='[grid-area:leading] origin-[50%_50%]  transform-none'>
                        <TooltipInput tooltipText="Add more options" variant={"ghost"}>
                            <PlusIcon size={18} />
                        </TooltipInput>
                    </div>

                    <div className='flex items-center gap-2 [grid-area:trailing] transform-none origin-[50%_50%]'>
                        <div className='ms-auto flex items-center gap-1.5'>
                            <TooltipInput tooltipText="Add more options" variant={"ghost"}>
                                <MicIcon size={18} />
                            </TooltipInput>

                            <div className='min-w-9'>
                                <TooltipInput tooltipText="Add more options">
                                    <AudioLinesIcon size={18} />
                                </TooltipInput>
                            </div>
                        </div>
                    </div>


                </div>
            </form>
        </FormProvider>
    )
}

export default ChatInput

