import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@packages/ui/components/ui/card";
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 p-8 text-center">
          <div className="relative z-10">
            <h2 className="mb-4 text-2xl font-bold from-primary via-secondary to-primary bg-gradient-to-r bg-clip-text text-transparent">
              Explore Our Aerospace Tools
            </h2>
            <p className="mb-6 text-muted-foreground">
              Discover calculators, simulators, and visualizations for aerospace
              engineering
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
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
        </div>

        {/* How to add a new tool */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              How to Add a New Tool
            </CardTitle>
            <CardDescription className="text-base">
              Follow these steps to contribute a new calculator or visualization
              to our growing collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Add Tool Metadata
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Register your tool in{" "}
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      app/tools.ts
                    </code>
                    :
                  </p>
                  <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm border">
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Create Tool Structure
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Create a folder at{" "}
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      app/(tools)/your-tool-key/
                    </code>{" "}
                    with:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <code className="text-sm font-medium">page.tsx</code>
                        <p className="text-xs text-muted-foreground">
                          Central tool page
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <code className="text-sm font-medium">layout.tsx</code>
                        <p className="text-xs text-muted-foreground">
                          Name, description, and metadata
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                      <Code className="h-5 w-5 text-primary" />
                      <div>
                        <code className="text-sm font-medium">logic.ts</code>
                        <p className="text-xs text-muted-foreground">
                          Core calculation functions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                      <TestTube className="h-5 w-5 text-primary" />
                      <div>
                        <code className="text-sm font-medium">
                          logic.test.ts
                        </code>
                        <p className="text-xs text-muted-foreground">
                          Unit tests with Vitest
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <code className="text-sm font-medium">Theory.tsx</code>
                        <p className="text-xs text-muted-foreground">
                          Educational theory and references
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <div>
                        <code className="text-sm font-medium">
                          Visualization.tsx
                        </code>
                        <p className="text-xs text-muted-foreground">
                          Interactive visualizations/charts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Use shadcn/ui Components
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Import components via{" "}
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      @packages/ui
                    </code>
                    :
                  </p>
                  <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm border">
                    <code>{`import { Button } from "@packages/ui/components/ui/button";
import { Input } from "@packages/ui/components/ui/input";`}</code>
                  </pre>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Follow Development Guidelines
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-card border">
                      <h4 className="font-semibold text-foreground mb-2">
                        Semantic Colors
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Use semantic colors (e.g.,{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          bg-primary
                        </code>
                        ,{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          text-muted-foreground
                        </code>
                        ) instead of hardcoded hex or Tailwind named colors.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-card border">
                      <h4 className="font-semibold text-foreground mb-2">
                        Code Quality
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Follow existing structure and naming conventions. Add
                        concise comments for complex mathematical calculations.
                        Ensure TypeScript safety (no{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          any
                        </code>
                        ), input validation, and strong tests against trusted
                        references.
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
