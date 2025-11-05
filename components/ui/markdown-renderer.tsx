import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// allows <b>, <i>, <code> in markdown

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-slate dark:prose-invert prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
