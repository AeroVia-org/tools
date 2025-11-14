"use client";

import { useState, useEffect, useCallback } from "react";
import { calculateDefault } from "./logic";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import OpenSourceCard from "../../../components/OpenSourceCard";
// import ToolTitle from "../../../components/ToolTitle"; // TODO: Uncomment
// import Theory from "../../../components/Theory"; // TODO: Uncomment

export default function DefaultCalculatorPage() {
  // Input state
  const [inputValue, setInputValue] = useState<string>("0");

  // Results state
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResult(null);
    const valueNum = parseFloat(inputValue);

    if (isNaN(valueNum)) {
      setError("Please enter a valid number.");
      return;
    }

    try {
      const calculatedResult = calculateDefault(valueNum);
      setResult(calculatedResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResult(null);
    }
  }, [inputValue]);

  // useEffect to calculate on input change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      {/* <ToolTitle toolKey="default" /> */} {/* TODO: Uncomment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">Add one to a number</p>

          {/* Input Value */}
          <div className="mb-6">
            <Label htmlFor="input-value">Number</Label>
            <Input
              type="number"
              id="input-value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., 5"
              className="mt-1 block w-full"
            />
          </div>

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
                  <div className="text-foreground font-medium">Result</div>
                  <div className="text-muted-foreground text-sm">{result}</div>
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
