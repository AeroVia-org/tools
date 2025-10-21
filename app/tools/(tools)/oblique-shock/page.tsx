"use client";

//////////////////////////////////////////
// NOT YET COMPLETE, TESTED, OR OPTIMIZED - STILL IN DEVELOPMENT
//////////////////////////////////////////

import { useState, useEffect, useCallback } from "react";
import { FaBolt, FaCalculator, FaInfoCircle } from "react-icons/fa";
import { calculateObliqueShock, ObliqueShockResult, calculateMaxDeflectionAngle } from "./logic";
import Theory from "./theory";
import Visualization from "./visualization";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

// Define gas properties type
type GasType = "air" | "helium" | "argon" | "co2" | "custom";
type ShockSolutionType = "weak" | "strong";

// Gas properties definitions
const GAS_PROPERTIES = {
  air: { name: "Air", gamma: 1.4 },
  helium: { name: "Helium", gamma: 1.667 },
  argon: { name: "Argon", gamma: 1.667 },
  co2: { name: "Carbon Dioxide", gamma: 1.289 },
  custom: { name: "Custom Gas", gamma: 1.4 },
};

export default function ObliqueShockPage() {
  // Input state
  const [upstreamMach, setUpstreamMach] = useState<string>("2.0");
  const [deflectionAngle, setDeflectionAngle] = useState<string>("10"); // degrees
  const [gasType, setGasType] = useState<GasType>("air");
  const [customGamma, setCustomGamma] = useState<string>("1.4");
  const [solutionType, setSolutionType] = useState<ShockSolutionType>("weak");

  // Results state
  const [results, setResults] = useState<ObliqueShockResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayMachAngle, setDisplayMachAngle] = useState<number | null>(null);
  const [displayMaxDeflection, setDisplayMaxDeflection] = useState<number | null>(null);

  // Format number helper
  const formatNumber = (num: number | undefined | null, decimals: number = 4): string => {
    if (num === undefined || num === null || isNaN(num)) return "N/A";
    if (num === 0) return "0";
    // Use exponential for very small or very large numbers, or if it's an extremely small non-zero number
    if ((Math.abs(num) < 0.0001 && num !== 0) || Math.abs(num) > 100000) {
      return num.toExponential(decimals);
    }
    // For general cases, toFixed is fine.
    return num.toFixed(decimals);
  };

  // Calculate flow properties
  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);
    setDisplayMachAngle(null);
    setDisplayMaxDeflection(null);

    try {
      const M1 = parseFloat(upstreamMach);
      const theta = parseFloat(deflectionAngle);
      const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

      if (isNaN(M1) || M1 <= 0) {
        setError("Please enter a valid positive upstream Mach number (M₁).");
        return;
      }
      if (isNaN(theta)) {
        setError("Please enter a valid deflection angle (θ).");
        return;
      }
      if (theta < 0) {
        setError("Deflection angle (θ) must be non-negative.");
        return;
      }
      if (isNaN(gamma) || gamma <= 1) {
        setError("Specific heat ratio (γ) must be greater than 1.");
        return;
      }
      if (M1 <= 1) {
        setError("Upstream Mach number (M₁) must be supersonic (M₁ > 1).");
        return;
      }

      const isWeakSolution = solutionType === "weak";

      // Calculate Mach Angle and Max Deflection Angle
      const machAngleDeg = Math.asin(1 / M1) * (180 / Math.PI);
      setDisplayMachAngle(machAngleDeg);
      const { maxTheta } = calculateMaxDeflectionAngle(M1, gamma);
      setDisplayMaxDeflection(maxTheta);

      const calculatedResults = calculateObliqueShock(M1, theta, gamma, isWeakSolution);
      setResults(calculatedResults);

      if (theta > maxTheta + 0.0001) {
        // Add small tolerance for floating point
        setError(
          `Deflection angle (${formatNumber(theta, 2)}°) exceeds maximum possible (${formatNumber(maxTheta, 2)}°) for M₁=${formatNumber(M1, 2)}. Shock is detached. Results shown are for the detached shock limit if applicable, or may be invalid.`,
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
    }
  }, [upstreamMach, deflectionAngle, gasType, customGamma, solutionType]);

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  // Recalculate when inputs change automatically
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="mx-auto pt-0 md:pt-8 pb-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="oblique-shock" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Inputs Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg lg:col-span-1 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            <FaCalculator className="mr-2 inline h-5 w-5" /> Input Parameters
          </h2>

          <div className="space-y-5">
            {/* Upstream Mach */}
            <div>
              <Label htmlFor="upstream-mach">Upstream Mach Number (M₁)</Label>
              <Input
                type="number"
                id="upstream-mach"
                value={upstreamMach}
                onChange={(e) => setUpstreamMach(e.target.value)}
                onKeyDown={handleKeyDown}
                min="1.0001"
                step="0.01"
                placeholder="e.g., 2.0"
                className="mt-1"
              />
            </div>

            {/* Deflection Angle */}
            <div>
              <Label htmlFor="deflection-angle">
                Deflection Angle (θ) <span className="text-xs text-gray-500 dark:text-gray-400">[degrees]</span>
              </Label>
              <Input
                type="number"
                id="deflection-angle"
                value={deflectionAngle}
                onChange={(e) => setDeflectionAngle(e.target.value)}
                onKeyDown={handleKeyDown}
                min="0"
                step="0.1"
                placeholder="e.g., 10"
                className="mt-1"
              />
            </div>

            {/* Gas Properties */}
            <div>
              <Label htmlFor="gas-type">Gas Type</Label>
              <div className="mt-1 grid grid-cols-1 gap-x-2 gap-y-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Select value={gasType} onValueChange={(value) => setGasType(value as GasType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(GAS_PROPERTIES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name} (γ = {value.gamma})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {gasType === "custom" && (
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="custom-gamma"
                      className="sr-only block text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      Custom γ
                    </label>
                    <Input
                      type="number"
                      id="custom-gamma"
                      value={customGamma}
                      onChange={(e) => setCustomGamma(e.target.value)}
                      onKeyDown={handleKeyDown}
                      min="1.001"
                      step="0.001"
                      placeholder="γ"
                      title="Specific heat ratio (gamma)"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Solution Type (Weak/Strong) */}
            <div>
              <Label>Shock Solution Type</Label>
              <div className="mt-1 grid grid-cols-1 gap-2 rounded-md bg-gray-100 p-2 sm:grid-cols-2 md:grid-cols-1 dark:bg-gray-700">
                {(["weak", "strong"] as ShockSolutionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSolutionType(type)}
                    className={`w-full rounded px-3 py-1.5 text-center text-sm font-medium transition-colors ${
                      solutionType === type
                        ? "bg-blue-600 text-white shadow dark:bg-blue-500"
                        : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type === "weak" ? "Weak Shock" : "Strong Shock"}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                The weak shock solution is generally observed in external aerodynamic flows.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-md bg-red-100 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-700 dark:text-red-200">
                <FaInfoCircle className="mr-1.5 inline h-5 w-5" />
                <span className="font-semibold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results and Visualization Column */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-8">
            {/* Results Panel */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {results ? (
                <div>
                  <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                    Calculation Results{" "}
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      ({solutionType} solution)
                    </span>
                  </h2>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Theoretical limits for M₁={formatNumber(results.upstreamMach, 2)}, γ=
                    {formatNumber(results.gamma, 3)}: Mach Angle (μ) = {formatNumber(displayMachAngle, 2)}°, Max
                    Deflection (θ<sub>max</sub>) = {formatNumber(displayMaxDeflection, 2)}°
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <ResultCard
                      label="Wave Angle (β)"
                      value={`${formatNumber(results.waveAngle, 2)}°`}
                      description="Angle of the shock wave relative to upstream flow"
                    />
                    <ResultCard
                      label="Downstream Mach (M₂)"
                      value={formatNumber(results.downstreamMach, 3)}
                      description={results.downstreamMach < 1 ? "Subsonic" : "Supersonic"}
                    />
                    <ResultCard
                      label="Pressure Ratio (p₂/p₁)"
                      value={formatNumber(results.pressureRatio, 4)}
                      description="Static pressure increase"
                    />
                    <ResultCard
                      label="Temperature Ratio (T₂/T₁)"
                      value={formatNumber(results.temperatureRatio, 4)}
                      description="Static temperature increase"
                    />
                    <ResultCard
                      label="Density Ratio (ρ₂/ρ₁)"
                      value={formatNumber(results.densityRatio, 4)}
                      description="Density increase"
                    />
                    <ResultCard
                      label="Total Pressure Ratio (p₀₂/p₀₁)"
                      value={formatNumber(results.stagnationPressureRatio, 5)}
                      description="Stagnation pressure loss (measure of inefficiency)"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center py-10 text-center">
                  <FaBolt className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Awaiting Calculation</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter parameters and results will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Visualization Panel */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Flow Visualization</h2>
              {results && !error && !isNaN(results.waveAngle) && !isNaN(results.deflectionAngle) ? (
                <Visualization
                  upstreamMach={results.upstreamMach}
                  deflectionAngle={results.deflectionAngle}
                  waveAngle={results.waveAngle}
                  // Responsive width/height can be managed by its container or passed here
                />
              ) : (
                <div className="flex h-[250px] items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    {error ? "Cannot display visualization due to error." : "Enter valid inputs to see visualization."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theory Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}

// Simple Result Card Component
interface ResultCardProps {
  label: string;
  value: string;
  description?: string;
}

const ResultCard = ({ label, value, description }: ResultCardProps) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-700/50">
    <h3 className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</h3>
    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
    {description && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
  </div>
);
