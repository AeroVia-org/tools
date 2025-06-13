"use client";

import { useState, useEffect, useCallback } from "react";
import {
  calculateIsentropicFlow,
  findMachFromPressureRatio,
  findMachFromAreaRatio,
  findMachFromTemperatureRatio,
  generateIsentropicTable,
  IsentropicFlowResult,
} from "./logic";
import { FaWind, FaTable } from "react-icons/fa";
import Theory from "./Theory";
import Navigation from "../components/Navigation";

// Define the input mode type and gas properties
type CalculationMode = "mach" | "pressure" | "temperature" | "area";
type FlowRegime = "subsonic" | "supersonic";
type GasType = "air" | "helium" | "argon" | "co2" | "custom";

// Gas properties definitions
const GAS_PROPERTIES = {
  air: { name: "Air", gamma: 1.4 },
  helium: { name: "Helium", gamma: 1.667 },
  argon: { name: "Argon", gamma: 1.667 },
  co2: { name: "Carbon Dioxide", gamma: 1.289 },
  custom: { name: "Custom Gas", gamma: 1.4 },
};

export default function IsentropicFlowPage() {
  // Input state
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("mach");
  const [mach, setMach] = useState<string>("2.0");
  const [pressureRatio, setPressureRatio] = useState<string>("0.1278");
  const [temperatureRatio, setTemperatureRatio] = useState<string>("0.5556");
  const [areaRatio, setAreaRatio] = useState<string>("1.687");
  const [flowRegime, setFlowRegime] = useState<FlowRegime>("supersonic");
  const [gasType, setGasType] = useState<GasType>("air");
  const [customGamma, setCustomGamma] = useState<string>("1.4");

  // Results state
  const [results, setResults] = useState<IsentropicFlowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IsentropicFlowResult[]>([]);

  // Format number with proper rounding
  const formatNumber = (num: number, decimals: number = 4): string => {
    if (num === 0) return "0";

    if (isNaN(num)) return "N/A";

    // Use scientific notation for very small or large values
    if (Math.abs(num) < 0.001 || Math.abs(num) > 10000) {
      return num.toExponential(decimals);
    }

    return num.toFixed(decimals);
  };

  // Calculate flow properties based on inputs
  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);

    try {
      const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

      if (isNaN(gamma) || gamma <= 1) {
        setError("Specific heat ratio must be greater than 1");
        return;
      }

      let calculatedMach: number;

      // Calculate based on selected mode
      switch (calculationMode) {
        case "mach":
          calculatedMach = parseFloat(mach);

          if (isNaN(calculatedMach)) {
            setError("Please enter a valid Mach number");
            return;
          }

          if (calculatedMach < 0) {
            setError("Mach number must be positive");
            return;
          }
          break;

        case "pressure":
          const pressureValue = parseFloat(pressureRatio);

          if (isNaN(pressureValue)) {
            setError("Please enter a valid pressure ratio");
            return;
          }

          if (pressureValue <= 0 || pressureValue > 1) {
            setError("Pressure ratio must be between 0 and 1");
            return;
          }

          calculatedMach = findMachFromPressureRatio(pressureValue, gamma);
          setMach(formatNumber(calculatedMach, 3));
          break;

        case "temperature":
          const temperatureValue = parseFloat(temperatureRatio);

          if (isNaN(temperatureValue)) {
            setError("Please enter a valid temperature ratio");
            return;
          }

          if (temperatureValue <= 0 || temperatureValue > 1) {
            setError("Temperature ratio must be between 0 and 1");
            return;
          }

          calculatedMach = findMachFromTemperatureRatio(temperatureValue, gamma);
          setMach(formatNumber(calculatedMach, 3));
          break;

        case "area":
          const areaValue = parseFloat(areaRatio);

          if (isNaN(areaValue)) {
            setError("Please enter a valid area ratio");
            return;
          }

          if (areaValue < 1) {
            setError("Area ratio must be greater than or equal to 1");
            return;
          }

          const isSupersonic = flowRegime === "supersonic";
          calculatedMach = findMachFromAreaRatio(areaValue, gamma, isSupersonic);
          setMach(formatNumber(calculatedMach, 3));
          break;

        default:
          calculatedMach = 0;
      }

      // Calculate all isentropic flow properties
      const result = calculateIsentropicFlow(calculatedMach, gamma);
      setResults(result);

      // Update input fields with calculated values for consistency
      setPressureRatio(formatNumber(result.pressureRatio, 6));
      setTemperatureRatio(formatNumber(result.temperatureRatio, 6));
      setAreaRatio(formatNumber(result.areaRatio, 3));
    } catch {
      setError("Invalid input. Please check your values.");
    }
  }, [calculationMode, mach, pressureRatio, temperatureRatio, areaRatio, flowRegime, gasType, customGamma]);

  // Generate table data
  const handleToggleTable = useCallback(() => {
    try {
      if (!showTable) {
        const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

        if (isNaN(gamma) || gamma <= 1) {
          setError("Specific heat ratio must be greater than 1");
          return;
        }

        // Generate table with appropriate ranges
        const table = generateIsentropicTable(0.1, 5.0, 25, gamma);
        setTableData(table);
      }

      setShowTable(!showTable);
    } catch {
      // Silently fail for table updates
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

    // Update table if visible
    if (showTable) {
      try {
        const gamma = gasType === "custom" ? parseFloat(customGamma) : GAS_PROPERTIES[gasType].gamma;

        if (!isNaN(gamma) && gamma > 1) {
          const table = generateIsentropicTable(0.1, 5.0, 25, gamma);
          setTableData(table);
        }
      } catch {
        // Silently fail for table updates
      }
    }
  }, [handleCalculate, showTable, gasType, customGamma]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Isentropic Flow Calculator
      </h1>

      <Navigation
        name="Isentropic Flow Calculator"
        description="Calculate pressure, temperature, and density ratios for isentropic flow given a Mach number and ratio of specific heats (gamma)."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Inputs Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Calculate thermodynamic properties across an isentropic flow. Isentropic flow is a flow process where
            entropy remains constant, which occurs in ideal compressible flow with no heat transfer or friction.
          </p>

          {/* Calculation Mode Selection */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Calculation Mode</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {(["mach", "pressure", "temperature", "area"] as CalculationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalculationMode(mode)}
                  className={`rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMode === mode
                      ? "bg-blue-600 text-white dark:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {mode === "mach"
                    ? "Mach Number"
                    : mode === "pressure"
                      ? "Pressure Ratio"
                      : mode === "temperature"
                        ? "Temperature Ratio"
                        : "Area Ratio"}
                </button>
              ))}
            </div>
          </div>

          {/* Gas Properties */}
          <div className="mb-6">
            <label htmlFor="gas-type" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Gas
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
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
              </div>
              {gasType === "custom" && (
                <div className="md:col-span-1">
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
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Input Fields */}
          <div className="mb-6 space-y-4">
            {/* Mach Number Input */}
            <div>
              <label
                htmlFor="mach-number"
                className={`block text-sm font-medium ${
                  calculationMode === "mach" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                }`}
              >
                Mach Number (M)
              </label>
              <input
                type="number"
                id="mach-number"
                value={mach}
                onChange={(e) => setMach(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={calculationMode !== "mach"}
                className={`mt-1 block w-full rounded-md ${
                  calculationMode === "mach"
                    ? "border-blue-500 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:text-white dark:placeholder-gray-400`}
                placeholder="e.g., 2.0"
              />
            </div>

            {/* Pressure Ratio Input */}
            <div>
              <label
                htmlFor="pressure-ratio"
                className={`block text-sm font-medium ${
                  calculationMode === "pressure"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                Pressure Ratio (p/p₀)
              </label>
              <input
                type="number"
                id="pressure-ratio"
                value={pressureRatio}
                onChange={(e) => setPressureRatio(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={calculationMode !== "pressure"}
                min="0.0001"
                max="1"
                step="0.0001"
                className={`mt-1 block w-full rounded-md ${
                  calculationMode === "pressure"
                    ? "border-blue-500 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:text-white dark:placeholder-gray-400`}
                placeholder="e.g., 0.1278"
              />
            </div>

            {/* Temperature Ratio Input */}
            <div>
              <label
                htmlFor="temperature-ratio"
                className={`block text-sm font-medium ${
                  calculationMode === "temperature"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                Temperature Ratio (T/T₀)
              </label>
              <input
                type="number"
                id="temperature-ratio"
                value={temperatureRatio}
                onChange={(e) => setTemperatureRatio(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={calculationMode !== "temperature"}
                min="0.0001"
                max="1"
                step="0.0001"
                className={`mt-1 block w-full rounded-md ${
                  calculationMode === "temperature"
                    ? "border-blue-500 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:text-white dark:placeholder-gray-400`}
                placeholder="e.g., 0.5556"
              />
            </div>

            {/* Area Ratio Input */}
            <div>
              <label
                htmlFor="area-ratio"
                className={`block text-sm font-medium ${
                  calculationMode === "area" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                }`}
              >
                Area Ratio (A/A*)
              </label>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <input
                    type="number"
                    id="area-ratio"
                    value={areaRatio}
                    onChange={(e) => setAreaRatio(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={calculationMode !== "area"}
                    min="1"
                    step="0.01"
                    className={`mt-1 block w-full rounded-md ${
                      calculationMode === "area"
                        ? "border-blue-500 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:text-white dark:placeholder-gray-400`}
                    placeholder="e.g., 1.687"
                  />
                </div>

                {/* Flow Regime Selection (for area ratio only) */}
                <div className="col-span-2">
                  <select
                    id="flow-regime"
                    value={flowRegime}
                    onChange={(e) => setFlowRegime(e.target.value as FlowRegime)}
                    disabled={calculationMode !== "area"}
                    className={`mt-1 block w-full rounded-md ${
                      calculationMode === "area"
                        ? "border-blue-500 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    } py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:text-white`}
                  >
                    <option value="subsonic">Subsonic</option>
                    <option value="supersonic">Supersonic</option>
                  </select>
                </div>
              </div>
              {calculationMode === "area" && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Note: Area ratio has two solutions. Select the flow regime you need.
                </p>
              )}
            </div>
          </div>

          {/* Show Table Button */}
          <div className="mb-6 flex justify-start">
            <button
              onClick={handleToggleTable}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <FaTable className="mr-2 h-4 w-4" />
              {showTable ? "Hide Mach Table" : "Show Mach Table"}
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-100 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {results ? (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Isentropic Flow Results:</h2>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Mach Number */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                  <h3 className="mb-2 text-lg font-medium text-blue-800 dark:text-blue-300">Mach Number</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(results.mach, 3)}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {results.mach < 1 ? "Subsonic" : "Supersonic"} flow
                  </p>
                </div>

                {/* Area Ratio */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
                  <h3 className="mb-2 text-lg font-medium text-green-800 dark:text-green-300">Area Ratio</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {results.mach === 0 ? "∞" : results.mach === 1 ? "1.000" : formatNumber(results.areaRatio, 3)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">A/A* (ratio to sonic throat)</p>
                </div>

                {/* Pressure Ratio */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
                  <h3 className="mb-2 text-lg font-medium text-red-800 dark:text-red-300">Pressure Ratio</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(results.pressureRatio, 4)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">p/p₀ (static to stagnation)</p>
                </div>

                {/* Temperature Ratio */}
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/40 dark:bg-purple-900/20">
                  <h3 className="mb-2 text-lg font-medium text-purple-800 dark:text-purple-300">Temperature Ratio</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(results.temperatureRatio, 4)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">T/T₀ (static to stagnation)</p>
                </div>

                {/* Density Ratio */}
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/40 dark:bg-indigo-900/20">
                  <h3 className="mb-2 text-lg font-medium text-indigo-800 dark:text-indigo-300">Density Ratio</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(results.densityRatio, 4)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ρ/ρ₀ (static to stagnation)</p>
                </div>

                {/* Pitot Pressure Ratio */}
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/40 dark:bg-orange-900/20">
                  <h3 className="mb-2 text-lg font-medium text-orange-800 dark:text-orange-300">
                    Pitot Pressure Ratio
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(results.pitotPressureRatio, 4)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">p₀₂/p₀ (for supersonic with shock)</p>
                </div>
              </div>

              {/* Additional Results */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {results.mach >= 1 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Mach Angle</h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formatNumber(results.machAngle, 2)}°
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">μ = sin⁻¹(1/M) - Angle of Mach wave</p>
                  </div>
                )}

                {results.mach >= 1 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Prandtl-Meyer Angle</h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formatNumber(results.prandtlMeyerAngle, 2)}°
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      ν - Maximum turning angle for isentropic expansion
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
                  <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Specific Heat Ratio (γ)</h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(results.gamma, 3)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Gas: {GAS_PROPERTIES[gasType as GasType].name}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <FaWind className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Isentropic Flow Results</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter values and select calculation mode to compute isentropic flow properties.
              </p>
            </div>
          )}

          {/* Mach Number Table */}
          {showTable && tableData.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                Isentropic Flow Properties Table
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        M
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        p/p₀
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        T/T₀
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        ρ/ρ₀
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        A/A*
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {tableData.map((row, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                      >
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                          {formatNumber(row.mach, 2)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                          {formatNumber(row.pressureRatio, 4)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                          {formatNumber(row.temperatureRatio, 4)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                          {formatNumber(row.densityRatio, 4)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">
                          {row.mach === 0 ? "∞" : formatNumber(row.areaRatio, 3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theory Section - Replaced */}
      <Theory />
    </div>
  );
}
