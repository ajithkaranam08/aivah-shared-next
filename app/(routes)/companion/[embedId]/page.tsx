"use client"

import Experience from "@/components/experience"
import ChatBubble from "@/components/chat/bubble"
import ChatInput from "@/components/chat/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ModeToggleBtn } from "@/components/ui/theme-toggle"
import useResize from "@/hooks/use-resize"
import { useValidateUUID } from "@/services/validate/query"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useCompanionStore } from "@/store/companion"
import Chat from "@/components/chat"
import { SESSION_TOKEN } from "@/helper/storage"


type Info = {
  directionType: "horizontal" | "vertical"
  panelDefaultSize: number
}

const CompanionEmbedId = () => {
  const { width } = useResize();
  const { embedId } = useParams();

  const { data } = useValidateUUID(String(embedId));

  useEffect(() => {

    console.log({data});

    if (typeof window !== "undefined") {
      SESSION_TOKEN.set(data.details.token)
    }

  }, [data.details.token])


  const isTablet = width <= 768;


  const info: Info = {
    directionType: isTablet ? "vertical" : "horizontal",
    panelDefaultSize: isTablet ? 30 : 50,
  }

  return <div className="flex justify-center h-full items-center">
    <ModeToggleBtn />
    <ResizablePanelGroup
      direction={info.directionType}
      className="min-h-[200px] max-w-md border min-w-full rounded-3xl"
    >
      <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
        <div className="flex h-full items-center justify-center p-6">
          <Experience modelUrl={data.details?.avatarUrl} chatId={data.details?.chatbotId} companionType={data.details?.avatarType} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
        <Chat  />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>

}

export default CompanionEmbedId