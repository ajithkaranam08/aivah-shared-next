"use client"

import InputChat from "@/components/chat/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ModeToggleBtn } from "@/components/ui/theme-toggle"
import useResize from "@/hooks/use-resize"

type Info = {
  directionType: "horizontal" | "vertical"
  panelDefaultSize: number
}

const CompanionEmbedId = () => {
  const { width } = useResize();
  const isTablet = width <= 768;


  const info: Info = {
    directionType: isTablet ? "vertical" : "horizontal",
    panelDefaultSize: isTablet ? 30 : 50,
  }
  return <div className="flex justify-center h-full items-center">
    <ResizablePanelGroup
      direction={info.directionType}
      className="min-h-[200px] max-w-md border min-w-full rounded-3xl"
    >
      <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold"> <ModeToggleBtn /></span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
        <div className="flex px-5 flex-col h-full justify-end">
          <InputChat />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>

}

export default CompanionEmbedId