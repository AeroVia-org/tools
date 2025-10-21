"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import ToolCard from "./components/ToolCard";
import ComingSoonCard from "./components/ComingSoonCard";
import { Input } from "@packages/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packages/ui/components/ui/select";
import { allTools, categories } from "./tools";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter and group tools based on search query and category
  const groupedTools = useMemo(() => {
    const filtered = allTools.filter(
      (tool) =>
        tool.type !== "hidden" && // Hide tools marked as hidden
        (tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory === "All" || tool.category === selectedCategory)
    );

    // Group tools by category
    const grouped = filtered.reduce<Record<string, typeof allTools>>(
      (acc, cur) => {
        (acc[cur.category] ??= []).push(cur);
        return acc;
      },
      {} as Record<string, typeof allTools>
    );

    return grouped;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="mx-auto my-8 flex w-full max-w-7xl flex-col gap-8 px-4 lg:px-8">
      <PageHeader
        title="Aerospace Tools"
        description="Explore our open-source aerospace tools, calculators, and simulators"
      />

      {/* Search and Filter Section */}
      <div className="mx-auto w-full max-w-xl">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-28 sm:w-40 md:w-50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tools Grid */}
      {Object.keys(groupedTools).length > 0 ? (
        <div className="space-y-8">
          {categories
            .filter((category) => groupedTools[category])
            .map((category) => (
              <div key={category}>
                {/* Category Divider */}
                <div className="text-muted-foreground mb-6 flex items-center gap-2 py-1 text-xs font-semibold tracking-wide uppercase">
                  <span className="border-border flex-grow border-t" />
                  <span className="px-1">{category}</span>
                  <span className="border-border flex-grow border-t" />
                </div>

                {/* Tools Grid for this category */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {groupedTools[category].map((tool) => {
                    if (tool.type === "active") {
                      return <ToolCard key={tool.key} toolKey={tool.key} />;
                    } else {
                      return (
                        <ComingSoonCard key={tool.key} toolKey={tool.key} />
                      );
                    }
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">
            No tools found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
