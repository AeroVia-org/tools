"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FaPercentage, FaBox } from "react-icons/fa";
import Theory from "./Theory";
import Visualization from "./Visualization";
import { calculatePropellantMassFraction, PropellantMassFractionResult } from "./logic";
import Navigation from "../components/Navigation";

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

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as MassUnit;
    setMassUnit(newUnit);
    // Let the useEffect handle recalculation
  };

  const formattedResults = useMemo(() => {
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
  }, [results, massUnit]);

  // Use raw results for visualization props
  const rawResultsForViz = useMemo(() => {
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
  }, [results, massUnit]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Propellant Mass Fraction Calculator
      </h1>

      <Navigation
        name="Propellant Mass Fraction Calculator"
        description="Calculate the propellant mass fraction, initial mass, final mass, or propellant mass for a rocket stage."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Column 1: Inputs and Results */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Calculate the propellant mass fraction (PMF), a key performance metric for rockets and spacecraft, based on
            initial (wet) and final (dry) mass.
          </p>

          {/* Input Section */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Initial Mass */}
            <div>
              <label htmlFor="initial-mass" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Initial Mass (Wet)
              </label>
              <input
                type="number"
                id="initial-mass"
                value={initialMassValue}
                onChange={(e) => setInitialMassValue(e.target.value)}
                placeholder="e.g., 10000"
                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Final Mass */}
            <div>
              <label htmlFor="final-mass" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Final Mass (Dry)
              </label>
              <input
                type="number"
                id="final-mass"
                value={finalMassValue}
                onChange={(e) => setFinalMassValue(e.target.value)}
                placeholder="e.g., 2000"
                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Unit Selector */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Unit
              </label>
              <select
                id="unit"
                value={massUnit}
                onChange={handleUnitChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lb">Pounds (lb)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-100 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Results Section */}
          {formattedResults && (
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Results:</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Propellant Mass Fraction */}
                <div className="flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                  <FaPercentage className="mt-1 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-100">Propellant Mass Fraction (PMF)</div>
                    <div className="text-lg font-semibold text-blue-900 dark:text-white">
                      {formattedResults.propellantMassFraction}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      ({formattedResults.propellantMassFractionPercent}%)
                    </div>
                  </div>
                </div>

                {/* Structural Mass Fraction */}
                <div className="flex items-start gap-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-700 dark:bg-orange-900/20">
                  <FaBox className="mt-1 h-6 w-6 shrink-0 text-orange-600 dark:text-orange-400" />
                  <div>
                    <div className="font-medium text-orange-800 dark:text-orange-100">Structural Mass Fraction</div>
                    <div className="text-lg font-semibold text-orange-900 dark:text-white">
                      {formattedResults.structuralMassFraction}
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">
                      ({formattedResults.structuralMassFractionPercent}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Visualization */}
        {rawResultsForViz && <Visualization {...rawResultsForViz} />}
      </div>

      {/* Theory Section */}
      <Theory />
    </div>
  );
}
