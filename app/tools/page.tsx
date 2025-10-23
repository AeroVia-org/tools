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
import {
  allTools,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  ToolCategoryOption,
  ToolStatusOption,
} from "./tools";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ToolCategoryOption>("All");
  const [selectedStatus, setSelectedStatus] =
    useState<ToolStatusOption>("Active");

  // Filter and group tools based on search query, category, and status
  const groupedTools = useMemo(() => {
    const filtered = allTools.filter(
      (tool) =>
        tool.status !== "Hidden" && // Hide tools marked as hidden
        (tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory === "All" || tool.category === selectedCategory) &&
        (selectedStatus === "All" || tool.status === selectedStatus)
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
  }, [searchQuery, selectedCategory, selectedStatus]);

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
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as ToolCategoryOption)
            }
          >
            <SelectTrigger className="w-auto min-w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as ToolStatusOption)
            }
          >
            <SelectTrigger className="w-auto min-w-24">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tools Grid */}
      {Object.keys(groupedTools).length > 0 ? (
        <div className="space-y-8">
          {Object.keys(groupedTools)
            .sort()
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
                    if (tool.status === "Active") {
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
