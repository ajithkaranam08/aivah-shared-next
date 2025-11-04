import React, { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { formSchema } from ".";
import z from "zod";
import { cn } from "@/lib/utils";
import VoiceInput from "./wave-form";

type Props = {};

const EditorInput = (props: Props) => {
	const editorRef = useRef<HTMLDivElement>(null);
	const [value, setValue] = useState("");
	const form = useFormContext<z.infer<typeof formSchema>>();

	const handleInput = () => {
		const text = editorRef.current?.textContent || "";
		setValue(text);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			console.log("Send:", value);
			setValue("");
			if (editorRef.current) editorRef.current.textContent = "";
		}
	};

	return (
		<div className="-my-2.5 flex min-h-14 items-center overflow-x-hidden px-1.5 [grid-area:primary] group-data-expanded/composer:mb-0 group-data-expanded/composer:px-2.5">
			<div className="_prosemirror-parent_1dsxi_2 text-token-text-primary max-h-52 flex-1 overflow-auto [scrollbar-width:thin] default-browser vertical-scroll-fade-mask">
				<textarea id="chat-textarea" placeholder="Ask anything" className="h-lh hidden" />

                <Controller
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <div
                        
                            onInput={(e) => field.onChange(e.currentTarget.textContent)}
                            onKeyDown={handleKeyDown}
                            contentEditable
                            suppressContentEditableWarning
                            translate='no'
                            id='prompt-textarea'
                            data-virtualkeyboard="true"
                            inputMode='text'
                            className='outline-none wrap-break-word -translate-y-0.5 whitespace-break-spaces pb-4 mt-4'
                        >

                            <p className={cn(field.value ? 'hidden' : 'place-holder')} data-placeholder="Ask anything">
                                <br className='hidden' />
                            </p>

                        </div>

                    )}
                />

            </div>
        </div>
    )
}
				<Controller
					control={form.control}
					name="text"
					render={({ field }) => (
						<div onInput={(e) => field.onChange(e.currentTarget.textContent)} onKeyDown={handleKeyDown} contentEditable suppressContentEditableWarning translate="no" id="prompt-textarea" data-virtualkeyboard="true" inputMode="text" className="outline-none wrap-break-word -translate-y-0.5 whitespace-break-spaces pb-4 mt-4">
							<p className={cn(field.value ? "hidden" : "place-holder")} data-placeholder="Ask anything">
								<br className="hidden" />
							</p>
						</div>
					)}
				/>
			</div>
		</div>
	);
};

export default EditorInput;
