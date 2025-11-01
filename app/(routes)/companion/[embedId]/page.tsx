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


type Info = {
  directionType: "horizontal" | "vertical"
  panelDefaultSize: number
}

const CompanionEmbedId = () => {
  const { width } = useResize();
  const { embedId } = useParams();
  const { data } = useValidateUUID(String(embedId));

  console.log({ data })
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
          <Experience embedId={String(embedId)} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
        <div className="flex p-5 flex-col h-full justify-end gap-2">
          <ChatBubble timestamp={new Date()} message="Hello! How can I assist you today? asdsafsfs aefsdfgsdfafa faw fasf afadafa adafadfsad faf af" sender="bot" />
          <ChatBubble timestamp={new Date()} message="Hello! How can asdsfsefa f afaedfsdf sedgfesdgsdg sdgsdg sgag sdgs gsg sgsgsgs gsgsdgsdg sgsdgs dgdssgsg" sender="user" />

          <ChatInput />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>

}

export default CompanionEmbedId