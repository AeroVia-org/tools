import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@packages/ui/components/ui/card";
import { Button } from "@packages/ui/components/ui/button";
import { ArrowRight, Code, FileText, TestTube, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <PageHeader
        title="Contribute to AeroVia Tools"
        description="Open-source aerospace calculators and visualizations. Here's how to get involved."
      />

      <div className="mt-12 grid gap-8">
        {/* Hero CTA Section */}
        <div className="from-primary/10 via-secondary/5 to-primary/10 relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-center">
          <div className="relative z-10">
            <h2 className="from-primary via-secondary to-primary mb-4 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              Explore Our Aerospace Tools
            </h2>
            <p className="text-muted-foreground mb-6">
              Discover calculators, simulators, and visualizations for aerospace engineering
            </p>
            <Button
              asChild
              size="lg"
              className="group h-14 px-8 text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
            >
              <Link href="/tools" className="flex items-center gap-2">
                <span>Explore Tools</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-r opacity-50" />
        </div>

        {/* How to add a new tool */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">How to Add a New Tool</CardTitle>
            <CardDescription className="text-base">
              Follow these steps to contribute a new calculator or visualization to our growing collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 font-semibold">Add Tool Metadata</h3>
                  <p className="text-muted-foreground mb-3">
                    Register your tool in <code className="bg-muted rounded px-2 py-1 text-sm">app/tools.ts</code>:
                  </p>
                  <pre className="bg-muted overflow-x-auto rounded-lg border p-4 text-sm">
                    <code>{`{
  type: "active",
  key: "your-tool-key",
  title: "Your Tool Name",
  icon: FaYourIcon,
  description: "Brief description of what the tool does",
  category: "Your Category",
  authors: ["your-author-id"],
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 font-semibold">Create Tool Structure</h3>
                  <p className="text-muted-foreground mb-3">
                    Create a folder at{" "}
                    <code className="bg-muted rounded px-2 py-1 text-sm">app/(tools)/your-tool-key/</code> with:
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                      <FileText className="text-primary h-5 w-5" />
                      <div>
                        <code className="text-sm font-medium">page.tsx</code>
                        <p className="text-muted-foreground text-xs">Central tool page</p>
                      </div>
                    </div>
                    <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                      <FileText className="text-primary h-5 w-5" />
                      <div>
                        <code className="text-sm font-medium">layout.tsx</code>
                        <p className="text-muted-foreground text-xs">Name, description, and metadata</p>
                      </div>
                    </div>
                    <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                      <Code className="text-primary h-5 w-5" />
                      <div>
                        <code className="text-sm font-medium">logic.ts</code>
                        <p className="text-muted-foreground text-xs">Core calculation functions</p>
                      </div>
                    </div>
                    <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                      <TestTube className="text-primary h-5 w-5" />
                      <div>
                        <code className="text-sm font-medium">logic.test.ts</code>
                        <p className="text-muted-foreground text-xs">Unit tests with Vitest</p>
                      </div>
                    </div>
                    <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                      <FileText className="text-primary h-5 w-5" />
                      <div>
                        <code className="text-sm font-medium">theory.tsx</code>
                        <p className="text-muted-foreground text-xs">Educational theory and references</p>
                      </div>
                    </div>
                    <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                      <BarChart3 className="text-primary h-5 w-5" />
                      <div>
                        <code className="text-sm font-medium">visualization.tsx</code>
                        <p className="text-muted-foreground text-xs">Interactive visualizations/charts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 font-semibold">Use shadcn/ui Components</h3>
                  <p className="text-muted-foreground mb-3">
                    Import components via <code className="bg-muted rounded px-2 py-1 text-sm">@packages/ui</code>:
                  </p>
                  <pre className="bg-muted overflow-x-auto rounded-lg border p-4 text-sm">
                    <code>{`import { Button } from "@packages/ui/components/ui/button";
import { Input } from "@packages/ui/components/ui/input";`}</code>
                  </pre>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 font-semibold">Follow Development Guidelines</h3>
                  <div className="space-y-3">
                    <div className="bg-card rounded-lg border p-3">
                      <h4 className="text-foreground mb-2 font-semibold">Semantic Colors</h4>
                      <p className="text-muted-foreground text-sm">
                        Use semantic colors (e.g.,{" "}
                        <code className="bg-muted rounded px-1 py-0.5 text-xs">bg-primary</code>,{" "}
                        <code className="bg-muted rounded px-1 py-0.5 text-xs">text-muted-foreground</code>) instead of
                        hardcoded hex or Tailwind named colors.
                      </p>
                    </div>

                    <div className="bg-card rounded-lg border p-3">
                      <h4 className="text-foreground mb-2 font-semibold">Code Quality</h4>
                      <p className="text-muted-foreground text-sm">
                        Follow existing structure and naming conventions. Add concise comments for complex mathematical
                        calculations. Ensure TypeScript safety (no{" "}
                        <code className="bg-muted rounded px-1 py-0.5 text-xs">any</code>
                        ), input validation, and strong tests against trusted references.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
