import React from "react";

import { CopyCheck, CopyIcon, DownloadIcon, EyeIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { formatChatTimestamp } from "@/helper/date-time";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { cn, downloadFile, openUrlInNewTab } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";

import { TooltipInput } from "../input/tooltip";

const ChatBubble = ({
  content,
  sender,
  timestamp,
  image_url,
  video_url,
  chatId,
}: ChatMessage) => {
  const { copiedKey, copy } = useCopyToClipboard();
  const formattedTime = formatChatTimestamp(timestamp);

  const renderContent = () => {
    if (image_url) {
      return (
        <section className="group/image relative mb-4 max-w-max overflow-hidden rounded-lg">
          <Image
            src={image_url}
            alt={`generate-image-${chatId}`}
            width={200}
            height={200}
          />
          <div className="flex-center absolute top-0 right-0 size-full gap-2 bg-black/25 opacity-0 transition-opacity group-hover/image:opacity-100">
            <Button
              size={"icon-sm"}
              variant={"ghost"}
              className="cursor-pointer text-white"
              onClick={() => openUrlInNewTab(image_url)}
            >
              <EyeIcon size={18} />
            </Button>
            <Button
              size={"icon-sm"}
              variant={"ghost"}
              className="cursor-pointer text-white"
              onClick={() => downloadFile(image_url, `image-${chatId}.png`)}
            >
              <DownloadIcon size={18} />
            </Button>
          </div>
        </section>
      );
    }

    if (video_url) {
      return (
        <section className="group/video relative mb-4 max-w-max overflow-hidden rounded-lg">
          <video src={video_url} width={200} height={200} />
          <div className="flex-center absolute top-0 right-0 size-full gap-2 bg-black/25 opacity-0 transition-opacity group-hover/video:opacity-100">
            <Button
              size={"icon-sm"}
              variant={"ghost"}
              className="cursor-pointer text-white"
              onClick={() => openUrlInNewTab(video_url)}
            >
              <EyeIcon size={18} />
            </Button>
            <Button
              size={"icon-sm"}
              variant={"ghost"}
              className="cursor-pointer text-white"
              onClick={() => downloadFile(video_url, `video-${chatId}.mp4`)}
            >
              <DownloadIcon size={18} />
            </Button>
          </div>
        </section>
      );
    }
    if (content) {
      return (
        <>
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
            <span className="text-muted-foreground text-xs">
              {formattedTime}
            </span>
            <TooltipInput
              tooltipText={copiedKey ? "Copied!" : "Copy"}
              variant="ghost"
              onClick={() => copy(content || "")}
            >
              {copiedKey ? <CopyCheck size={18} /> : <CopyIcon size={18} />}
            </TooltipInput>
          </section>
        </>
      );
    }
  };

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
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatBubble;
