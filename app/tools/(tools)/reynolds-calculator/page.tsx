"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
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

import Theory from "./theory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

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
  const fluidOptions = (() => {
    return Object.entries(FLUID_PROPERTIES).map(([key, fluid]: [string, FluidProperty]) => ({
      value: key,
      label: fluid.name,
    }));
  })();

  // Handle keydown (Enter to calculate)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  return (
    <div className="mx-auto py-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="reynolds-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate the Reynolds number for fluid flow, which determines whether the flow is laminar, transitional, or
            turbulent.
          </p>

          {/* Flow Type Selection */}
          <div className="mb-6">
            <Label className="mb-1">Flow Type</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {(["external", "internal"] as FlowType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFlowType(type)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    flowType === type ? "bg-card text-primary shadow" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {type === "external" ? "External Flow (Airfoil, Body)" : "Internal Flow (Pipe, Duct)"}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Method Selection */}
          <div className="mb-6">
            <Label className="mb-1">Calculation Method</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {(["standard", "kinematic"] as CalculationMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setCalculationMethod(method)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMethod === method
                      ? "bg-card text-primary shadow"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {method === "standard" ? "Standard (ρvL/μ)" : "Kinematic (vL/ν)"}
                </button>
              ))}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {calculationMethod === "standard"
                ? "Using density (ρ) and dynamic viscosity (μ)"
                : "Using kinematic viscosity (ν = μ/ρ)"}
            </p>
          </div>

          {/* Flow Properties Section */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Flow Properties</h3>

            {/* Velocity and Length */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Velocity Input */}
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <Label htmlFor="velocity">Velocity</Label>
                  <Input
                    type="number"
                    id="velocity"
                    value={velocity}
                    onChange={(e) => setVelocity(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="velocity-unit">Unit</Label>
                  <Select value={velocityUnit} onValueChange={(value) => setVelocityUnit(value as VelocityUnit)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m/s">m/s</SelectItem>
                      <SelectItem value="km/h">km/h</SelectItem>
                      <SelectItem value="ft/s">ft/s</SelectItem>
                      <SelectItem value="knot">knots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Characteristic Length Input */}
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <Label htmlFor="characteristic-length">{flowType === "external" ? "Length" : "Diameter"}</Label>
                  <Input
                    type="number"
                    id="characteristic-length"
                    value={characteristicLength}
                    onChange={(e) => setCharacteristicLength(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="length-unit">Unit</Label>
                  <Select value={lengthUnit} onValueChange={(value) => setLengthUnit(value as LengthUnit)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Fluid Properties Section */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Fluid Properties</h3>

            {/* Fluid Selection */}
            <div>
              <Label htmlFor="fluid-type">Fluid Type</Label>
              <Select value={fluidType} onValueChange={(value) => handleFluidChange(value)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fluidOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fluid Properties based on calculation method */}
            {calculationMethod === "standard" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Density Input */}
                <div>
                  <Label htmlFor="density">Density (ρ)</Label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <Input
                      type="number"
                      id="density"
                      value={density}
                      onChange={(e) => setDensity(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={!useCustomFluid}
                      className={`mt-1 ${!useCustomFluid ? "opacity-60" : ""}`}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-muted-foreground sm:text-sm">kg/m³</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Viscosity Input */}
                <div>
                  <Label htmlFor="dynamic-viscosity">Dynamic Viscosity (μ)</Label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <Input
                      type="number"
                      id="dynamic-viscosity"
                      value={dynamicViscosity}
                      onChange={(e) => setDynamicViscosity(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={!useCustomFluid}
                      className={`mt-1 ${!useCustomFluid ? "opacity-60" : ""}`}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-muted-foreground sm:text-sm">kg/(m·s)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Kinematic Viscosity Input */}
                <Label htmlFor="kinematic-viscosity">Kinematic Viscosity (ν)</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    type="number"
                    id="kinematic-viscosity"
                    value={kinematicViscosity}
                    onChange={(e) => setKinematicViscosity(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!useCustomFluid}
                    className={`mt-1 ${!useCustomFluid ? "opacity-60" : ""}`}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-muted-foreground sm:text-sm">m²/s</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <h2 className="text-foreground mb-6 text-lg font-semibold">Reynolds Number Results</h2>

          {results ? (
            <div className="space-y-6">
              {/* Main Result - Reynolds Number */}
              <div className="border-border bg-muted/50 flex flex-col items-center rounded-lg border p-6 text-center">
                <FaTachometerAlt className="mb-2 h-10 w-10 text-blue-600" />
                <h3 className="text-foreground text-xl font-medium">Reynolds Number (Re)</h3>
                <div className="text-primary mt-1 text-3xl font-bold">{formatScientific(results.reynoldsNumber)}</div>
                <div className="border-primary/20 bg-primary/10 text-primary mt-2 inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium">
                  {results.flowRegime} Flow
                </div>
              </div>

              {/* Flow Parameters */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Velocity */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaTachometerAlt className="mt-1 h-6 w-6 shrink-0 text-purple-600" />
                  <div>
                    <div className="text-foreground font-medium">Velocity</div>
                    <div className="text-foreground text-base font-semibold">
                      {formatScientific(results.velocity)} m/s
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {formatScientific(results.velocity * 3.6)} km/h ≈ {formatScientific(results.velocity * 1.94384)}{" "}
                      knots
                    </div>
                  </div>
                </div>

                {/* Length */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaRuler className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                  <div>
                    <div className="text-foreground font-medium">
                      {flowType === "external" ? "Characteristic Length" : "Hydraulic Diameter"}
                    </div>
                    <div className="text-foreground text-base font-semibold">
                      {formatScientific(results.characteristicLength)} m
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {formatScientific(results.characteristicLength * 100)} cm ≈{" "}
                      {formatScientific(results.characteristicLength * 3.28084)} ft
                    </div>
                  </div>
                </div>

                {/* Fluid Properties Header */}
                <div className="col-span-1 mt-2 md:col-span-2">
                  <h3 className="text-foreground text-lg font-medium">Fluid Properties: {results.fluidName}</h3>
                </div>

                {/* Density and Dynamic Viscosity */}
                {calculationMethod === "standard" || !results.usedKinematicFormula ? (
                  <>
                    {/* Density */}
                    <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                      <FaWater className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                      <div>
                        <div className="text-foreground font-medium">Density (ρ)</div>
                        <div className="text-foreground text-base font-semibold">
                          {formatScientific(results.density)} kg/m³
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Viscosity */}
                    <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                      <MdScience className="mt-1 h-6 w-6 shrink-0 text-red-600" />
                      <div>
                        <div className="text-foreground font-medium">Dynamic Viscosity (μ)</div>
                        <div className="text-foreground text-base font-semibold">
                          {formatScientific(results.dynamicViscosity)} kg/(m·s)
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Kinematic Viscosity */}
                <div
                  className={`border-border flex items-start gap-4 rounded-lg border p-4 ${
                    calculationMethod === "standard" || !results.usedKinematicFormula
                      ? "col-span-1 md:col-span-2"
                      : "col-span-1 md:col-span-2"
                  }`}
                >
                  <TbArrowsExchange2 className="mt-1 h-6 w-6 shrink-0 text-yellow-600" />
                  <div>
                    <div className="text-foreground font-medium">Kinematic Viscosity (ν)</div>
                    <div className="text-foreground text-base font-semibold">
                      {formatScientific(results.kinematicViscosity)} m²/s
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">ν = μ/ρ</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-48 items-center justify-center">
              <p>Enter parameters to calculate Reynolds number</p>
            </div>
          )}
        </div>
      </div>

      {/* Theory Section - Replaced */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
