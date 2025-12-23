"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import OpenSourceCard from "../../components/OpenSourceCard";
import { getSunDataFromLocation } from "@/app/actions/sunrise-sunset-calculator";
import { SunData } from "./types";
import { Button } from "@/components/ui/button";
// import ToolTitle from "../../components/ToolTitle"; // TODO: Uncomment
// import Theory from "../../components/Theory"; // TODO: Uncomment

export default function DefaultCalculatorPage() {
  // Input state
  const [location, setLocation] = useState<string>("");

  // Results state
  const [result, setResult] = useState<SunData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (location: string) => {
    setError(null);
    setResult(null);
    try {
      const sunData = await getSunDataFromLocation(location);
      setResult(sunData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during calculation.");
      setResult(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      {/* <ToolTitle toolKey="default" /> */} {/* TODO: Uncomment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">Add one to a number</p>

          {/* Input Value */}
          <div className="mb-6">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., London"
              className="mt-1 block w-full"
            />
          </div>

          <Button onClick={() => handleCalculate(location)} disabled={!location}>Calculate</Button>

          {error && (
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {result !== null && (
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Result:</h2>
              <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                <div>
                  <div className="text-foreground font-medium">Sunrise</div>
                  <div className="text-muted-foreground text-sm">{result.sunrise.toLocaleTimeString()}</div>
                  <div className="text-foreground font-medium">Sunset</div>
                  <div className="text-muted-foreground text-sm">{result.sunset.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-border bg-card flex items-center justify-center rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground text-center">Visualization area (optional)</p>
        </div>
      </div>
      {/* Theory Section */}
      {/* <Theory toolKey="default" /> */} {/* TODO: Uncomment */}
      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
