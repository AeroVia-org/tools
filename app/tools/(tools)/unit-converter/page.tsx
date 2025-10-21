"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect } from "react";
import { FaExchangeAlt, FaArrowRight, FaCopy, FaCheck } from "react-icons/fa";
import { convertUnit, allCategories, UnitCategory } from "./logic";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

type ResultValue = number | null;

export default function UnitConverterPage() {
  // Input state
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(Object.keys(allCategories)[0] as UnitCategory);
  // Calculate currentUnits directly from selectedCategory
  const currentUnits = allCategories[selectedCategory];

  // Initialize fromUnit and toUnit based on the initial category's units
  const initialUnits = allCategories[selectedCategory];
  const initialFromUnit = initialUnits[0] || "";
  const initialToUnit = initialUnits[1] || initialFromUnit;

  const [fromUnit, setFromUnit] = useState<string>(initialFromUnit);
  const [toUnit, setToUnit] = useState<string>(initialToUnit);

  // Results state
  const [resultValue, setResultValue] = useState<ResultValue>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [isCopied, setIsCopied] = useState(false);

  // Update units and reset input/result/error when category changes
  useEffect(() => {
    const units = allCategories[selectedCategory];
    const firstUnit = units[0] || "";
    const secondUnit = units[1] || firstUnit;
    setFromUnit(firstUnit);
    setToUnit(secondUnit);
    setInputValue("");
    setResultValue(null);
    setError(null);
  }, [selectedCategory]);

  // useEffect for conversion calculation
  useEffect(() => {
    setError(null); // Reset error at the start of each calculation
    const valueNum = parseFloat(inputValue);

    // Don't calculate if input is empty
    if (inputValue.trim() === "") {
      setResultValue(null);
      return;
    }

    if (isNaN(valueNum)) {
      setError("Invalid number");
      setResultValue(null);
      return;
    }

    if (fromUnit === toUnit) {
      setResultValue(valueNum); // No conversion needed
      return;
    }

    try {
      const convertedValue = convertUnit(valueNum, fromUnit, toUnit, selectedCategory);
      setResultValue(convertedValue);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Conversion error");
      }
      setResultValue(null); // Set result to null on error
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  // Handlers
  const handleSwapUnits = () => {
    const currentFrom = fromUnit;
    const currentTo = toUnit;
    setFromUnit(currentTo);
    setToUnit(currentFrom);
  };

  const handleCopyResult = async () => {
    if (resultValue === null || error) return;

    try {
      await navigator.clipboard.writeText(formattedResult());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Formats the result to 6 decimal places
  const formattedResult = () => {
    if (resultValue === null) return "";
    return Number.isInteger(resultValue) ? resultValue.toString() : resultValue.toFixed(6);
  };

  return (
    <div className="mx-auto pt-0 md:pt-8 pb-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="unit-converter" />

      <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
        <p className="text-muted-foreground mb-6">
          Select a category and units to convert between common aerospace measurements.
        </p>

        {/* Layout: Category/Units row, then Value/Result row */}
        <div className="space-y-6">
          {/* Row 1: Category, From, To */}
          <div className="flex items-end gap-4">
            {/* Category Selection */}
            <div className="flex-1">
              <Label htmlFor="category-select" className="mb-1">
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as UnitCategory)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(allCategories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* From Unit */}
            <div className="flex-1">
              <Label htmlFor="from-unit">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Swap Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleSwapUnits}
                title="Swap units"
                disabled={fromUnit === toUnit || !fromUnit || !toUnit}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary focus:ring-offset-background rounded-md p-2 transition focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaExchangeAlt className="h-5 w-5" />
                <span className="sr-only">Swap units</span>
              </button>
            </div>
            {/* To Unit */}
            <div className="flex-1">
              <Label htmlFor="to-unit">To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Value -> Result */}
          <div className="flex items-end gap-4">
            {/* Input Value */}
            <div className="flex-1">
              <Label htmlFor="input-value">Value</Label>
              <Input
                type="number"
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="mt-1 block w-full"
              />
            </div>
            {/* Arrow Icon */}
            <div className="flex flex-shrink-0 items-center py-2">
              <FaArrowRight className="text-muted-foreground h-5 w-5" />
            </div>
            {/* Result Display */}
            <div className="flex-1">
              <Label htmlFor="result-value">Result</Label>
              <div className="border-border bg-card mt-1 flex items-center justify-between rounded-md border px-3 py-2 shadow-sm">
                <span id="result-value" className="flex-grow sm:text-sm" aria-live="polite">
                  {/* Error and resultValue */}
                  {error && !resultValue ? "---" : formattedResult() || "---"}
                </span>
                {/* Copy Button */}
                <button
                  onClick={handleCopyResult}
                  title={isCopied ? "Copied!" : "Copy result"}
                  disabled={resultValue === null || !!error}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ml-2 flex-shrink-0 cursor-pointer rounded p-1 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={isCopied ? "Result copied to clipboard" : "Copy result to clipboard"}
                  aria-disabled={resultValue === null || !!error}
                >
                  {isCopied ? <FaCheck className="text-success h-4 w-4" /> : <FaCopy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 mt-4 rounded-md p-3">
            <p className="text-destructive text-xs font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
