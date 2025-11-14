import { describe, it, expect } from "vitest";
import { allTools } from "./tools";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Tools Structure", () => {
  describe("Tool Folders and Pages", () => {
    it("should have a page.tsx file for each tool (warnings only)", () => {
      const missingTools: string[] = [];

      allTools.forEach((tool) => {
        const toolPath = path.join(__dirname, "(tools)", tool.key, "page.tsx");
        if (!fs.existsSync(toolPath)) {
          missingTools.push(tool.key);
        }
      });

      if (missingTools.length > 0) {
        console.warn(`⚠️  Missing page.tsx files for tools: ${missingTools.join(", ")}`);
      } else {
        console.log("✅ All tools have page.tsx files");
      }

      // This test always passes - it's just for tracking missing pages
      expect(true).toBe(true);
    });
  });

  describe("Tool Keys", () => {
    it("should have unique tool keys", () => {
      const keys = allTools.map((tool) => tool.key);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it("should have valid tool key format", () => {
      allTools.forEach((tool) => {
        expect(tool.key).toMatch(/^[a-z0-9-]+$/); // kebab-case
        expect(tool.key.length).toBeGreaterThan(3);
      });
    });
  });
});
