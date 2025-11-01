"use client";

import Experience from "@/components/experience";
import ChatBubble from "@/components/chat/bubble";
import ChatInput from "@/components/chat/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ModeToggleBtn } from "@/components/ui/theme-toggle";
import useResize from "@/hooks/use-resize";
import { useValidateUUID } from "@/services/validate/query";
import { useParams } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentRef,  useEffect, useRef, useState } from "react";

type Info = {
	directionType: "horizontal" | "vertical";
	panelDefaultSize: number;
};

const messages: { from: "ai" | "user"; text: string }[] = [
	{ from: "ai", text: "Hey there 👋 How can I help you today?" },
	{ from: "user", text: "Hi! I’m building an AI chat interface like ChatGPT." },
	{ from: "ai", text: "That sounds awesome! Do you want help with the design or the logic?" },
	{ from: "user", text: "Both actually. I want a nice scroll-down button and smooth scrolling." },
	{ from: "ai", text: "Got it! You can use Tailwind CSS with scroll-smooth and hide the scrollbar using custom utilities." },
	{ from: "user", text: "Cool 😎 Also, how do I auto-scroll when new messages appear?" },
	{ from: "ai", text: "You can use a useRef to reference your chat container and call scrollTo() inside useEffect whenever messages update." },
	{ from: "user", text: "Perfect, that works! Can I also add fade shadow at the top?" },
	{ from: "ai", text: "Yes! You can use a gradient overlay like from-gray-900/0 to-gray-900/50 to create that subtle fade effect." },
	{ from: "user", text: "Thanks! This feels exactly like a real AI chat 😄" },
	{ from: "ai", text: "Hey there 👋 How can I help you today?" },
	{ from: "user", text: "Hi! I’m building an AI chat interface like ChatGPT." },
	{ from: "ai", text: "That sounds awesome! Do you want help with the design or the logic?" },
	{ from: "user", text: "Both actually. I want a nice scroll-down button and smooth scrolling." },
	{ from: "ai", text: "Got it! You can use Tailwind CSS with scroll-smooth and hide the scrollbar using custom utilities." },
	{ from: "user", text: "Cool 😎 Also, how do I auto-scroll when new messages appear?" },
	{ from: "ai", text: "You can use a useRef to reference your chat container and call scrollTo() inside useEffect whenever messages update." },
	{ from: "user", text: "Perfect, that works! Can I also add fade shadow at the top?" },
	{ from: "ai", text: "Yes! You can use a gradient overlay like from-gray-900/0 to-gray-900/50 to create that subtle fade effect." },
	{ from: "user", text: "Thanks! This feels exactly like a real AI chat 😄" },
];

const CompanionEmbedId = () => {
	const { width } = useResize();
	const { embedId } = useParams();
	// const { data } = useValidateUUID(String(embedId));
	const chatRef = useRef<ComponentRef<"section">>(null);
	const [isAtBottom, setIsAtBottom] = useState(true);

	const isTablet = width <= 768;

	const info: Info = {
		directionType: isTablet ? "vertical" : "horizontal",
		panelDefaultSize: isTablet ? 30 : 50,
	};
	const handleScroll = () => {
		const element = chatRef.current;
		if (!element) return;
		const isBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
		setIsAtBottom(isBottom);
	};

	useEffect(() => {
		if (isAtBottom) {
			chatRef.current?.scrollTo({
				top: chatRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	return (
		<div className="flex justify-center h-full items-center">
			<ModeToggleBtn />
			<ResizablePanelGroup direction={info.directionType} className="min-h-[200px] max-w-md border min-w-full rounded-3xl">
				<ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
					<div className="flex h-full items-center justify-center p-6">
						<Experience embedId={String(embedId)} />
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={info.panelDefaultSize} minSize={35}>
					<div className="flex p-5 flex-col h-full justify-end gap-2 relative">
						<section className="overflow-auto scrollbar-hide h-full" onScroll={handleScroll} ref={chatRef}>
							{messages.map((dt) => (
								<>
									<ChatBubble timestamp={new Date()} message={dt?.text} sender={dt?.from} />
								</>
							))}
						</section>

						{!isAtBottom && (
							<Button
								onClick={() =>
									chatRef.current?.scrollTo({
										top: chatRef.current.scrollHeight,
										behavior: "smooth",
									})
								}
								size={"icon"}
								variant={"secondary"}
								className="rounded-4xl absolute bottom-23 -translate-x-2/4 left-2/4"
							>
								<ArrowDown size={18} />{" "}
							</Button>
						)}
						<ChatInput />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

export default CompanionEmbedId;
