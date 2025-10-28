"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
import { FaTachometerAlt, FaPlaneDeparture, FaCheck, FaTimes } from "react-icons/fa";

import { calculateTWR, calculateRequiredThrust, calculateMaximumMass, TWRResult } from "./logic";
import Theory from "./theory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

type CalculationType = "twr" | "thrust" | "mass";
type ThrustUnit = "N" | "lbf" | "kgf";
type MassUnit = "kg" | "lb";

// Conversion factors
const LBF_TO_N = 4.44822;
const KGF_TO_N = 9.80665;
const LB_TO_KG = 0.45359237;

export default function TWRCalculatorPage() {
  // Input state
  const [calculationType, setCalculationType] = useState<CalculationType>("twr");
  const [thrust, setThrust] = useState<string>("100000");
  const [mass, setMass] = useState<string>("10000");
  const [twr, setTWR] = useState<string>("1.0");
  const [thrustUnit, setThrustUnit] = useState<ThrustUnit>("N");
  const [massUnit, setMassUnit] = useState<MassUnit>("kg");

  // Results state
  const [results, setResults] = useState<TWRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert thrust to Newtons
  const thrustToNewtons = useCallback((thrustValue: number, unit: ThrustUnit): number => {
    switch (unit) {
      case "lbf":
        return thrustValue * LBF_TO_N;
      case "kgf":
        return thrustValue * KGF_TO_N;
      default:
        return thrustValue;
    }
  }, []);

  // Convert mass to kg
  const massToKg = useCallback((massValue: number, unit: MassUnit): number => {
    switch (unit) {
      case "lb":
        return massValue * LB_TO_KG;
      default:
        return massValue;
    }
  }, []);

  const handleCalculateCallback = useCallback(() => {
    setError(null);
    setResults(null);

    try {
      let calculatedResults: TWRResult;

      switch (calculationType) {
        case "twr":
          const thrustN = thrustToNewtons(parseFloat(thrust), thrustUnit);
          const massKg = massToKg(parseFloat(mass), massUnit);
          if (isNaN(thrustN) || isNaN(massKg)) {
            throw new Error("Please enter valid numbers for thrust and mass.");
          }
          calculatedResults = calculateTWR(thrustN, massKg);
          break;
        case "thrust":
          const twrValue = parseFloat(twr);
          const massForThrust = massToKg(parseFloat(mass), massUnit);
          if (isNaN(twrValue) || isNaN(massForThrust)) {
            throw new Error("Please enter valid numbers for TWR and mass.");
          }
          calculatedResults = calculateRequiredThrust(twrValue, massForThrust);
          break;
        case "mass":
          const thrustForMass = thrustToNewtons(parseFloat(thrust), thrustUnit);
          const twrForMass = parseFloat(twr);
          if (isNaN(thrustForMass) || isNaN(twrForMass)) {
            throw new Error("Please enter valid numbers for thrust and TWR.");
          }
          calculatedResults = calculateMaximumMass(thrustForMass, twrForMass);
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
  }, [thrust, mass, twr, thrustUnit, massUnit, calculationType, thrustToNewtons, massToKg]);

  useEffect(() => {
    handleCalculateCallback();
  }, [handleCalculateCallback]);

  const formattedResults = (() => {
    if (!results) return null;

    // Convert results back to display units
    const convertThrust = (n: number): { [key in ThrustUnit]: string } => ({
      N: n.toFixed(0),
      lbf: (n / LBF_TO_N).toFixed(0),
      kgf: (n / KGF_TO_N).toFixed(0),
    });

    const convertMass = (kg: number): { [key in MassUnit]: string } => ({
      kg: kg.toFixed(0),
      lb: (kg / LB_TO_KG).toFixed(0),
    });

    return {
      twr: results.twr.toFixed(3),
      thrust: convertThrust(results.thrust),
      weight: convertThrust(results.weight),
      mass: convertMass(results.mass),
      thrustPerMass: results.thrustPerMass.toFixed(2),
      isCapableOfVerticalFlight: results.isCapableOfVerticalFlight,
      flightCapability: results.flightCapability,
      flightCapabilityColor: results.flightCapabilityColor,
    };
  })();

  const renderInputFields = () => {
    switch (calculationType) {
      case "twr":
        return (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Thrust Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="thrust">Thrust</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="thrust"
                    type="number"
                    value={thrust}
                    onChange={(e) => setThrust(e.target.value)}
                    placeholder="e.g., 100000"
                  />
                </div>
              </div>

              {/* Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="mass">Mass</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="mass"
                    type="number"
                    value={mass}
                    onChange={(e) => setMass(e.target.value)}
                    placeholder="e.g., 10000"
                  />
                </div>
              </div>

              {/* Thrust Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="thrust-unit">Thrust Unit</Label>
                <Select value={thrustUnit} onValueChange={(value) => setThrustUnit(value as ThrustUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">Newton (N)</SelectItem>
                    <SelectItem value="lbf">Pound-force (lbf)</SelectItem>
                    <SelectItem value="kgf">Kilogram-force (kgf)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Mass Unit Selector */}
              <div>
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
          </>
        );
      case "thrust":
        return (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* TWR Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="twr">Desired TWR</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="twr"
                    type="number"
                    value={twr}
                    onChange={(e) => setTWR(e.target.value)}
                    placeholder="e.g., 1.5"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Mass Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="mass">Mass</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="mass"
                    type="number"
                    value={mass}
                    onChange={(e) => setMass(e.target.value)}
                    placeholder="e.g., 10000"
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
          </>
        );
      case "mass":
        return (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Thrust Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="thrust">Thrust</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="thrust"
                    type="number"
                    value={thrust}
                    onChange={(e) => setThrust(e.target.value)}
                    placeholder="e.g., 100000"
                  />
                </div>
              </div>

              {/* TWR Input */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="twr">Desired TWR</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    id="twr"
                    type="number"
                    value={twr}
                    onChange={(e) => setTWR(e.target.value)}
                    placeholder="e.g., 1.5"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Thrust Unit Selector */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="thrust-unit">Thrust Unit</Label>
                <Select value={thrustUnit} onValueChange={(value) => setThrustUnit(value as ThrustUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">Newton (N)</SelectItem>
                    <SelectItem value="lbf">Pound-force (lbf)</SelectItem>
                    <SelectItem value="kgf">Kilogram-force (kgf)</SelectItem>
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
    <div className="mx-auto py-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="twr-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate the Thrust-to-Weight Ratio (TWR) for aircraft or rockets. TWR determines whether a vehicle can
            achieve vertical flight and provides insight into acceleration capabilities.
          </p>

          {/* Calculation Type Selection */}
          <div className="mb-6">
            <Label className="mb-1">Calculation Type</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {[
                { id: "twr", label: "Calculate TWR" },
                { id: "thrust", label: "Calculate Required Thrust" },
                { id: "mass", label: "Calculate Maximum Mass" },
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
                    <div className="text-foreground font-medium">Thrust-to-Weight Ratio</div>
                    <div className="text-muted-foreground text-sm">{formattedResults.twr}</div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaPlaneDeparture className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Flight Capability</div>
                    <div className={`text-sm ${formattedResults.flightCapabilityColor}`}>
                      {formattedResults.flightCapability}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Flight Capability Indicator */}
              <div className="mt-4">
                <div
                  className={`rounded-md p-4 ${
                    formattedResults.isCapableOfVerticalFlight
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {formattedResults.isCapableOfVerticalFlight ? (
                      <FaCheck className="text-success h-8 w-8" />
                    ) : (
                      <FaTimes className="text-warning h-8 w-8" />
                    )}
                    <span className="font-medium">
                      {formattedResults.isCapableOfVerticalFlight
                        ? "Capable of Vertical Flight"
                        : "Cannot Achieve Vertical Flight"}
                    </span>
                  </div>
                  <p className="mt-1 text-center text-sm">
                    {formattedResults.isCapableOfVerticalFlight
                      ? "This vehicle can hover and accelerate vertically upward."
                      : "This vehicle requires horizontal motion for lift (like airplanes)."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <h2 className="text-foreground mb-4 text-xl font-semibold">Thrust-to-Weight Ratio</h2>

          <div className="bg-muted/50 mb-6 rounded-md p-4">
            <div className="text-foreground mb-2 text-center text-xl font-medium">TWR = T / W = T / (m × g)</div>
            <div className="text-muted-foreground text-center text-sm">
              Where T is thrust, W is weight, m is mass, and g is gravity
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-foreground mb-2 text-lg font-medium">Where:</h3>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-center">
                <span className="mr-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  TWR
                </span>
                <span>Thrust-to-Weight Ratio (dimensionless)</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  T
                </span>
                <span>Thrust force produced by the engine</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  W
                </span>
                <span>Weight of the vehicle (mass × gravity)</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  m
                </span>
                <span>Mass of the vehicle</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  g
                </span>
                <span>Gravitational acceleration (9.80665 m/s² on Earth)</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-foreground mb-2 text-lg font-medium">TWR Guidelines:</h3>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
              <li>
                <strong>TWR &gt; 1:</strong> Vehicle can hover and accelerate vertically (rockets, helicopters)
              </li>
              <li>
                <strong>TWR = 1:</strong> Vehicle can hover but cannot accelerate vertically
              </li>
              <li>
                <strong>TWR &lt; 1:</strong> Vehicle requires horizontal motion for lift (airplanes)
              </li>
              <li>Rockets typically need TWR &gt; 1.2 at liftoff to overcome gravity and drag</li>
              <li>Aircraft typically have TWR &lt; 0.5, relying on aerodynamic lift</li>
              <li>Higher TWR provides better acceleration but requires more fuel</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-foreground mb-2 text-lg font-medium">Typical TWR Values:</h3>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
              <li>
                <strong>Commercial Aircraft:</strong> 0.2 - 0.4
              </li>
              <li>
                <strong>Military Aircraft:</strong> 0.5 - 1.0
              </li>
              <li>
                <strong>Helicopters:</strong> 1.1 - 1.5
              </li>
              <li>
                <strong>Rockets (Liftoff):</strong> 1.2 - 2.0
              </li>
              <li>
                <strong>Space Shuttle:</strong> ~1.5
              </li>
              <li>
                <strong>Saturn V:</strong> ~1.2
              </li>
            </ul>
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
