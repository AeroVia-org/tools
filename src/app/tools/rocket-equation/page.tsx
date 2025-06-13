"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  FaRocket,
  FaBalanceScale,
  FaWeight,
  FaArrowRight,
  FaTachometerAlt,
  FaGasPump,
  FaPercent,
} from "react-icons/fa";

import { calculateDeltaV, calculateInitialMass, calculateRequiredSpecificImpulse, RocketEquationResult } from "./logic";
import Navigation from "../components/Navigation";

type CalculationType = "deltaV" | "initialMass" | "specificImpulse";
type MassUnit = "kg" | "lb";
type VelocityUnit = "m/s" | "km/s" | "km/h" | "ft/s";

export default function RocketEquationPage() {
  // Input state
  const [calculationType, setCalculationType] = useState<CalculationType>("deltaV");
  const [initialMass, setInitialMass] = useState<string>("10000");
  const [finalMass, setFinalMass] = useState<string>("5000");
  const [specificImpulse, setSpecificImpulse] = useState<string>("300");
  const [deltaV, setDeltaV] = useState<string>("3000");
  const [massUnit, setMassUnit] = useState<MassUnit>("kg");
  const [velocityUnit, setVelocityUnit] = useState<VelocityUnit>("m/s");

  // Results state
  const [results, setResults] = useState<RocketEquationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculateCallback = useCallback(() => {
    setError(null);
    setResults(null);

    try {
      // Convert inputs to numbers
      let massInitial = parseFloat(initialMass);
      let massFinal = parseFloat(finalMass);
      const isp = parseFloat(specificImpulse);
      let dv = parseFloat(deltaV);

      // Unit conversions
      if (massUnit === "lb") {
        // Convert pounds to kg
        if (!isNaN(massInitial)) massInitial *= 0.45359237;
        if (!isNaN(massFinal)) massFinal *= 0.45359237;
      }

      if (velocityUnit !== "m/s") {
        // Convert to m/s
        if (!isNaN(dv)) {
          switch (velocityUnit) {
            case "km/s":
              dv *= 1000;
              break;
            case "km/h":
              dv /= 3.6;
              break;
            case "ft/s":
              dv *= 0.3048;
              break;
          }
        }
      }

      let calculatedResults: RocketEquationResult;

      switch (calculationType) {
        case "deltaV":
          if (isNaN(massInitial) || isNaN(massFinal) || isNaN(isp)) {
            throw new Error("Please enter valid numbers for initial mass, final mass, and specific impulse.");
          }
          calculatedResults = calculateDeltaV(massInitial, massFinal, isp);
          break;
        case "initialMass":
          if (isNaN(massFinal) || isNaN(dv) || isNaN(isp)) {
            throw new Error("Please enter valid numbers for final mass, delta-v, and specific impulse.");
          }
          calculatedResults = calculateInitialMass(massFinal, dv, isp);
          break;
        case "specificImpulse":
          if (isNaN(massInitial) || isNaN(massFinal) || isNaN(dv)) {
            throw new Error("Please enter valid numbers for initial mass, final mass, and delta-v.");
          }
          calculatedResults = calculateRequiredSpecificImpulse(massInitial, massFinal, dv);
          break;
        default:
          throw new Error("Invalid calculation type selected.");
      }

      setResults(calculatedResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null);
    }
  }, [initialMass, finalMass, specificImpulse, deltaV, massUnit, velocityUnit, calculationType]);

  useEffect(() => {
    handleCalculateCallback();
  }, [handleCalculateCallback]);

  const formattedResults = useMemo(() => {
    if (!results) return null;

    // Format numbers for display
    return {
      deltaV: {
        ms: results.deltaV.toFixed(2),
        kms: (results.deltaV / 1000).toFixed(4),
        kmh: (results.deltaV * 3.6).toFixed(0),
      },
      initialMass: {
        kg: results.initialMass.toFixed(2),
        lb: (results.initialMass / 0.45359237).toFixed(2),
      },
      finalMass: {
        kg: results.finalMass.toFixed(2),
        lb: (results.finalMass / 0.45359237).toFixed(2),
      },
      specificImpulse: results.specificImpulse.toFixed(1),
      exhaustVelocity: results.exhaustVelocity.toFixed(2),
      massRatio: results.massRatio.toFixed(3),
      propellantMass: {
        kg: results.propellantMass.toFixed(2),
        lb: (results.propellantMass / 0.45359237).toFixed(2),
      },
      propellantMassFraction: (results.propellantMassFraction * 100).toFixed(2), // Convert to percentage
    };
  }, [results]);

  const renderInputFields = () => {
    switch (calculationType) {
      case "deltaV":
        return (
          <>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Initial Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="initial-mass" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Initial Mass
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="initial-mass"
                    type="number"
                    value={initialMass}
                    onChange={(e) => setInitialMass(e.target.value)}
                    placeholder="e.g., 10000"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Final Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="final-mass" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Final Mass
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="final-mass"
                    type="number"
                    value={finalMass}
                    onChange={(e) => setFinalMass(e.target.value)}
                    placeholder="e.g., 5000"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Mass Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="mass-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mass Unit
                </label>
                <select
                  id="mass-unit"
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value as MassUnit)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="lb">Pound (lb)</option>
                </select>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Specific Impulse Input */}
              <div>
                <label
                  htmlFor="specific-impulse"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Specific Impulse (I<sub>sp</sub>)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="specific-impulse"
                    type="number"
                    value={specificImpulse}
                    onChange={(e) => setSpecificImpulse(e.target.value)}
                    placeholder="e.g., 300"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">s</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "initialMass":
        return (
          <>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Final Mass Input */}
              <div className="col-span-2 sm:col-span-2">
                <label htmlFor="final-mass" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Final Mass
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="final-mass"
                    type="number"
                    value={finalMass}
                    onChange={(e) => setFinalMass(e.target.value)}
                    placeholder="e.g., 5000"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Mass Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="mass-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mass Unit
                </label>
                <select
                  id="mass-unit"
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value as MassUnit)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="lb">Pound (lb)</option>
                </select>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Delta-V Input */}
              <div className="col-span-2 sm:col-span-2">
                <label htmlFor="delta-v" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Delta-V (Δv)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="delta-v"
                    type="number"
                    value={deltaV}
                    onChange={(e) => setDeltaV(e.target.value)}
                    placeholder="e.g., 3000"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Velocity Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="velocity-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Velocity Unit
                </label>
                <select
                  id="velocity-unit"
                  value={velocityUnit}
                  onChange={(e) => setVelocityUnit(e.target.value as VelocityUnit)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                >
                  <option value="m/s">meters/second (m/s)</option>
                  <option value="km/s">kilometers/second (km/s)</option>
                  <option value="km/h">kilometers/hour (km/h)</option>
                  <option value="ft/s">feet/second (ft/s)</option>
                </select>
              </div>
            </div>

            {/* Specific Impulse Input */}
            <div className="mb-4">
              <label htmlFor="specific-impulse" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Specific Impulse (I<sub>sp</sub>)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  id="specific-impulse"
                  type="number"
                  value={specificImpulse}
                  onChange={(e) => setSpecificImpulse(e.target.value)}
                  placeholder="e.g., 300"
                  className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">s</span>
                </div>
              </div>
            </div>
          </>
        );
      case "specificImpulse":
        return (
          <>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Initial Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="initial-mass" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Initial Mass
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="initial-mass"
                    type="number"
                    value={initialMass}
                    onChange={(e) => setInitialMass(e.target.value)}
                    placeholder="e.g., 10000"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Final Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="final-mass" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Final Mass
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="final-mass"
                    type="number"
                    value={finalMass}
                    onChange={(e) => setFinalMass(e.target.value)}
                    placeholder="e.g., 5000"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Mass Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="mass-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mass Unit
                </label>
                <select
                  id="mass-unit"
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value as MassUnit)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="lb">Pound (lb)</option>
                </select>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Delta-V Input */}
              <div className="col-span-2 sm:col-span-2">
                <label htmlFor="delta-v" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Delta-V (Δv)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="delta-v"
                    type="number"
                    value={deltaV}
                    onChange={(e) => setDeltaV(e.target.value)}
                    placeholder="e.g., 3000"
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Velocity Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="velocity-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Velocity Unit
                </label>
                <select
                  id="velocity-unit"
                  value={velocityUnit}
                  onChange={(e) => setVelocityUnit(e.target.value as VelocityUnit)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                >
                  <option value="m/s">meters/second (m/s)</option>
                  <option value="km/s">kilometers/second (km/s)</option>
                  <option value="km/h">kilometers/hour (km/h)</option>
                  <option value="ft/s">feet/second (ft/s)</option>
                </select>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Rocket Equation Calculator
      </h1>

      <Navigation
        name="Rocket Equation Calculator"
        description="Estimate rocket delta-v, initial mass, or required specific impulse using the Tsiolkovsky rocket equation."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Calculate rocket performance using the Tsiolkovsky rocket equation. This equation relates the change in
            velocity (Δv) with the effective exhaust velocity (v<sub>e</sub>) or specific impulse (I<sub>sp</sub>) and
            the mass ratio of the rocket.
          </p>

          {/* Calculation Type Selection */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Calculation Type</label>
            <div className="flex space-x-4 rounded-md bg-gray-100 p-1 dark:bg-gray-700">
              {[
                { id: "deltaV", label: "Calculate Δv" },
                { id: "initialMass", label: "Calculate Initial Mass" },
                { id: "specificImpulse", label: "Calculate Isp" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setCalculationType(type.id as CalculationType);
                    setError(null);
                    setResults(null);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationType === type.id
                      ? "bg-white text-blue-700 shadow dark:bg-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          {renderInputFields()}

          {error && (
            <div className="mb-6 rounded-md bg-red-100 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {formattedResults && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Results:</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaTachometerAlt className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Delta-V (Δv)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.deltaV.ms} m/s / {formattedResults.deltaV.kms} km/s /{" "}
                      {formattedResults.deltaV.kmh} km/h
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaWeight className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Initial Mass</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.initialMass.kg} kg / {formattedResults.initialMass.lb} lb
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaWeight className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Final Mass</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.finalMass.kg} kg / {formattedResults.finalMass.lb} lb
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Propellant Mass</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.propellantMass.kg} kg / {formattedResults.propellantMass.lb} lb
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaRocket className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      Specific Impulse (I<sub>sp</sub>)
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.specificImpulse} seconds
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaArrowRight className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      Exhaust Velocity (v<sub>e</sub>)
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.exhaustVelocity} m/s
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaBalanceScale className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      Mass Ratio (m<sub>0</sub>/m<sub>f</sub>)
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formattedResults.massRatio}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaPercent className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Propellant Mass Fraction</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.propellantMassFraction}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">The Rocket Equation</h2>

          <div className="mb-6 rounded-md bg-gray-50 p-4 dark:bg-gray-700/30">
            <div className="mb-2 text-center text-xl font-medium text-gray-800 dark:text-gray-100">
              Δv = v<sub>e</sub> × ln(m<sub>0</sub>/m<sub>f</sub>)
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Also known as the Tsiolkovsky Rocket Equation
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-100">Where:</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  Δv
                </span>
                <span>Delta-v: maximum change in velocity that the rocket can achieve</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  v<sub>e</sub>
                </span>
                <span>
                  Effective exhaust velocity of the propellant (v<sub>e</sub> = I<sub>sp</sub> × g<sub>0</sub>)
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  I<sub>sp</sub>
                </span>
                <span>Specific impulse of the propellant</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  g<sub>0</sub>
                </span>
                <span>Standard gravity at Earth&apos;s surface (9.80665 m/s²)</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  m<sub>0</sub>
                </span>
                <span>Initial total mass, including propellant</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  m<sub>f</sub>
                </span>
                <span>Final total mass without propellant</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  ln
                </span>
                <span>Natural logarithm</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-100">Key Concepts:</h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-300">
              <li>
                The rocket equation demonstrates that achieving higher delta-v requires either higher exhaust velocity
                (better propellant) or a higher mass ratio.
              </li>
              <li>
                Mass ratio is limited by structural requirements - a rocket needs structure to hold the propellant.
              </li>
              <li>
                Specific impulse is a measure of propellant efficiency - higher values mean more efficient propellant.
              </li>
              <li>For chemical rockets, typical specific impulse values range from ~250-450 seconds.</li>
              <li>For ion/electric propulsion, specific impulse can exceed 3000 seconds.</li>
            </ul>
          </div>

          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
            <h3 className="mb-2 text-lg font-medium text-blue-800 dark:text-blue-200">Multi-stage Rockets</h3>
            <p className="text-blue-700 dark:text-blue-300">
              Multi-stage rockets improve delta-v by discarding empty tanks and engines as propellant is used. The total
              delta-v of a multi-stage rocket is the sum of the delta-v of each stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
