"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { FaRuler, FaTachometerAlt, FaWater } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { TbArrowsExchange2 } from "react-icons/tb";

import {
  calculateReynoldsNumber,
  calculateReynoldsNumberKinematic,
  FLUID_PROPERTIES,
  ReynoldsNumberResult,
  FluidProperty,
} from "./logic";

import Theory from "./Theory";
import Navigation from "../components/Navigation";

type CalculationMethod = "standard" | "kinematic";
type FlowType = "external" | "internal";
type VelocityUnit = "m/s" | "km/h" | "ft/s" | "knot";
type LengthUnit = "m" | "cm" | "mm" | "in" | "ft";

export default function ReynoldsCalculatorPage() {
  // Input state
  const [velocity, setVelocity] = useState<string>("100");
  const [characteristicLength, setCharacteristicLength] = useState<string>("1");
  const [density, setDensity] = useState<string>("1.225");
  const [dynamicViscosity, setDynamicViscosity] = useState<string>("0.00001789");
  const [kinematicViscosity, setKinematicViscosity] = useState<string>("0.0000146");
  const [fluidType, setFluidType] = useState<string>("air");
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>("standard");
  const [flowType, setFlowType] = useState<FlowType>("external");
  const [velocityUnit, setVelocityUnit] = useState<VelocityUnit>("m/s");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("m");
  const [useCustomFluid, setUseCustomFluid] = useState<boolean>(false);

  // Results state
  const [results, setResults] = useState<ReynoldsNumberResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert velocity to m/s
  const velocityToMs = useCallback((vel: number, unit: VelocityUnit): number => {
    switch (unit) {
      case "km/h":
        return vel / 3.6;
      case "ft/s":
        return vel * 0.3048;
      case "knot":
        return vel * 0.5144;
      default:
        return vel;
    }
  }, []);

  // Convert length to meters
  const lengthToMeters = useCallback((len: number, unit: LengthUnit): number => {
    switch (unit) {
      case "cm":
        return len / 100;
      case "mm":
        return len / 1000;
      case "in":
        return len * 0.0254;
      case "ft":
        return len * 0.3048;
      default:
        return len;
    }
  }, []);

  // Format scientific notation appropriately
  const formatScientific = (num: number): string => {
    if (num === 0) return "0";

    const absNum = Math.abs(num);
    if (absNum < 0.001 || absNum >= 10000) {
      return num.toExponential(4);
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  // Handle fluid selection change
  const handleFluidChange = (fluidKey: string) => {
    const fluid: FluidProperty = FLUID_PROPERTIES[fluidKey as keyof typeof FLUID_PROPERTIES];
    setFluidType(fluidKey);

    if (fluidKey !== "custom") {
      setDensity(fluid.density.toString());
      setDynamicViscosity(fluid.dynamicViscosity.toString());
      setKinematicViscosity(fluid.kinematicViscosity.toString());
      setUseCustomFluid(false);
    } else {
      setUseCustomFluid(true);
    }
  };

  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);
    try {
      // Validate inputs
      if (!velocity || !characteristicLength) {
        throw new Error("Please enter values for velocity and characteristic length.");
      }

      const velocityMs = velocityToMs(parseFloat(velocity), velocityUnit);
      const lengthM = lengthToMeters(parseFloat(characteristicLength), lengthUnit);
      const isInternal = flowType === "internal";

      let result: ReynoldsNumberResult;

      if (calculationMethod === "standard") {
        // Use standard formula (ρvL/μ)
        if (!density || !dynamicViscosity) {
          throw new Error("Please enter values for density and dynamic viscosity.");
        }

        const densityValue = parseFloat(density);
        const viscosityValue = parseFloat(dynamicViscosity);

        if (isNaN(densityValue) || isNaN(viscosityValue)) {
          throw new Error("Please enter valid numbers for density and dynamic viscosity.");
        }

        // Get the fluid name if using preset fluid
        let fluidName = "Custom";
        if (!useCustomFluid) {
          const fluid: FluidProperty = FLUID_PROPERTIES[fluidType as keyof typeof FLUID_PROPERTIES];
          fluidName = fluid.name;
        }

        result = calculateReynoldsNumber(velocityMs, lengthM, densityValue, viscosityValue, isInternal, fluidName);
      } else {
        // Use kinematic formula (vL/ν)
        if (!kinematicViscosity) {
          throw new Error("Please enter a value for kinematic viscosity.");
        }
        const kinViscosityValue = parseFloat(kinematicViscosity);

        if (isNaN(kinViscosityValue)) {
          throw new Error("Please enter a valid number for kinematic viscosity.");
        }

        // Get fluid properties for display
        let fluidName = "Custom";
        let densityValue = 0;
        let viscosityValue = 0;

        if (!useCustomFluid) {
          const fluid: FluidProperty = FLUID_PROPERTIES[fluidType as keyof typeof FLUID_PROPERTIES];
          fluidName = fluid.name;
          densityValue = fluid.density;
          viscosityValue = fluid.dynamicViscosity;
        }

        result = calculateReynoldsNumberKinematic(
          velocityMs,
          lengthM,
          kinViscosityValue,
          fluidName,
          densityValue,
          viscosityValue,
          isInternal,
        );
      }

      setResults(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setResults(null);
    }
  }, [
    velocity,
    characteristicLength,
    density,
    dynamicViscosity,
    kinematicViscosity,
    fluidType,
    calculationMethod,
    flowType,
    velocityUnit,
    lengthUnit,
    useCustomFluid,
    velocityToMs, // dependency
    lengthToMeters, // dependency
  ]);

  // Recalculate when inputs change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]); // Now depends only on the memoized handleCalculate

  // Get fluid options
  const fluidOptions = useMemo(() => {
    return Object.entries(FLUID_PROPERTIES).map(([key, fluid]: [string, FluidProperty]) => ({
      value: key,
      label: fluid.name,
    }));
  }, []);

  // Handle keydown (Enter to calculate)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Reynolds Number Calculator
      </h1>

      <Navigation
        name="Reynolds Number Calculator"
        description="Calculate the Reynolds number for fluid flow, indicating whether the flow is laminar, transitional, or turbulent."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Input Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Calculate the Reynolds number for fluid flow, which determines whether the flow is laminar, transitional, or
            turbulent.
          </p>

          {/* Flow Type Selection */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Flow Type</label>
            <div className="flex space-x-4 rounded-md bg-gray-100 p-1 dark:bg-gray-700">
              {(["external", "internal"] as FlowType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFlowType(type)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    flowType === type
                      ? "bg-white text-blue-700 shadow dark:bg-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {type === "external" ? "External Flow (Airfoil, Body)" : "Internal Flow (Pipe, Duct)"}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Method Selection */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Calculation Method
            </label>
            <div className="flex space-x-4 rounded-md bg-gray-100 p-1 dark:bg-gray-700">
              {(["standard", "kinematic"] as CalculationMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setCalculationMethod(method)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMethod === method
                      ? "bg-white text-blue-700 shadow dark:bg-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {method === "standard" ? "Standard (ρvL/μ)" : "Kinematic (vL/ν)"}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {calculationMethod === "standard"
                ? "Using density (ρ) and dynamic viscosity (μ)"
                : "Using kinematic viscosity (ν = μ/ρ)"}
            </p>
          </div>

          {/* Flow Properties Section */}
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Flow Properties</h3>

            {/* Velocity and Length */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Velocity Input */}
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <label htmlFor="velocity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Velocity
                  </label>
                  <input
                    type="number"
                    id="velocity"
                    value={velocity}
                    onChange={(e) => setVelocity(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="velocity-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Unit
                  </label>
                  <select
                    id="velocity-unit"
                    value={velocityUnit}
                    onChange={(e) => setVelocityUnit(e.target.value as VelocityUnit)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="m/s">m/s</option>
                    <option value="km/h">km/h</option>
                    <option value="ft/s">ft/s</option>
                    <option value="knot">knots</option>
                  </select>
                </div>
              </div>

              {/* Characteristic Length Input */}
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <label
                    htmlFor="characteristic-length"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {flowType === "external" ? "Length" : "Diameter"}
                  </label>
                  <input
                    type="number"
                    id="characteristic-length"
                    value={characteristicLength}
                    onChange={(e) => setCharacteristicLength(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="length-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Unit
                  </label>
                  <select
                    id="length-unit"
                    value={lengthUnit}
                    onChange={(e) => setLengthUnit(e.target.value as LengthUnit)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Fluid Properties Section */}
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Fluid Properties</h3>

            {/* Fluid Selection */}
            <div>
              <label htmlFor="fluid-type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Fluid Type
              </label>
              <select
                id="fluid-type"
                value={fluidType}
                onChange={(e) => handleFluidChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {fluidOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fluid Properties based on calculation method */}
            {calculationMethod === "standard" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Density Input */}
                <div>
                  <label htmlFor="density" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Density (ρ)
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      id="density"
                      value={density}
                      onChange={(e) => setDensity(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={!useCustomFluid}
                      className={`block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                        !useCustomFluid ? "opacity-60" : ""
                      }`}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">kg/m³</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Viscosity Input */}
                <div>
                  <label
                    htmlFor="dynamic-viscosity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Dynamic Viscosity (μ)
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      id="dynamic-viscosity"
                      value={dynamicViscosity}
                      onChange={(e) => setDynamicViscosity(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={!useCustomFluid}
                      className={`block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                        !useCustomFluid ? "opacity-60" : ""
                      }`}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">kg/(m·s)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Kinematic Viscosity Input */}
                <label
                  htmlFor="kinematic-viscosity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Kinematic Viscosity (ν)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    id="kinematic-viscosity"
                    value={kinematicViscosity}
                    onChange={(e) => setKinematicViscosity(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!useCustomFluid}
                    className={`block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                      !useCustomFluid ? "opacity-60" : ""
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">m²/s</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-100 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Reynolds Number Results</h2>

          {results ? (
            <div className="space-y-6">
              {/* Main Result - Reynolds Number */}
              <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-600 dark:bg-gray-700/30">
                <FaTachometerAlt className="mb-2 h-10 w-10 text-blue-600" />
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">Reynolds Number (Re)</h3>
                <div className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatScientific(results.reynoldsNumber)}
                </div>
                <div className="mt-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300">
                  {results.flowRegime} Flow
                </div>
              </div>

              {/* Flow Parameters */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Velocity */}
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaTachometerAlt className="mt-1 h-6 w-6 shrink-0 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Velocity</div>
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      {formatScientific(results.velocity)} m/s
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {formatScientific(results.velocity * 3.6)} km/h ≈ {formatScientific(results.velocity * 1.94384)}{" "}
                      knots
                    </div>
                  </div>
                </div>

                {/* Length */}
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaRuler className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {flowType === "external" ? "Characteristic Length" : "Hydraulic Diameter"}
                    </div>
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      {formatScientific(results.characteristicLength)} m
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {formatScientific(results.characteristicLength * 100)} cm ≈{" "}
                      {formatScientific(results.characteristicLength * 3.28084)} ft
                    </div>
                  </div>
                </div>

                {/* Fluid Properties Header */}
                <div className="col-span-1 mt-2 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Fluid Properties: {results.fluidName}
                  </h3>
                </div>

                {/* Density and Dynamic Viscosity */}
                {calculationMethod === "standard" || !results.usedKinematicFormula ? (
                  <>
                    {/* Density */}
                    <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                      <FaWater className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">Density (ρ)</div>
                        <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                          {formatScientific(results.density)} kg/m³
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Viscosity */}
                    <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                      <MdScience className="mt-1 h-6 w-6 shrink-0 text-red-600" />
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">Dynamic Viscosity (μ)</div>
                        <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                          {formatScientific(results.dynamicViscosity)} kg/(m·s)
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Kinematic Viscosity */}
                <div
                  className={`flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600 ${
                    calculationMethod === "standard" || !results.usedKinematicFormula
                      ? "col-span-1 md:col-span-2"
                      : "col-span-1 md:col-span-2"
                  }`}
                >
                  <TbArrowsExchange2 className="mt-1 h-6 w-6 shrink-0 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Kinematic Viscosity (ν)</div>
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      {formatScientific(results.kinematicViscosity)} m²/s
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">ν = μ/ρ</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400 dark:text-gray-500">
              <p>Enter parameters to calculate Reynolds number</p>
            </div>
          )}
        </div>
      </div>

      {/* Theory Section - Replaced */}
      <Theory />
    </div>
  );
}
