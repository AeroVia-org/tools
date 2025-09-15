"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useEffect, useState } from "react";
import { FaExchangeAlt, FaArrowRight, FaCopy, FaCheck } from "react-icons/fa";
import { convertDistance, astronomicalUnits, AstronomicalUnit } from "./logic";
import Navigation from "../../components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

type ResultValue = number | null;

export default function AstronomicalUnitConverterPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<AstronomicalUnit>(astronomicalUnits[0]);
  const [toUnit, setToUnit] = useState<AstronomicalUnit>(astronomicalUnits[1]);

  const [resultValue, setResultValue] = useState<ResultValue>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setError(null);
    const numeric = parseFloat(inputValue);
    if (inputValue.trim() === "") {
      setResultValue(null);
      return;
    }
    if (isNaN(numeric)) {
      setError("Invalid number");
      setResultValue(null);
      return;
    }
    if (fromUnit === toUnit) {
      setResultValue(numeric);
      return;
    }
    try {
      const converted = convertDistance(numeric, fromUnit, toUnit);
      setResultValue(converted);
    } catch (e) {
      setResultValue(null);
      setError(e instanceof Error ? e.message : "Conversion error");
    }
  }, [inputValue, fromUnit, toUnit]);

  const handleSwapUnits = () => {
    const f = fromUnit;
    setFromUnit(toUnit);
    setToUnit(f);
  };

  const handleCopyResult = async () => {
    if (resultValue === null || error) return;
    try {
      await navigator.clipboard.writeText(formattedResult());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const formattedResult = () => {
    if (resultValue === null) return "";
    return Number.isInteger(resultValue)
      ? resultValue.toString()
      : resultValue
          .toPrecision(10)
          .replace(/\.0+$/, "")
          .replace(/(\.\d*?)0+($|e)/, "$1$2");
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="astronomical-unit-converter" />

      <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
        <p className="text-muted-foreground mb-6">
          Convert distances commonly used in astronomy and orbital mechanics. This tool uses precise IAU constants for
          AU, light‑year, parsec, and mean lunar distance.
        </p>

        <div className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="from-unit" className="text-foreground block text-sm font-medium">
                From
              </label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as AstronomicalUnit)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {astronomicalUnits.map((u: AstronomicalUnit) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={handleSwapUnits}
                title="Swap units"
                disabled={fromUnit === toUnit}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary focus:ring-offset-background rounded-md p-2 transition focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaExchangeAlt className="h-5 w-5" />
                <span className="sr-only">Swap units</span>
              </button>
            </div>

            <div className="flex-1">
              <label htmlFor="to-unit" className="text-foreground block text-sm font-medium">
                To
              </label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as AstronomicalUnit)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {astronomicalUnits.map((u: AstronomicalUnit) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="input-value" className="text-foreground block text-sm font-medium">
                Value
              </label>
              <Input
                type="number"
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex flex-shrink-0 items-center py-2">
              <FaArrowRight className="text-muted-foreground h-5 w-5" />
            </div>

            <div className="flex-1">
              <label htmlFor="result-value" className="text-foreground block text-sm font-medium">
                Result
              </label>
              <div className="border-border bg-card mt-1 flex items-center justify-between rounded-md border px-3 py-2 shadow-sm">
                <span id="result-value" className="flex-grow sm:text-sm" aria-live="polite">
                  {error && !resultValue ? "---" : formattedResult() || "---"}
                </span>
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

        {error && (
          <div className="bg-destructive/10 mt-4 rounded-md p-3">
            <p className="text-destructive text-xs font-medium">{error}</p>
          </div>
        )}

        <div className="text-muted-foreground mt-6 text-xs">
          <p>Constants used:</p>
          <ul className="list-disc pl-5">
            <li>1 AU = 149,597,870,700 m (IAU 2012)</li>
            <li>1 ly = 9.4607304725808e15 m</li>
            <li>1 pc = 3.0856775814913673e16 m</li>
            <li>1 LD (mean Earth–Moon distance) = 384,400,000 m</li>
          </ul>
        </div>
      </div>

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
