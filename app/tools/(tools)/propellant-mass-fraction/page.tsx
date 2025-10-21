"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
import { FaGasPump, FaBox, FaWeightHanging } from "react-icons/fa";
import Theory from "./theory";
import Visualization from "./visualization";
import { calculatePropellantMassFraction, PropellantMassFractionResult } from "./logic";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

type MassUnit = "kg" | "lb";

// Conversion factors
const KG_TO_LB = 2.20462;
const LB_TO_KG = 1 / KG_TO_LB;

// Helper to format numbers
const formatNumber = (num: number, decimals = 3) => {
  if (isNaN(num)) return "N/A";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export default function PropellantMassFractionPage() {
  // Input state
  const [initialMassValue, setInitialMassValue] = useState<string>("10000");
  const [finalMassValue, setFinalMassValue] = useState<string>("2000");
  const [massUnit, setMassUnit] = useState<MassUnit>("kg");

  // Results state
  const [results, setResults] = useState<PropellantMassFractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);

    const initialMassInput = parseFloat(initialMassValue);
    const finalMassInput = parseFloat(finalMassValue);

    if (isNaN(initialMassInput) || isNaN(finalMassInput)) {
      setError("Please enter valid numbers for both masses.");
      return;
    }

    // Convert inputs to kg for calculation
    const initialMassKg = massUnit === "lb" ? initialMassInput * LB_TO_KG : initialMassInput;
    const finalMassKg = massUnit === "lb" ? finalMassInput * LB_TO_KG : finalMassInput;

    try {
      const calculatedResults = calculatePropellantMassFraction(initialMassKg, finalMassKg);
      setResults(calculatedResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null);
    }
  }, [initialMassValue, finalMassValue, massUnit]);

  // Trigger calculation on initial load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const formattedResults = (() => {
    if (!results) return null;

    const convert = (kg: number) => (massUnit === "lb" ? kg * KG_TO_LB : kg);

    return {
      propellantMassFraction: formatNumber(results.propellantMassFraction, 3),
      propellantMassFractionPercent: formatNumber(results.propellantMassFraction * 100, 1),
      structuralMassFraction: formatNumber(results.structuralMassFraction, 3),
      structuralMassFractionPercent: formatNumber(results.structuralMassFraction * 100, 1),
      initialMass: formatNumber(convert(results.initialMass), 1),
      propellantMass: formatNumber(convert(results.propellantMass), 1),
      structuralMass: formatNumber(convert(results.structuralMass), 1),
    };
  })();

  // Use raw results for visualization props
  const rawResultsForViz = (() => {
    if (!results) return null;
    const convert = (kg: number) => (massUnit === "lb" ? kg * KG_TO_LB : kg);
    return {
      initialMass: convert(results.initialMass),
      propellantMass: convert(results.propellantMass),
      structuralMass: convert(results.structuralMass),
      propellantMassFraction: results.propellantMassFraction,
      structuralMassFraction: results.structuralMassFraction,
      massUnit: massUnit,
    };
  })();

  return (
    <div className="mx-auto pt-0 md:pt-8 pb-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="propellant-mass-fraction" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Column 1: Inputs and Results */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate the propellant mass fraction (PMF), a key performance metric for rockets and spacecraft, based on
            initial (wet) and final (dry) mass.
          </p>

          {/* Input Section */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Initial Mass */}
            <div>
              <Label htmlFor="initial-mass">Initial Mass (Wet)</Label>
              <Input
                type="number"
                id="initial-mass"
                value={initialMassValue}
                onChange={(e) => setInitialMassValue(e.target.value)}
                placeholder="e.g., 10000"
                className="mt-1"
              />
            </div>

            {/* Final Mass */}
            <div>
              <Label htmlFor="final-mass">Final Mass (Dry)</Label>
              <Input
                type="number"
                id="final-mass"
                value={finalMassValue}
                onChange={(e) => setFinalMassValue(e.target.value)}
                placeholder="e.g., 2000"
                className="mt-1"
              />
            </div>

            {/* Unit Selector */}
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={massUnit} onValueChange={(value) => setMassUnit(value as MassUnit)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Results Section */}
          {formattedResults && (
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Results:</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Propellant Mass Fraction */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                  <div>
                    <div className="text-foreground font-medium">Propellant Mass Fraction</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.propellantMassFraction} ({formattedResults.propellantMassFractionPercent}%)
                    </div>
                  </div>
                </div>

                {/* Structural Mass Fraction */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaBox className="mt-1 h-6 w-6 shrink-0 text-orange-600" />
                  <div>
                    <div className="text-foreground font-medium">Structural Mass Fraction</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.structuralMassFraction} ({formattedResults.structuralMassFractionPercent}%)
                    </div>
                  </div>
                </div>

                {/* Mass Values */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaWeightHanging className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Initial Mass</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.initialMass} {massUnit}
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-green-500" />
                  <div>
                    <div className="text-foreground font-medium">Propellant Mass</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.propellantMass} {massUnit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Visualization */}
        <div className="border-border bg-card flex items-center justify-center rounded-lg border p-6 shadow-lg">
          {rawResultsForViz ? (
            <Visualization {...rawResultsForViz} />
          ) : (
            <div className="text-muted-foreground text-center">
              <FaGasPump className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p className="text-lg font-medium">Enter values to see visualization</p>
              <p className="text-sm">The chart will show mass distribution and fractions</p>
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
