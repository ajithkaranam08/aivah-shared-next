import React from "react";

import { CopyCheck, CopyIcon, DownloadIcon, EyeIcon } from "lucide-react";

import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { formatChatTimestamp } from "@/helper/date-time";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { cn, downloadFile, openUrlInNewTab } from "@/lib/utils";

import { TooltipInput } from "../input/tooltip";
import { ChatMessage } from "@/types/chat";
import Image from "next/image";
import { Button } from "@/components/ui/button";



const ChatBubble = ({ content, sender, timestamp , image_url, video_url, chatId}: ChatMessage) => {
  const { copiedKey, copy } = useCopyToClipboard();
  const formattedTime = formatChatTimestamp(timestamp);


  return (
    <div
      className={cn(
        "group bubble-last-before-child flex w-full",
        sender === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          sender === "user" ? "items-end" : "items-start"
        )}
      >
        {image_url &&
          <section className="rounded-lg group/image relative overflow-hidden max-w-max bg-red-400">
            <Image src={image_url} alt={`generate-image-${chatId}`} width={200} height={200} />
            <div className="absolute  top-0 right-0 size-full flex-center gap-2 bg-black/25 opacity-0 group-hover/image:opacity-100 transition-opacity">
              <Button size={"icon-sm"} variant={"ghost"} className="cursor-pointer text-white" onClick={() => openUrlInNewTab(image_url)}>
                <EyeIcon size={18}  />
              </Button>
              <Button size={"icon-sm"} variant={"ghost"} className="cursor-pointer text-white" onClick={() => downloadFile(image_url, `image-${chatId}.png`)}>
                <DownloadIcon size={18} />
              </Button>
            </div>
          </section>
        }

        {video_url &&
          <section className="rounded-lg group/video relative overflow-hidden max-w-max bg-red-400">
            <video src={video_url} width={200} height={200} />
            <div className="absolute top-0 right-0 size-full flex-center gap-2 bg-black/25 opacity-0 group-hover/video:opacity-100 transition-opacity">
              <Button size={"icon-sm"} variant={"ghost"} className="cursor-pointer text-white" onClick={() => openUrlInNewTab(video_url)}>
                <EyeIcon size={18} />
              </Button>
              <Button size={"icon-sm"} variant={"ghost"} className="cursor-pointer text-white" onClick={() => downloadFile(video_url, `video-${chatId}.mp4`)}>
                <DownloadIcon size={18} />
              </Button>
            </div>
          </section>
        }
            

        {content && 
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
        }

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
