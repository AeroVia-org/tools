"use client";

import { useState, useEffect } from "react";
import { FaExchangeAlt, FaArrowRight, FaCopy, FaCheck } from "react-icons/fa";
import { convertUnit, allCategories, UnitCategory } from "./logic";
import Navigation from "../components/Navigation";

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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Unit Converter
      </h1>

      <Navigation name="Unit Converter" description="Convert between common aerospace measurements" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Select a category and units to convert between common aerospace measurements.
        </p>

        {/* Layout: Category/Units row, then Value/Result row */}
        <div className="space-y-6">
          {/* Row 1: Category, From, To */}
          <div className="flex items-end gap-4">
            {/* Category Selection */}
            <div className="flex-1">
              <label
                htmlFor="category-select"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Category
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as UnitCategory)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {Object.keys(allCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {/* From Unit */}
            <div className="flex-1">
              <label htmlFor="from-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                From
              </label>
              <select
                id="from-unit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {currentUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            {/* Swap Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleSwapUnits}
                title="Swap units"
                disabled={fromUnit === toUnit || !fromUnit || !toUnit}
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-offset-gray-800"
              >
                <FaExchangeAlt className="h-5 w-5" />
                <span className="sr-only">Swap units</span>
              </button>
            </div>
            {/* To Unit */}
            <div className="flex-1">
              <label htmlFor="to-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                To
              </label>
              <select
                id="to-unit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {currentUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Value -> Result */}
          <div className="flex items-end gap-4">
            {/* Input Value */}
            <div className="flex-1">
              <label htmlFor="input-value" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Value
              </label>
              <input
                type="number"
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            {/* Arrow Icon */}
            <div className="flex flex-shrink-0 items-center py-2">
              <FaArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            {/* Result Display */}
            <div className="flex-1">
              <label htmlFor="result-value" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Result
              </label>
              <div className="mt-1 flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <span id="result-value" className="flex-grow sm:text-sm" aria-live="polite">
                  {/* Error and resultValue */}
                  {error && !resultValue ? "---" : formattedResult() || "---"}
                </span>
                {/* Copy Button */}
                <button
                  onClick={handleCopyResult}
                  title={isCopied ? "Copied!" : "Copy result"}
                  disabled={resultValue === null || !!error}
                  className="ml-2 flex-shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500 dark:hover:bg-gray-600 dark:hover:text-gray-300 dark:focus:bg-gray-600 dark:focus:text-gray-300 dark:focus:ring-offset-gray-800"
                  aria-label={isCopied ? "Result copied to clipboard" : "Copy result to clipboard"}
                  aria-disabled={resultValue === null || !!error}
                >
                  {isCopied ? <FaCheck className="h-4 w-4 text-green-500" /> : <FaCopy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 rounded-md bg-red-100 p-3 dark:bg-red-900/30">
            <p className="text-xs font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
