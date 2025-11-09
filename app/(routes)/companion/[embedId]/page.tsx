"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import Experience from "@/components/experience";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ModeToggleBtn } from "@/components/ui/theme-toggle";
import { SESSION_TOKEN } from "@/helper/storage";
import useResize from "@/hooks/use-resize";
import { useValidateUUID } from "@/services/validate/query";

import ChatCompanion from "../_components/chat-companion";

type Info = {
  directionType: "horizontal" | "vertical";
  panelDefaultSize: number;
};

const CompanionEmbedId = () => {
  const { width } = useResize();
  const { embedId } = useParams();

  const { data } = useValidateUUID(String(embedId));

  useEffect(() => {
    if (typeof window !== "undefined") {
      SESSION_TOKEN.set(data.details.token);
    }
  }, [data]);

  const isTablet = width <= 768;

  const info: Info = {
    directionType: isTablet ? "vertical" : "horizontal",
    panelDefaultSize: isTablet ? 30 : 50,
  };

  return (
    <div className="flex h-full items-center justify-center">
      <ModeToggleBtn />
      <ResizablePanelGroup
        direction={info.directionType}
        className="min-h-[200px] max-w-md min-w-full rounded-3xl border"
      >
        <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
          <div className="flex h-full items-center justify-center">
            <Experience
              modelUrl={data.details?.avatarUrl}
              chatId={data.details?.chatbotId}
              companionType={data.details?.avatarType}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
          <ChatCompanion />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CompanionEmbedId;
