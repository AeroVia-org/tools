"use client";

import { useState, useEffect, useCallback } from "react";
import { FaRocket, FaTachometerAlt, FaExchangeAlt, FaChartLine, FaInfoCircle } from "react-icons/fa";

import {
  convertSpecificImpulse,
  getCommonSpecificImpulseValues,
  SpecificImpulseResult,
  SpecificImpulseUnit,
} from "./logic";
import Theory from "./theory";
import Navigation from "../../components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

// Helper to format numbers with appropriate precision
const formatNumber = (num: number, decimals: number = 3): string => {
  if (isNaN(num)) return "N/A";
  if (Math.abs(num) < 0.001) {
    return num.toExponential(decimals);
  }
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export default function SpecificImpulseConverterPage() {
  // Input state
  const [inputValue, setInputValue] = useState<string>("350");
  const [inputUnit, setInputUnit] = useState<SpecificImpulseUnit>("seconds");

  // Results state
  const [results, setResults] = useState<SpecificImpulseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get common values for quick reference
  const commonValues = getCommonSpecificImpulseValues();

  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);

    try {
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        throw new Error("Please enter a valid number.");
      }

      const calculatedResults = convertSpecificImpulse(value, inputUnit);
      setResults(calculatedResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null);
    }
  }, [inputValue, inputUnit]);

  // Recalculate when inputs change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // Handle quick selection from common values
  const handleQuickSelect = (value: number, unit: SpecificImpulseUnit) => {
    setInputValue(value.toString());
    setInputUnit(unit);
    setError(null);
    setResults(null);
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="specific-impulse-converter" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Panel */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Convert specific impulse values between seconds, meters per second, feet per second, and kilometers per
            second. Specific impulse is a key metric for evaluating rocket engine efficiency.
          </p>

          {/* Input Section */}
          <div className="mb-6">
            <Label htmlFor="input-value">Specific Impulse Value</Label>
            <div className="mt-1 flex gap-2">
              <Input
                type="number"
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., 350"
                className="flex-1"
              />
              <Select value={inputUnit} onValueChange={(value) => setInputUnit(value as SpecificImpulseUnit)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">seconds</SelectItem>
                  <SelectItem value="m/s">m/s</SelectItem>
                  <SelectItem value="ft/s">ft/s</SelectItem>
                  <SelectItem value="km/s">km/s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="mb-6">
            <h3 className="text-foreground mb-3 text-lg font-medium">Quick Reference</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {commonValues.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSelect(item.value, item.unit)}
                  className="border-border bg-muted hover:bg-accent cursor-pointer rounded-md border p-3 text-left text-sm transition-colors"
                >
                  <div className="font-medium">{item.application}</div>
                  <div className="text-muted-foreground text-xs">
                    {item.value} {item.unit}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <h2 className="text-foreground mb-6 text-lg font-semibold">Conversion Results</h2>

          {results ? (
            <div className="space-y-6">
              {/* Performance Category */}
              <div className="border-border bg-muted/50 flex flex-col items-center rounded-lg border p-6 text-center">
                <FaRocket className="mb-2 h-10 w-10 text-blue-600" />
                <h3 className="text-foreground text-xl font-medium">Performance Category</h3>
                <div className={`mt-1 text-2xl font-bold ${results.performanceColor}`}>
                  {results.performanceCategory}
                </div>
                <div className="text-muted-foreground mt-2 text-sm">{results.typicalApplications.join(", ")}</div>
              </div>

              {/* Conversion Results */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Seconds */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaTachometerAlt className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                  <div>
                    <div className="text-foreground font-medium">Seconds</div>
                    <div className="text-foreground text-lg font-semibold">{formatNumber(results.seconds, 1)} s</div>
                    <div className="text-muted-foreground text-xs">Standard unit</div>
                  </div>
                </div>

                {/* Meters per Second */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaExchangeAlt className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                  <div>
                    <div className="text-foreground font-medium">Effective Exhaust Velocity</div>
                    <div className="text-foreground text-lg font-semibold">
                      {formatNumber(results.metersPerSecond, 1)} m/s
                    </div>
                    <div className="text-muted-foreground text-xs">Meters per second</div>
                  </div>
                </div>

                {/* Feet per Second */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaChartLine className="mt-1 h-6 w-6 shrink-0 text-purple-600" />
                  <div>
                    <div className="text-foreground font-medium">Feet per Second</div>
                    <div className="text-foreground text-lg font-semibold">
                      {formatNumber(results.feetPerSecond, 1)} ft/s
                    </div>
                    <div className="text-muted-foreground text-xs">Imperial velocity</div>
                  </div>
                </div>

                {/* Kilometers per Second */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaInfoCircle className="mt-1 h-6 w-6 shrink-0 text-orange-600" />
                  <div>
                    <div className="text-foreground font-medium">Kilometers per Second</div>
                    <div className="text-foreground text-lg font-semibold">
                      {formatNumber(results.kilometersPerSecond, 3)} km/s
                    </div>
                    <div className="text-muted-foreground text-xs">High-speed units</div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-border bg-muted/30 rounded-lg border p-4">
                <h3 className="text-foreground mb-3 text-lg font-medium">Additional Calculations</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground text-sm">Thrust per Mass Flow</div>
                    <div className="text-foreground font-semibold">
                      {formatNumber(results.thrustPerMassFlow, 1)} N/(kg/s)
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Input Value</div>
                    <div className="text-foreground font-semibold">
                      {formatNumber(results.inputValue, 3)} {results.inputUnit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-48 items-center justify-center">
              <div className="text-center">
                <FaRocket className="mx-auto mb-4 h-16 w-16 opacity-50" />
                <p className="text-lg font-medium">Enter a specific impulse value</p>
                <p className="text-sm">Use the quick reference or input your own value</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theory Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
