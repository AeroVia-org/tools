"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

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

  const formattedResults = (() => {
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
  })();

  const renderInputFields = () => {
    switch (calculationType) {
      case "deltaV":
        return (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Initial Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="initial-mass">Initial Mass</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="initial-mass"
                    type="number"
                    value={initialMass}
                    onChange={(e) => setInitialMass(e.target.value)}
                    placeholder="e.g., 10000"
                  />
                </div>
              </div>

              {/* Final Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="final-mass">Final Mass</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="final-mass"
                    type="number"
                    value={finalMass}
                    onChange={(e) => setFinalMass(e.target.value)}
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>

              {/* Mass Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="mass-unit">Mass Unit</Label>
                <Select value={massUnit} onValueChange={(value) => setMassUnit(value as MassUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Specific Impulse Input */}
              <div>
                <Label htmlFor="specific-impulse">
                  Specific Impulse (I<sub>sp</sub>)
                </Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="specific-impulse"
                    type="number"
                    value={specificImpulse}
                    onChange={(e) => setSpecificImpulse(e.target.value)}
                    placeholder="e.g., 300"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-muted-foreground sm:text-sm">s</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "initialMass":
        return (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Final Mass Input */}
              <div className="col-span-2 sm:col-span-2">
                <Label htmlFor="final-mass">Final Mass</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="final-mass"
                    type="number"
                    value={finalMass}
                    onChange={(e) => setFinalMass(e.target.value)}
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>

              {/* Mass Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="mass-unit">Mass Unit</Label>
                <Select value={massUnit} onValueChange={(value) => setMassUnit(value as MassUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Delta-V Input */}
              <div className="col-span-2 sm:col-span-2">
                <Label htmlFor="delta-v">Delta-V (Δv)</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="delta-v"
                    type="number"
                    value={deltaV}
                    onChange={(e) => setDeltaV(e.target.value)}
                    placeholder="e.g., 3000"
                  />
                </div>
              </div>

              {/* Velocity Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="velocity-unit">Velocity Unit</Label>
                <Select value={velocityUnit} onValueChange={(value) => setVelocityUnit(value as VelocityUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m/s">m/s</SelectItem>
                    <SelectItem value="km/s">km/s</SelectItem>
                    <SelectItem value="km/h">km/h</SelectItem>
                    <SelectItem value="ft/s">ft/s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Specific Impulse Input */}
            <div className="mb-6">
              <Label htmlFor="specific-impulse">
                Specific Impulse (I<sub>sp</sub>)
              </Label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Input
                  id="specific-impulse"
                  type="number"
                  value={specificImpulse}
                  onChange={(e) => setSpecificImpulse(e.target.value)}
                  placeholder="e.g., 300"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-muted-foreground sm:text-sm">s</span>
                </div>
              </div>
            </div>
          </>
        );
      case "specificImpulse":
        return (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Initial Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="initial-mass">Initial Mass</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="initial-mass"
                    type="number"
                    value={initialMass}
                    onChange={(e) => setInitialMass(e.target.value)}
                    placeholder="e.g., 10000"
                  />
                </div>
              </div>

              {/* Final Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="final-mass">Final Mass</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="final-mass"
                    type="number"
                    value={finalMass}
                    onChange={(e) => setFinalMass(e.target.value)}
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>

              {/* Mass Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="mass-unit">Mass Unit</Label>
                <Select value={massUnit} onValueChange={(value) => setMassUnit(value as MassUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Delta-V Input */}
              <div className="col-span-2 sm:col-span-2">
                <Label htmlFor="delta-v">Delta-V (Δv)</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="delta-v"
                    type="number"
                    value={deltaV}
                    onChange={(e) => setDeltaV(e.target.value)}
                    placeholder="e.g., 3000"
                  />
                </div>
              </div>

              {/* Velocity Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="velocity-unit">Velocity Unit</Label>
                <Select value={velocityUnit} onValueChange={(value) => setVelocityUnit(value as VelocityUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m/s">m/s</SelectItem>
                    <SelectItem value="km/s">km/s</SelectItem>
                    <SelectItem value="km/h">km/h</SelectItem>
                    <SelectItem value="ft/s">ft/s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <ToolTitle toolKey="rocket-equation" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate rocket performance using the Tsiolkovsky rocket equation. This equation relates the change in
            velocity (Δv) with the effective exhaust velocity (v<sub>e</sub>) or specific impulse (I<sub>sp</sub>) and
            the mass ratio of the rocket.
          </p>

          {/* Calculation Type Selection */}
          <div className="mb-6">
            <Label className="mb-1">Calculation Type</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {[
                { value: "deltaV", label: "Calculate Δv" },
                { value: "initialMass", label: "Calculate Initial Mass" },
                { value: "specificImpulse", label: "Calculate Isp" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setCalculationType(type.value as CalculationType);
                    setError(null);
                    setResults(null);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationType === type.value
                      ? "bg-card text-primary shadow"
                      : "text-muted-foreground hover:bg-accent"
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
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {formattedResults && (
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Results:</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaTachometerAlt className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Delta-V (Δv)</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.deltaV.ms} m/s / {formattedResults.deltaV.kms} km/s /{" "}
                      {formattedResults.deltaV.kmh} km/h
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaWeight className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Initial Mass</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.initialMass.kg} kg / {formattedResults.initialMass.lb} lb
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaWeight className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Final Mass</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.finalMass.kg} kg / {formattedResults.finalMass.lb} lb
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Propellant Mass</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.propellantMass.kg} kg / {formattedResults.propellantMass.lb} lb
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaRocket className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">
                      Specific Impulse (I<sub>sp</sub>)
                    </div>
                    <div className="text-muted-foreground text-sm">{formattedResults.specificImpulse} seconds</div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaArrowRight className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">
                      Exhaust Velocity (v<sub>e</sub>)
                    </div>
                    <div className="text-muted-foreground text-sm">{formattedResults.exhaustVelocity} m/s</div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaBalanceScale className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">
                      Mass Ratio (m<sub>0</sub>/m<sub>f</sub>)
                    </div>
                    <div className="text-muted-foreground text-sm">{formattedResults.massRatio}</div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaPercent className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Propellant Mass Fraction</div>
                    <div className="text-muted-foreground text-sm">{formattedResults.propellantMassFraction}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <h2 className="text-foreground mb-4 text-xl font-semibold">The Rocket Equation</h2>

          <div className="bg-muted/50 mb-6 rounded-md p-4">
            <div className="text-foreground mb-2 text-center text-xl font-medium">
              Δv = v<sub>e</sub> × ln(m<sub>0</sub>/m<sub>f</sub>)
            </div>
            <div className="text-muted-foreground text-center text-sm">
              Also known as the Tsiolkovsky Rocket Equation
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-foreground mb-2 text-lg font-medium">Where:</h3>
            <ul className="text-muted-foreground space-y-2">
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
            <h3 className="text-foreground mb-2 text-lg font-medium">Key Concepts:</h3>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
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

          <div className="mb-6">
            <h3 className="text-foreground mb-2 text-lg font-medium">Multi-stage Rockets</h3>
            <p className="text-muted-foreground">
              Multi-stage rockets improve delta-v by discarding empty tanks and engines as propellant is used. The total
              delta-v of a multi-stage rocket is the sum of the delta-v of each stage.
            </p>
          </div>
        </div>
      </div>

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
