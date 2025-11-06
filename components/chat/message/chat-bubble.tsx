import React from "react";

import { CopyCheck, CopyIcon } from "lucide-react";

import { formatChatTimestamp } from "@/helper/date-time";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { TooltipInput } from "../input/tooltip";


interface ChatBubbleProps {
  content: string;
  sender: "user" | "bot";
  timestamp: string | Date;
}

const ChatBubble = ({ content, sender, timestamp }: ChatBubbleProps) => {
  const { copiedKey, copy } = useCopyToClipboard();
  const formattedTime = formatChatTimestamp(timestamp);
  return (
    <div
      className={cn(
        "group flex w-full",
        sender === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          sender === "user" ? "items-end" : "items-start"
        )}
      >
        <section
          className={cn(
            `max-w-full rounded-tl-3xl rounded-tr-3xl p-4 wrap-break-word`,
            {
              "dark:bg-foreground text-background self-end rounded-bl-3xl bg-[#303030]":
                sender === "user",
              "dark:bg-secondary self-start rounded-br-3xl bg-slate-100 text-black dark:text-white":
                sender === "bot",
            }
          )}
        >
          <MarkdownRenderer content={content} />
        </section>

        <section
          className={cn(
            "flex items-center gap-2",
            sender === "user" ? "flex" : "flex-row-reverse"
          )}
        >
          <span className="text-muted-foreground text-xs">{formattedTime}</span>
          <TooltipInput
            tooltipText={copiedKey ? "Copied!" : "Copy"}
            variant="ghost"
            onClick={() => copy(content)}
          >
            {copiedKey ? <CopyCheck size={18} /> : <CopyIcon size={18} />}
          </TooltipInput>
        </section>
      </div>
    </div>
  );
};

export default ChatBubble;
