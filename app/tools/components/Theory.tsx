"use client";

import { useEffect, useState } from "react";
import TheoryContent from "./TheoryContent";

interface TheoryProps {
  toolKey: string;
}

export default function Theory({ toolKey }: TheoryProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTheory() {
      try {
        const response = await fetch(`/tools/api/theory?toolKey=${toolKey}`);
        const data = await response.json();
        setContent(data.content || "");
      } catch (error) {
        console.warn(`Failed to load theory for tool: ${toolKey}`, error);
        setContent("");
      } finally {
        setLoading(false);
      }
    }

    fetchTheory();
  }, [toolKey]);

  if (loading) {
    return null;
  }

  if (!content) {
    return null;
  }

  return <TheoryContent content={content} />;
}
