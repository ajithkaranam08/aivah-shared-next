import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // allows <b>, <i>, <code> in markdown

const MarkdownRenderer = ({ content }: { content: string }) => {
    return (
        <div className="prose prose-slate dark:prose-invert prose">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
