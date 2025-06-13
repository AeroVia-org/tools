"use client";

import { useState, useEffect, useCallback } from "react";
import { calculateNormalShock, calculateFromPitotRatio, NormalShockResult, generateShockTable } from "./logic";
import { FaBolt, FaTable, FaArrowRight } from "react-icons/fa";
import Visualization from "./Visualization";
import Details from "./Details";
import Theory from "./Theory";
import Navigation from "../components/Navigation";

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

  // Results state
  const [results, setResults] = useState<NormalShockResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<NormalShockResult[]>([]);
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

  // Calculate the shock parameters based on inputs
  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);

    try {
      const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

      if (isNaN(gamma) || gamma <= 1) {
        setError("Specific heat ratio must be greater than 1");
        return;
      }

      if (calculationMode === "mach") {
        const machNumber = parseFloat(mach1);

        if (isNaN(machNumber)) {
          setError("Please enter a valid Mach number");
          return;
        }

        if (machNumber <= 1) {
          setError("Mach number must be greater than 1 (supersonic)");
          return;
        }

        const result = calculateNormalShock(machNumber, gamma);
        setResults(result);
      } else {
        // Pitot ratio calculation
        const ratio = parseFloat(pitotRatio);

        if (isNaN(ratio)) {
          setError("Please enter a valid pressure ratio");
          return;
        }

        if (ratio <= 1) {
          setError("Pitot pressure ratio must be greater than 1");
          return;
        }

        const result = calculateFromPitotRatio(ratio, gamma);
        setResults(result);
      }
    } catch {
      setError("Invalid input. Please ensure Mach number is > 1.");
    }
  }, [calculationMode, mach1, pitotRatio, gasType, customGamma]);

  // Generate table data for a range of Mach numbers
  const handleGenerateTable = useCallback(() => {
    try {
      const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

      if (isNaN(gamma) || gamma <= 1) {
        setError("Specific heat ratio must be greater than 1");
        return;
      }

      // Generate table data for Mach numbers 1.1 to 10
      const table = generateShockTable(1.1, 10, 20, gamma);
      setTableData(table);
      setShowTable(!showTable);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  }, [gasType, customGamma, showTable]);

  // Handle Enter key for calculation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  // Calculate on mount and when inputs change
  useEffect(() => {
    handleCalculate();

    // Also update table if it's visible
    if (showTable) {
      try {
        const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

        if (!isNaN(gamma) && gamma > 1) {
          const table = generateShockTable(1.1, 10, 20, gamma);
          setTableData(table);
        }
      } catch {
        // Silently fail - table will use previous values
      }
    }
  }, [handleCalculate, showTable, gasType, customGamma]);

  // Handle visualization hover
  const handleVisualizationHover = (position: "upstream" | "downstream" | "shock" | null) => {
    setHoverPosition(position);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Normal Shock Calculator
      </h1>

      <Navigation
        name="Normal Shock Calculator"
        description="Calculate flow properties across a normal shock wave in supersonic flow."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Input Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Calculate property changes across a normal shock wave in supersonic flow. Normal shocks occur when
            supersonic flow encounters an obstruction, resulting in a sudden change in flow properties.
          </p>

          {/* Calculation Mode Selection */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Calculation Mode</label>
            <div className="flex space-x-4 rounded-md bg-gray-100 p-1 dark:bg-gray-700">
              {(["mach", "pitot"] as CalculationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalculationMode(mode)}
                  className={`w-1/2 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMode === mode
                      ? "bg-white text-blue-700 shadow dark:bg-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
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
              <label htmlFor="gas-type" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Gas
              </label>
              <div className={gasType === "custom" ? "space-y-2" : ""}>
                <select
                  id="gas-type"
                  value={gasType}
                  onChange={(e) => setGasType(e.target.value as GasType)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="air">Air (γ = 1.4)</option>
                  <option value="helium">Helium (γ = 1.667)</option>
                  <option value="argon">Argon (γ = 1.667)</option>
                  <option value="co2">Carbon Dioxide (γ = 1.289)</option>
                  <option value="custom">Custom Gas</option>
                </select>

                {gasType === "custom" && (
                  <div>
                    <label
                      htmlFor="custom-gamma"
                      className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      Specific Heat Ratio (γ)
                    </label>
                    <input
                      type="number"
                      id="custom-gamma"
                      value={customGamma}
                      onChange={(e) => setCustomGamma(e.target.value)}
                      onKeyDown={handleKeyDown}
                      min="1.001"
                      step="0.001"
                      className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Input Fields Section */}
            <div>
              {calculationMode === "mach" ? (
                <div>
                  <label
                    htmlFor="mach-number"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Upstream Mach Number (M₁)
                  </label>
                  <input
                    type="number"
                    id="mach-number"
                    value={mach1}
                    onChange={(e) => setMach1(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="1.001"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="e.g., 2.0"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="pitot-ratio"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Pitot-to-Static Pressure Ratio (p₀₂/p₁)
                  </label>
                  <input
                    type="number"
                    id="pitot-ratio"
                    value={pitotRatio}
                    onChange={(e) => setPitotRatio(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="1.001"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="e.g., 7.0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Show/Hide Table Button */}
          <div className="mb-4 flex flex-wrap gap-4">
            <button
              onClick={handleGenerateTable}
              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <FaTable className="mr-2 h-4 w-4" />
              {showTable ? "Hide Mach Table" : "Show Mach Table"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Static Results Section */}
          {results && (
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">Shock Wave Results</h3>

              {/* Upstream Parameters */}
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-900/20">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <FaArrowRight className="h-3 w-3 text-blue-500" />
                  </div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">Upstream Flow (State 1)</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mach Number (M₁)</div>
                    <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                      {formatNumber(results.mach1, 3)}
                    </div>
                  </div>
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Reference Values</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">p₁, T₁, ρ₁ (reference)</div>
                  </div>
                </div>
              </div>

              {/* Downstream Parameters */}
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900/40 dark:bg-green-900/20">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <FaArrowRight className="h-3 w-3 text-green-500" />
                  </div>
                  <h4 className="font-medium text-green-700 dark:text-green-300">Downstream Flow (State 2)</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mach Number (M₂)</div>
                    <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                      {formatNumber(results.mach2, 3)}
                    </div>
                  </div>
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pressure Ratio (p₂/p₁)</div>
                    <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                      {formatNumber(results.pressureRatio, 3)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Temperature Ratio</div>
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">
                      {formatNumber(results.temperatureRatio, 3)}
                    </div>
                  </div>
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Density Ratio</div>
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">
                      {formatNumber(results.densityRatio, 3)}
                    </div>
                  </div>
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Pressure Ratio</div>
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">
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
                  <h4 className="font-medium text-red-700 dark:text-red-300">Shock Wave Effects</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Pressure Loss</div>
                    <div className="text-lg font-semibold text-red-700 dark:text-red-300">
                      {formatNumber((1 - results.totalPressureRatio) * 100, 2)}%
                    </div>
                  </div>
                  <div className="rounded-md bg-white p-2 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Entropy Change (Δs/R)</div>
                    <div className="text-lg font-semibold text-red-700 dark:text-red-300">
                      {formatNumber(results.entropy, 4)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Panel */}
        <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Normal Shock Visualization</h2>

          <div className="mb-6 w-full">
            <Visualization results={results} onHoverPosition={handleVisualizationHover} />
          </div>

          <div className="mt-2 flex-grow">
            <Details results={results} hoverPosition={hoverPosition} />
          </div>
        </div>
      </div>

      {/* Mach Number Table */}
      {showTable && tableData.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">Normal Shock Properties Table</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    M<sub>1</sub>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    M<sub>2</sub>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    p<sub>2</sub>/p<sub>1</sub>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    T<sub>2</sub>/T<sub>1</sub>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    ρ<sub>2</sub>/ρ<sub>1</sub>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    p<sub>02</sub>/p<sub>01</sub>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {formatNumber(row.mach1, 2)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {formatNumber(row.mach2, 3)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {formatNumber(row.pressureRatio, 3)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {formatNumber(row.temperatureRatio, 3)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {formatNumber(row.densityRatio, 3)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
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
      <Theory />
    </div>
  );
}
