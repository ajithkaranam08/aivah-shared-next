import React, { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChatFormType } from "@/zod-schema/chat";
import { checkExpansion, createTag, placeCaretAtEnd } from "@/helper/chat";
import { ChatInputExpandTypes } from "@/types/chat";
import { useCreateChatMutation } from "@/services/conversation/mutation";
import { useLivekitStore } from "@/store/livekit";



const EditorInput = ({
    onExpand,
}: {
    onExpand: (val: ChatInputExpandTypes) => void;
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const form = useFormContext<ChatFormType>();
    const { room } = useLivekitStore();

    const { mutateAsync } = useCreateChatMutation(room);

    const handleInput = (
        e: React.FormEvent<HTMLDivElement>,
        onChange: (v: string) => void
    ) => {
        const div = e.currentTarget;
        const text = div.textContent?.trim() ?? "";

        if (!text.length) {
            div.innerHTML = '<p data-placeholder="Ask anything" class="place-holder"></p>';
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

            form.handleSubmit(async (data) => {
                await mutateAsync({
                    content: data.text,
                    id: String(Date.now()),
                    sender: "user",
                    timestamp: new Date().toISOString()
                })
                form.reset();
                if (editorRef.current) {
                    editorRef.current.innerHTML =
                        '<p data-placeholder="Ask anything" class="place-holder"></p>';
                }

            })();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        const html = text
            .split(/\r?\n/)
            .map((line) => `<p>${line || "<br>"}</p>`)
            .join("");
        document.execCommand("insertHTML", false, html);
    };

    return (
        <div className="-my-2.5 flex min-h-14 items-center overflow-x-hidden px-1.5 [grid-area:primary] group-data-expanded/composer:mb-0 group-data-expanded/composer:px-2.5">
            <div className="relative _prosemirror-parent_1dsxi_2 text-token-text-primary max-h-52 flex-1 overflow-auto [scrollbar-width:thin] default-browser vertical-scroll-fade-mask">
                <Controller
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <div
                            onInput={(e) => handleInput(e, field.onChange)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            ref={editorRef}
                            suppressContentEditableWarning
                            contentEditable
                            translate="no"
                            id="prompt-textarea"
                            data-virtualkeyboard="true"
                            inputMode="text"
                            className="outline-none wrap-break-word -translate-y-0.5 whitespace-break-spaces pb-4 mt-4">
                            <p data-placeholder="Ask anything" className="place-holder"></p>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default EditorInput;
