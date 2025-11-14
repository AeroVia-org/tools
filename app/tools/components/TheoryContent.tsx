"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface TheoryContentProps {
  content: string;
}

export default function TheoryContent({ content }: TheoryContentProps) {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <div className="space-y-8">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-foreground text-2xl font-bold">Theory & Background</h2>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h2: ({ node, ...props }) => <h2 className="text-foreground mt-8 mb-4 text-xl font-semibold" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-foreground mt-6 mb-3 text-lg font-semibold" {...props} />,
              h4: ({ node, ...props }) => <h4 className="text-foreground mt-4 mb-2 font-semibold" {...props} />,
              h5: ({ node, ...props }) => <h5 className="text-foreground mt-3 mb-2 font-medium" {...props} />,
              p: ({ node, ...props }) => <p className="text-muted-foreground mb-3 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => (
                <ul className="text-muted-foreground mb-4 ml-5 list-disc space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="text-muted-foreground mb-4 ml-5 list-decimal space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => <li className="text-sm" {...props} />,
              code: ({ node, ...props }) => (
                <code className="bg-muted/50 rounded px-1.5 py-0.5 font-mono text-sm" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-muted/50 mb-4 overflow-x-auto rounded-lg p-4" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-primary border-l-4 pl-4 italic" {...props} />
              ),
              strong: ({ node, ...props }) => <strong className="text-foreground font-semibold" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
              table: ({ node, ...props }) => (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full border-collapse" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border-border bg-muted/50 border px-4 py-2 text-left font-semibold" {...props} />
              ),
              td: ({ node, ...props }) => <td className="border-border border px-4 py-2" {...props} />,
              hr: ({ node, ...props }) => <hr className="border-border my-6 border-t" {...props} />,
              div: ({ node, className, ...props }) => {
                // Preserve custom div classes from HTML in markdown
                if (className) {
                  return <div className={className} {...props} />;
                }
                return <div {...props} />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
