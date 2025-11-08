import React, { useRef } from "react";

import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";

import { checkExpansion, createTag, placeCaretAtEnd } from "@/helper/chat";
import { ChatInputExpandTypes } from "@/types/chat";
import { ChatFormType } from "@/zod-schema/chat";

const EditorInput = ({
  onExpand,
  onSubmit,
}: {
  onExpand: (val: ChatInputExpandTypes) => void;
  onSubmit: (val: ChatFormType) => void;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const form = useFormContext<ChatFormType>();

  const handleInput = (
    e: React.FormEvent<HTMLDivElement>,
    onChange: (v: string) => void
  ) => {
    const div = e.currentTarget;
    const text = div.textContent?.trim() ?? "";

    if (!text.length) {
      div.innerHTML =
        '<p data-placeholder="Ask anything" class="place-holder"></p>';
      onChange("");
      onExpand(ChatInputExpandTypes.TEXT_EMPTY);
      return;
    }

    const placeholder = div.querySelector(
      "[data-placeholder]"
    ) as HTMLParagraphElement;
    if (placeholder) {
      placeholder.classList.remove("place-holder");
      placeholder.removeAttribute("data-placeholder");
    }

    onChange(editorRef.current?.textContent ?? "");
    checkExpansion(editorRef.current, onExpand);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const div = e.currentTarget;
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        if (
          !div.textContent?.length &&
          div.querySelector("[data-placeholder]")
        ) {
          const pTag = div.querySelector(
            "[data-placeholder]"
          ) as HTMLParagraphElement;
          pTag.classList.remove("place-holder");
          pTag.removeAttribute("data-placeholder");
          pTag.appendChild(createTag("br"));
        }

        const newLine = createTag("p", createTag("br"));

        div.appendChild(newLine);
        placeCaretAtEnd(div);
        onExpand(ChatInputExpandTypes.MULTI_LINE);
        return;
      }

      const text = div.textContent?.trim();
      if (!text) return;

      form.handleSubmit(onSubmit)();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const lastItem = e.clipboardData.items[e.clipboardData.items.length - 1];
    if (lastItem.kind === "file") {
      const file = lastItem.getAsFile();
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        form.setValue("file", url);
      }
    } else {
      const text = e.clipboardData.getData("text/plain");
      const html = text
        .split(/\r?\n/)
        .map((line) => `<p>${line || "<br>"}</p>`)
        .join("");
      document.execCommand("insertHTML", false, html);
    }
  };

  return (
    <div className="-my-2.5 flex min-h-14 items-center overflow-x-hidden px-1.5 [grid-area:primary] group-data-expanded/composer:mb-0 group-data-expanded/composer:px-2.5">
      <div className="_prosemirror-parent_1dsxi_2 text-token-text-primary default-browser vertical-scroll-fade-mask relative max-h-52 flex-1 overflow-auto [scrollbar-width:thin]">
        <Controller
          control={form.control}
          name="text"
          render={({ field }) => (
            <div
              onInput={(e) => handleInput(e, field.onChange)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              ref={editorRef}
              suppressContentEditableWarning
              contentEditable
              translate="no"
              id="prompt-textarea"
              data-virtualkeyboard="true"
              inputMode="text"
              className="mt-4 -translate-y-0.5 pb-4 wrap-break-word whitespace-break-spaces outline-none"
            >
              <p data-placeholder="Ask anything" className="place-holder"></p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default EditorInput;
