import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { PlusIcon, MicIcon, AudioLinesIcon } from 'lucide-react';
import { chatFormSchema, ChatFormType } from '@/zod-schema/chat';
import FileInput from './file';
import EditorInput from './editor';
import { TooltipInput } from './tooltip';
import { ChatInputExpandTypes } from '@/types/chat';

const ChatInput = () => {
    const containerRef = useRef<HTMLFormElement>(null);

    const form = useForm<ChatFormType>({
        resolver: zodResolver(chatFormSchema),
        defaultValues: { text: '' },
    });

    const handleExpand = (expanded: ChatInputExpandTypes) => {
        const container = containerRef.current;
        if (!container) return;
        switch (expanded) {
            case ChatInputExpandTypes.MULTI_LINE:
                container.dataset.expanded = 'true';
                break;
            case ChatInputExpandTypes.SINGLE_LINE:
                const expandedDiv = container.querySelector('#chat-expanded') as HTMLElement;
                if ((expandedDiv && expandedDiv.clientHeight > 56)) {
                    container.dataset.expanded = 'true';
                } else {
                    container.removeAttribute('data-expanded');
                }
                break;
            case ChatInputExpandTypes.TEXT_EMPTY:
                container.removeAttribute('data-expanded');
                break;
        }
    };

    return (
        <FormProvider {...form}>
            <form ref={containerRef} className="group/composer w-full">
                <FileInput />

                <div
                    id="chat-expanded"
                    className={cn(
                        `bg-slate-100 dark:bg-[#303030] cursor-text p-2.5 grid grid-cols-[auto_1fr_auto]
             [grid-template-areas:'header_header_header'_'leading_primary_trailing'_'._footer_.']
             group-data-expanded/composer:[grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing']
             rounded-3xl shadow-lg transition-all`
                    )}
                >
                    <EditorInput onExpand={handleExpand} />

                    <div className='[grid-area:leading] origin-[50%_50%]  transform-none'>
                        <TooltipInput tooltipText="Add more options" variant={"ghost"}>
                            <PlusIcon size={18} />
                        </TooltipInput>
                    </div>

                    <div className="[grid-area:trailing] flex items-center gap-2">
                        <TooltipInput tooltipText="Voice input" variant="ghost">
                            <MicIcon size={18} />
                        </TooltipInput>
                        <TooltipInput tooltipText="Audio options" >
                            <AudioLinesIcon size={18} />
                        </TooltipInput>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default ChatInput;
