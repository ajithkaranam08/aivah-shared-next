"use client";

import { RefreshCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Experience from "@/components/experience";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggleBtn } from "@/components/ui/theme-toggle";
import {
  SESSION_CONVERSATION_ID,
  SESSION_ID,
  SESSION_TOKEN,
  SESSION_UUID,
} from "@/helper/storage";
import useResize from "@/hooks/use-resize";
import { useValidateUUID } from "@/services/validate/query";

import ChatCompanion from "../_components/chat-companion";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useConversationStore from "@/store/conversation";

type Info = {
  directionType: "horizontal" | "vertical";
  panelDefaultSize: number;
};

const CompanionEmbedId = () => {
  const { width } = useResize();
  const router = useRouter();
  const { embedId } = useParams();
  const queryClient = useQueryClient();

  const resetMessage = useConversationStore(state => state.reset);



  const { data, isSuccess } = useValidateUUID(String(embedId));

  useEffect(() => {
    const token = SESSION_TOKEN.get();
    if (!token && isSuccess) {
      SESSION_TOKEN.set(data.details.token);
    }
  }, [isSuccess, data]);

  const isTablet = width <= 768;

  const info: Info = {
    directionType: isTablet ? "vertical" : "horizontal",
    panelDefaultSize: isTablet ? 30 : 50,
  };

  const createNewSesstion = () => {
    SESSION_CONVERSATION_ID.clear();
    SESSION_ID.clear();
    SESSION_TOKEN.clear();
    SESSION_UUID.clear();
    queryClient.clear();
    resetMessage();
    router.refresh();
  };

  return (
    <div className="flex h-full items-center justify-center">
      <ResizablePanelGroup
        direction={info.directionType}
        className="min-h-[200px] max-w-md min-w-full rounded-3xl border"
      >
        <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
          <div className="group relative flex h-full items-center justify-center">
            {data.details?.avatarUrl ? (
              <>
                <Experience
                  modelUrl={data.details?.avatarUrl}
                  chatId={data.details?.chatbotId}
                  companionType={data.details?.avatarType}
                  scene="empty"
                />
                <div className="absolute top-3 left-3 z-20 flex flex-col items-center gap-3 opacity-25 group-hover:opacity-100">
                  <ModeToggleBtn />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={createNewSesstion}
                  >
                    <RefreshCcw size={20} />
                  </Button>
                </div>
              </>
            ) : (
              <Skeleton className="size-full flex-1 rounded-none" />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
          <ChatCompanion sessionData={data} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CompanionEmbedId;
