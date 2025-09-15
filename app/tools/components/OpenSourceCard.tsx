import { FaGithub } from "react-icons/fa";

export default function OpenSourceCard() {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <div className="flex-1">
        <h3 className="text-foreground mb-2 text-lg font-semibold">Open Source & Transparent</h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          This tool is open source and the underlying logic is fully transparent. You can view the source code,
          understand the calculations, and even contribute improvements to make it better for everyone.
        </p>
        <a
          href="https://github.com/AeroVia-org/tools"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <FaGithub className="h-4 w-4" />
          View Source Code
        </a>
      </div>
    </div>
  );
}
