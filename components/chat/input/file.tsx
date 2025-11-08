import { useRef } from "react";

import { PlusIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { ChatFormType } from "@/zod-schema/chat";

import { TooltipInput } from "./tooltip";

const FileInput = () => {
  const { setValue } = useFormContext<ChatFormType>();
  const triggerFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setValue("fileUrl", url);
      setValue("file", file);
      if (triggerFileRef.current) {
        triggerFileRef.current.value = "";
      }
    }
  };

  return (
    <TooltipInput
      tooltipText="Attach file"
      variant="ghost"
      onClick={() => triggerFileRef.current?.click()}
    >
      <input
        ref={triggerFileRef}
        type="file"
        name="chat_file"
        id="chat-file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <PlusIcon size={18} />
    </TooltipInput>
  );
};

export default FileInput;
