import { cn } from '@/lib/utils';
import React from 'react'
import { TooltipInput } from './input/tooltip';
import { CopyCheck, CopyIcon } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-clipboard';
import { formatChatTimestamp } from '@/helper/date-time';

interface ChatBubbleProps {
    content: string;
    sender: 'user' | 'bot';
    timestamp: string | Date;
}

const ChatBubble = ({ content, sender, timestamp }: ChatBubbleProps) => {
    const { copiedKey, copy } = useCopyToClipboard();
    const formattedTime = formatChatTimestamp(timestamp);
    return (
        <div className={cn('flex w-full group', sender === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[80%] flex flex-col gap-1', sender === 'user' ? 'items-end' : 'items-start')}>
                <section className={cn(`p-4 rounded-tl-3xl  rounded-tr-3xl`, {
                    'bg-[#303030] dark:bg-foreground text-background self-end rounded-bl-3xl': sender === 'user',
                    'bg-slate-100 text-black dark:bg-secondary dark:text-white self-start rounded-br-3xl': sender === 'bot',
                })}>
                    {content}
                </section>

                <section className={cn('flex gap-2 items-center', sender === 'user' ? 'flex' : 'flex-row-reverse')}>
                    <span className="text-xs text-muted-foreground">{formattedTime}</span>
                    <TooltipInput tooltipText={copiedKey ? "Copied!" : "Copy"} variant="ghost" onClick={() => copy(content)}>
                        {copiedKey ? <CopyCheck size={18} /> : <CopyIcon size={18} />}
                    </TooltipInput>
                </section>

            </div>

        </div>
    )
}

export default ChatBubble