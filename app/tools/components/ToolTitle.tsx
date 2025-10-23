import AuthorBadge from "./AuthorBadge";
import { getToolByKey } from "../tools";

export default function ToolTitle({ toolKey }: { toolKey: string }) {
  const tool = getToolByKey(toolKey);
  const authorIds = tool.authors;

  return (
    <div className="relative flex flex-col items-center">
      <h1 className="from-static-primary via-static-secondary to-static-primary bg-gradient-to-r bg-clip-text text-center text-3xl font-bold text-transparent sm:text-4xl">
        {tool.title}
      </h1>
      {authorIds && authorIds.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-6 md:absolute md:right-0 md:mt-0 md:justify-end">
          {authorIds.map((authorId) => (
            <AuthorBadge key={authorId} authorId={authorId} />
          ))}
        </div>
      )}
    </div>
  );
}
