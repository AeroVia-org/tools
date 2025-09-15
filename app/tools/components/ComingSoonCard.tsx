import { getToolByKey } from "../tools";

// Reusable "Coming Soon" Badge Component
const ComingSoonBadge = () => (
  <span className="from-primary-muted/20 to-secondary-muted/20 text-primary-muted inline-block rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold tracking-wide uppercase">
    Coming Soon
  </span>
);

export default function ComingSoonCard({ toolKey }: { toolKey: string }) {
  const tool = getToolByKey(toolKey);
  return (
    <div className="group border-border bg-muted/50 relative overflow-hidden rounded-xl border p-6 opacity-70 shadow-sm">
      <div className="relative z-10 flex h-full flex-col">
        <div className="bg-muted/20 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
          <tool.icon className="text-muted-foreground h-6 w-6" />
        </div>
        <h3 className="text-muted-foreground mb-2 text-xl font-semibold">{tool.title}</h3>
        <p className="text-muted-foreground mb-4 flex-grow">{tool.description}</p>
        <div className="mt-auto">
          <ComingSoonBadge />
        </div>
      </div>
    </div>
  );
}
