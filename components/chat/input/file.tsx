import { PlusIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { ChatFormType } from "@/zod-schema/chat";

import { TooltipInput } from "./tooltip";

const FileInput = () => {
  const { setValue } = useFormContext<ChatFormType>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setValue("file", url);
    }
  };

  return (
    <TooltipInput tooltipText="Attach file" variant="ghost">
      <Label htmlFor="chat-file" className="cursor-pointer">
        <input
          type="file"
          name="chat_file"
          id="chat-file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <PlusIcon size={18} />
      </Label>
    </TooltipInput>
  );
};

export default FileInput;
