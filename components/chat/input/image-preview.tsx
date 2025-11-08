import { XIcon } from "lucide-react";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ChatFormType } from "@/zod-schema/chat";

const ImagePreviewInput = () => {
  const form = useFormContext<ChatFormType>();
  return (
    <Controller
      name="fileUrl"
      control={form.control}
      render={({ field }) => (
        <>
          {field.value && (
            <div className="w-full p-2">
              <div className="relative max-w-max">
                <Image
                  className="rounded-2xl"
                  src={field.value}
                  alt={`image-generated`}
                  width={144}
                  height={144}
                />
                <Button
                  size={"icon-sm"}
                  variant={"ghost"}
                  className="absolute top-1 right-1 cursor-pointer gap-2 text-white"
                  onClick={() => {
                    field.onChange("");
                    form.setValue("file", undefined);
                  }}
                >
                  <XIcon size={18} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    />
  );
};

export default ImagePreviewInput;
