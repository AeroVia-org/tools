// Created an api route because "fs" is not available in the client

import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const toolKey = searchParams.get("toolKey");

  if (!toolKey) {
    return NextResponse.json({ error: "toolKey parameter is required" }, { status: 400 });
  }

  try {
    const theoryPath = join(process.cwd(), "app", "tools", "(tools)", toolKey, "theory.md");

    const content = readFileSync(theoryPath, "utf-8");
    return NextResponse.json({ content });
  } catch {
    // If theory.md doesn't exist, return empty content
    return NextResponse.json({ content: "" });
  }
}
