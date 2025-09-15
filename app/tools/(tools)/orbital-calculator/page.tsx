"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useCallback, useEffect } from "react";
import { FaSatellite, FaClock, FaTachometerAlt } from "react-icons/fa";
import { calculateOrbitalProperties, OrbitalResult } from "./logic";
import { MtoMi, MitoM, KmtoM, MtoKm, MStoKMS } from "@/lib/conversions";
import Visualization, { OrbitalDetailPoint } from "./visualization";
import Details from "./details";
import Theory from "./theory";
import Navigation from "../../components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

type AltitudeUnit = "km" | "mi";
type InputType = "altitude" | "distance";

// TODO: Support multiple planets and custom parameters
// Currently only supports Earth with fixed parameters. Should add:
// - Planet selection dropdown (Earth, Mars, Moon, etc.)
// - Custom planet parameters (mass, radius, gravitational constant)
// - Ability to input custom orbital body characteristics
// This would make the tool more versatile for different mission scenarios

// Earth radius in km - used for conversion between altitude and distance from center
const EARTH_RADIUS_KM = 6371;

// Helper to format seconds into HH:MM:SS or Days H:M:S
const formatPeriod = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "N/A";

  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const secs = Math.round(seconds); // Round seconds

  let result = "";
  if (days > 0) {
    result += `${days}d `;
  }
  result += `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  if (days > 0) {
    result += " (H:M:S)";
  } else {
    result += " (HH:MM:SS)";
  }

  return result;
};

export default function OrbitalCalculatorPage() {
  // Input state
  const [inputValue, setInputValue] = useState<string>("400"); // Default LEO altitude
  const [altitudeUnit, setAltitudeUnit] = useState<AltitudeUnit>("km");
  const [inputType, setInputType] = useState<InputType>("altitude");

  // Results state
  const [results, setResults] = useState<OrbitalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [interactiveHoverPoint, setInteractiveHoverPoint] = useState<OrbitalDetailPoint | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    const valueNum = parseFloat(inputValue);

    if (isNaN(valueNum)) {
      setError("Please enter a valid number for altitude.");
      return;
    }
    if (valueNum < 0) {
      setError("Altitude must be a non-negative value.");
      return;
    }

    try {
      let altitudeKm: number;

      if (inputType === "altitude") {
        // Input is altitude
        altitudeKm = altitudeUnit === "mi" ? MtoKm(MitoM(valueNum)) : valueNum;
      } else {
        // Input is distance from center
        const distanceKm = altitudeUnit === "mi" ? MtoKm(MitoM(valueNum)) : valueNum;
        altitudeKm = distanceKm - EARTH_RADIUS_KM;

        // Basic validation for distance input
        if (distanceKm < EARTH_RADIUS_KM) {
          setError(`Distance from center cannot be less than Earth's radius (${EARTH_RADIUS_KM} km).`);
          setResults(null);
          return;
        }
      }

      const calculatedResults = calculateOrbitalProperties(altitudeKm);
      setResults(calculatedResults);
    } catch (err) {
      if (err instanceof Error) {
        // Catch specific errors from logic if needed, e.g., altitude too low
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null);
    }
  }, [inputValue, altitudeUnit, inputType]);

  // Calculate whenever input values or unit changes
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // Format results for display
  const formattedResults = (() => {
    if (!results) return null;
    return {
      altitudeKm: results.altitudeKm.toFixed(1),
      altitudeMi: MtoMi(KmtoM(results.altitudeKm)).toFixed(1),
      velocityMs: results.velocityMs.toFixed(2),
      velocityKms: MStoKMS(results.velocityMs).toFixed(3),
      velocityMiS: MtoMi(results.velocityMs).toFixed(3),
      periodS: results.periodS.toFixed(0),
      periodFormatted: formatPeriod(results.periodS),
    };
  })();

  const getInputPlaceholder = () => {
    if (inputType === "altitude") {
      return altitudeUnit === "km" ? "e.g., 400 (LEO)" : "e.g., 249 (LEO)";
    } else {
      // Distance from center placeholders
      return altitudeUnit === "km" ? "e.g., 6771 (LEO)" : "e.g., 4208 (LEO)";
    }
  };

  const getInputLabel = () => {
    return inputType === "altitude" ? "Altitude Above Surface" : "Distance from Center";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  // Function to convert input value when type changes
  const handleInputTypeChange = (newType: InputType) => {
    if (newType === inputType) return; // No change

    const currentValue = parseFloat(inputValue);
    if (isNaN(currentValue)) {
      setInputType(newType);
      setError(null); // Clear potential previous error
      return; // Don't convert if input is not a number
    }

    let convertedValue: number;
    const valueInKm = altitudeUnit === "mi" ? MtoKm(MitoM(currentValue)) : currentValue;

    if (newType === "distance" && inputType === "altitude") {
      // Convert from altitude to distance
      convertedValue = valueInKm + EARTH_RADIUS_KM;
    } else if (newType === "altitude" && inputType === "distance") {
      // Convert from distance to altitude
      convertedValue = Math.max(0, valueInKm - EARTH_RADIUS_KM); // Ensure altitude isn't negative
    } else {
      convertedValue = valueInKm; // Should not happen, but fallback
    }

    // Convert back to the selected unit if needed
    const displayValue = (altitudeUnit === "mi" ? MtoMi(KmtoM(convertedValue)) : convertedValue).toFixed(1); // Keep one decimal place for consistency

    setInputType(newType);
    setInputValue(displayValue);
    setError(null); // Clear error after successful conversion
    // Recalculation will happen via useEffect dependency change
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="orbital-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Column 1: Inputs and Results */}
        <div className="border-border bg-card flex flex-col gap-6 rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground">
            Calculate orbital velocity and period for a circular orbit around Earth. Input either altitude above surface
            or distance from Earth&apos;s center. Assumes a spherical Earth ({EARTH_RADIUS_KM} km radius) and neglects
            atmospheric drag.
          </p>

          {/* Input Type Selector Buttons */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleInputTypeChange("altitude")}
              className={`group focus:ring-offset-background relative inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                inputType === "altitude"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
                  : "bg-muted text-muted-foreground hover:bg-accent focus:ring-accent-foreground"
              } `}
            >
              Altitude Above Surface
            </button>
            <button
              type="button"
              onClick={() => handleInputTypeChange("distance")}
              className={`group focus:ring-offset-background relative inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                inputType === "distance"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
                  : "bg-muted text-muted-foreground hover:bg-accent focus:ring-accent-foreground"
              } `}
            >
              Distance from Center
            </button>
          </div>

          {/* Input Value and Unit & Button */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Altitude Input - Takes 1 span */}
            <div>
              <label htmlFor="input-value" className="text-foreground block text-sm font-medium">
                {getInputLabel()}
              </label>
              <Input
                type="number"
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getInputPlaceholder()}
                className="mt-1"
              />
            </div>

            {/* Unit Selector - Takes 1 span */}
            <div>
              <label htmlFor="unit" className="text-foreground block text-sm font-medium">
                Unit
              </label>
              <Select value={altitudeUnit} onValueChange={(value) => setAltitudeUnit(value as AltitudeUnit)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="mi">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {formattedResults && !error && (
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Results:</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Input Altitude Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaSatellite className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Altitude</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.altitudeKm} km / {formattedResults.altitudeMi} mi
                    </div>
                  </div>
                </div>
                {/* Orbital Velocity Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaTachometerAlt className="mt-1 h-6 w-6 shrink-0 text-green-500" />
                  <div>
                    <div className="text-foreground font-medium">Orbital Velocity</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.velocityKms} km/s / {formattedResults.velocityMiS} mi/s
                      <span className="text-muted-foreground ml-2 text-xs">({formattedResults.velocityMs} m/s)</span>
                    </div>
                  </div>
                </div>
                {/* Orbital Period Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaClock className="mt-1 h-6 w-6 shrink-0 text-purple-500" />
                  <div>
                    <div className="text-foreground font-medium">Orbital Period</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.periodFormatted}
                      <span className="text-muted-foreground ml-2 text-xs">({formattedResults.periodS} s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Visualization and Details */}
        <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-6 shadow-lg">
          <Visualization orbitalResult={results} onHoverPoint={setInteractiveHoverPoint} height={400} />
          <Details detailPoint={interactiveHoverPoint} />
        </div>
      </div>

      {/* Theory/Notes Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
