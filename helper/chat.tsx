import { ChatInputExpandTypes } from "@/types/chat";

export const createTag = (tag: keyof HTMLElementTagNameMap, child?: HTMLElement) => {
    const element = document.createElement(tag);
    if (child) element.appendChild(child);
    return element;
};

// Move cursor to end of editable element
export const placeCaretAtEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
};


export const checkExpansion = (editor: HTMLDivElement | null, onExpand: (v: ChatInputExpandTypes) => void) => {
    if (!editor) return;
    const paragraphs = editor.querySelectorAll('p');
    const multiLine = paragraphs.length > 1;
    onExpand(multiLine ? ChatInputExpandTypes.MULTI_LINE : ChatInputExpandTypes.SINGLE_LINE);
};
