"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState } from "react";
import { calculateNormalShock, calculateFromPitotRatio, NormalShockResult, generateShockTable } from "./logic";
import { FaBolt, FaTable, FaArrowRight } from "react-icons/fa";
import Visualization from "./visualization";
import Details from "./details";
import Theory from "../../components/Theory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

// Define the input mode type
type CalculationMode = "mach" | "pitot";
type GasType = "air" | "helium" | "argon" | "co2" | "custom";

// Define gas properties
const GAS_PROPERTIES = {
  air: { name: "Air", gamma: 1.4 },
  helium: { name: "Helium", gamma: 1.667 },
  argon: { name: "Argon", gamma: 1.667 },
  co2: { name: "Carbon Dioxide", gamma: 1.289 },
  custom: { name: "Custom Gas", gamma: 1.4 },
};

export default function NormalShockPage() {
  // Input state
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("mach");
  const [mach1, setMach1] = useState<string>("2.0");
  const [pitotRatio, setPitotRatio] = useState<string>("7.0");
  const [gasType, setGasType] = useState<GasType>("air");
  const [customGamma, setCustomGamma] = useState<string>("1.4");

  // UI state
  const [showTable, setShowTable] = useState<boolean>(false);
  const [hoverPosition, setHoverPosition] = useState<"upstream" | "downstream" | "shock" | null>(null);

  // Format number to fixed decimal places with proper rounding
  const formatNumber = (num: number, decimals: number = 4): string => {
    if (num === 0) return "0";

    // Check if number is very small - use scientific notation for very small values
    if (Math.abs(num) < 0.001) {
      return num.toExponential(decimals);
    }

    return num.toFixed(decimals);
  };

  // Generate table data for a range of Mach numbers
  const handleGenerateTable = () => {
    setShowTable(!showTable);
  };

  // Derived calculation from inputs (no effect-driven state)
  const { results, error }: { results: NormalShockResult | null; error: string | null } = ((): {
    results: NormalShockResult | null;
    error: string | null;
  } => {
    try {
      const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

      if (isNaN(gamma) || gamma <= 1) {
        return {
          results: null,
          error: "Specific heat ratio must be greater than 1",
        };
      }

      if (calculationMode === "mach") {
        const machNumber = parseFloat(mach1);

        if (isNaN(machNumber)) {
          return { results: null, error: "Please enter a valid Mach number" };
        }
        if (machNumber <= 1) {
          return {
            results: null,
            error: "Mach number must be greater than 1 for normal shock",
          };
        }

        const calculatedResults = calculateNormalShock(machNumber, gamma);
        return { results: calculatedResults, error: null };
      } else {
        // Pitot ratio calculation
        const ratio = parseFloat(pitotRatio);

        if (isNaN(ratio)) {
          return {
            results: null,
            error: "Please enter a valid pitot pressure ratio",
          };
        }
        if (ratio <= 1) {
          return {
            results: null,
            error: "Pitot pressure ratio must be greater than 1",
          };
        }

        const calculatedResults = calculateFromPitotRatio(ratio, gamma);
        return { results: calculatedResults, error: null };
      }
    } catch (err) {
      if (err instanceof Error) {
        return { results: null, error: err.message };
      }
      return {
        results: null,
        error: "Invalid input. Please ensure Mach number is > 1.",
      };
    }
  })();

  // Update table data when visible and inputs change
  const tableDataDerived: NormalShockResult[] = (() => {
    if (!showTable) return [];
    try {
      const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;
      if (isNaN(gamma) || gamma <= 1) return [];
      return generateShockTable(1.1, 10, 20, gamma);
    } catch {
      return [];
    }
  })();

  // Handle visualization hover
  const handleVisualizationHover = (position: "upstream" | "downstream" | "shock" | null) => {
    setHoverPosition(position);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <ToolTitle toolKey="normal-shock" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Panel */}
        <div className="border-border bg-card rounded-lg border p-4 shadow-lg sm:p-6">
          <p className="text-muted-foreground mb-4">
            Calculate property changes across a normal shock wave in supersonic flow. Normal shocks occur when
            supersonic flow encounters an obstruction, resulting in a sudden change in flow properties.
          </p>

          {/* Calculation Mode Selection */}
          <div className="mb-4">
            <Label className="mb-1">Calculation Mode</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {(["mach", "pitot"] as CalculationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalculationMode(mode)}
                  className={`w-1/2 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMode === mode
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {mode === "mach" ? "Mach Number" : "Pitot Pressure"}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Grid - Gas Properties and Input Fields Side by Side */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Gas Properties Section */}
            <div>
              <Label htmlFor="gas-type" className="mb-1">
                Gas
              </Label>
              <div className={gasType === "custom" ? "space-y-2" : ""}>
                <Select value={gasType} onValueChange={(value) => setGasType(value as GasType)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air">Air (γ = 1.4)</SelectItem>
                    <SelectItem value="helium">Helium (γ = 1.667)</SelectItem>
                    <SelectItem value="argon">Argon (γ = 1.667)</SelectItem>
                    <SelectItem value="co2">Carbon Dioxide (γ = 1.289)</SelectItem>
                    <SelectItem value="custom">Custom Gas</SelectItem>
                  </SelectContent>
                </Select>

                {gasType === "custom" && (
                  <div>
                    <Label htmlFor="custom-gamma" className="mb-1 text-xs">
                      Specific Heat Ratio (γ)
                    </Label>
                    <Input
                      type="number"
                      id="custom-gamma"
                      value={customGamma}
                      onChange={(e) => setCustomGamma(e.target.value)}
                      min="1.001"
                      step="0.001"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Input Fields Section */}
            <div>
              {calculationMode === "mach" ? (
                <div>
                  <Label htmlFor="mach-number" className="mb-1">
                    Upstream Mach Number (M₁)
                  </Label>
                  <Input
                    type="number"
                    id="mach-number"
                    value={mach1}
                    onChange={(e) => setMach1(e.target.value)}
                    min="1.001"
                    step="0.01"
                    placeholder="e.g., 2.0"
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="pitot-ratio" className="mb-1">
                    Pitot-to-Static Pressure Ratio (p₀₂/p₁)
                  </Label>
                  <Input
                    type="number"
                    id="pitot-ratio"
                    value={pitotRatio}
                    onChange={(e) => setPitotRatio(e.target.value)}
                    min="1.001"
                    step="0.1"
                    placeholder="e.g., 7.0"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Show/Hide Table Button */}
          <div className="mb-4 flex flex-wrap gap-4">
            <button
              onClick={handleGenerateTable}
              className="border-border bg-card text-card-foreground hover:bg-accent focus:ring-primary inline-flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <FaTable className="mr-2 h-4 w-4" />
              {showTable ? "Hide Mach Table" : "Show Mach Table"}
            </button>
          </div>

          {error && (
            <div className="bg-destructive/10 mb-4 rounded-md p-3">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Static Results Section */}
          {results && (
            <div className="mt-6">
              <h3 className="text-foreground mb-4 text-lg font-medium">Shock Wave Results</h3>

              {/* Upstream Parameters */}
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-900/20">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <FaArrowRight className="h-3 w-3 text-blue-500" />
                  </div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Upstream Flow (State 1)</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Mach Number (M₁)</div>
                    <div className="text-foreground text-lg font-semibold">{formatNumber(results.mach1, 3)}</div>
                  </div>
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Reference Values</div>
                    <div className="text-foreground text-sm">p₁, T₁, ρ₁ (reference)</div>
                  </div>
                </div>
              </div>

              {/* Downstream Parameters */}
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900/40 dark:bg-green-900/20">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <FaArrowRight className="h-3 w-3 text-green-500" />
                  </div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Downstream Flow (State 2)</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Mach Number (M₂)</div>
                    <div className="text-foreground text-lg font-semibold">{formatNumber(results.mach2, 3)}</div>
                  </div>
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Pressure Ratio (p₂/p₁)</div>
                    <div className="text-foreground text-lg font-semibold">
                      {formatNumber(results.pressureRatio, 3)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Temperature Ratio</div>
                    <div className="text-foreground text-sm font-medium">
                      {formatNumber(results.temperatureRatio, 3)}
                    </div>
                  </div>
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Density Ratio</div>
                    <div className="text-foreground text-sm font-medium">{formatNumber(results.densityRatio, 3)}</div>
                  </div>
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Total Pressure Ratio</div>
                    <div className="text-foreground text-sm font-medium">
                      {formatNumber(results.totalPressureRatio, 3)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Entropy and Loss Parameters */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-900/20">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <FaBolt className="h-3 w-3 text-red-500" />
                  </div>
                  <h4 className="font-medium text-red-800 dark:text-red-300">Shock Wave Effects</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Total Pressure Loss</div>
                    <div className="text-foreground text-lg font-semibold">
                      {formatNumber((1 - results.totalPressureRatio) * 100, 2)}%
                    </div>
                  </div>
                  <div className="bg-card rounded-md p-2">
                    <div className="text-muted-foreground text-xs">Entropy Change (Δs/R)</div>
                    <div className="text-foreground text-lg font-semibold">{formatNumber(results.entropy, 4)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Panel */}
        <div className="border-border bg-card flex flex-col rounded-lg border p-4 shadow-lg sm:p-6">
          <h2 className="text-foreground mb-4 text-xl font-semibold">Normal Shock Visualization</h2>

          <div className="mb-6 w-full">
            <Visualization results={results} onHoverPosition={handleVisualizationHover} />
          </div>

          <div className="mt-2 flex-grow">
            <Details results={results} hoverPosition={hoverPosition} />
          </div>
        </div>
      </div>

      {/* Mach Number Table */}
      {showTable && tableDataDerived.length > 0 && (
        <div className="border-border bg-card mt-6 rounded-lg border p-4 shadow-lg sm:p-6">
          <h3 className="text-foreground mb-4 text-lg font-medium">Normal Shock Properties Table</h3>
          <div className="border-border overflow-x-auto rounded-lg border">
            <table className="divide-border min-w-full divide-y">
              <thead className="bg-muted">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    M<sub>1</sub>
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    M<sub>2</sub>
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    p<sub>2</sub>/p<sub>1</sub>
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    T<sub>2</sub>/T<sub>1</sub>
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    ρ<sub>2</sub>/ρ<sub>1</sub>
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    p<sub>02</sub>/p<sub>01</sub>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border bg-card divide-y">
                {tableDataDerived.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-card" : "bg-muted"}>
                    <td className="text-foreground px-4 py-3 text-sm whitespace-nowrap">
                      {formatNumber(row.mach1, 2)}
                    </td>
                    <td className="text-foreground px-4 py-3 text-sm whitespace-nowrap">
                      {formatNumber(row.mach2, 3)}
                    </td>
                    <td className="text-foreground px-4 py-3 text-sm whitespace-nowrap">
                      {formatNumber(row.pressureRatio, 3)}
                    </td>
                    <td className="text-foreground px-4 py-3 text-sm whitespace-nowrap">
                      {formatNumber(row.temperatureRatio, 3)}
                    </td>
                    <td className="text-foreground px-4 py-3 text-sm whitespace-nowrap">
                      {formatNumber(row.densityRatio, 3)}
                    </td>
                    <td className="text-foreground px-4 py-3 text-sm whitespace-nowrap">
                      {formatNumber(row.totalPressureRatio, 4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Theory Section - Replaced */}
      <Theory toolKey="normal-shock" />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
