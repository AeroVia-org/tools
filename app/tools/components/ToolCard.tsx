import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { getToolByKey } from "../tools";

export default function ToolCard({ toolKey }: { toolKey: string }) {
  const tool = getToolByKey(toolKey);

  return (
    <Link
      href={`/tools/${toolKey}`}
      className="border-border bg-card/50 hover:border-primary/50 group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-lg"
    >
      <div className="from-primary/5 to-secondary/5 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
          <tool.icon className="text-primary h-6 w-6" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-semibold">{tool.title}</h3>
        <p className="text-muted-foreground mb-4 flex-grow">{tool.description}</p>
        <div className="text-primary mt-auto inline-flex items-center text-sm font-medium">
          Use Tool
          <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
