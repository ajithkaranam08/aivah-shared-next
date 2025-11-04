import React from "react";
import { TooltipInput } from "./tooltip";
import { ArrowUp, AudioLinesIcon, CircleStop, MicIcon, Square, SquareStop } from "lucide-react";
import VoiceInput from "./wave-form";

const Listener = ({ watchTextvalue }: { watchTextvalue: string }) => {
	return (
		<div className="flex items-center gap-1.5">
			<VoiceInput />

			<div className="min-w-9">
				<TooltipInput variant={watchTextvalue ? "default" : "secondary"} tooltipText="Add more options" className="border border-light">
					{watchTextvalue ? <ArrowUp size={18} /> : <AudioLinesIcon size={18} />}

					{/* <Square className="size-3 fill-foreground" /> */}
				</TooltipInput>
			</div>
		</div>
	);
};

export default Listener;
