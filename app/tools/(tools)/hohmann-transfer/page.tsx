"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
import { FaSatellite, FaClock, FaGasPump } from "react-icons/fa";
import { calculateHohmannTransfer, HohmannResult } from "./logic";
import Visualization from "./visualization";
import Details from "./details";
import { MtoMi, MitoM, KmtoM, MtoKm, MStoKMS } from "@/lib/conversions";
import Navigation from "../../components/Navigation";
import Theory from "./theory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

type AltitudeUnit = "km" | "mi";
type InputType = "altitude" | "distance";

// TODO: Fix miles/kilometers conversion issue
// There are duplicate conversion lines in handleCalculate and the visualization
// section doesn't properly convert input values when miles are selected. The tool treats
// mile values as if they were kilometers, leading to incorrect calculations.
// Need to ensure proper unit conversion throughout the entire component.

// Define the hover point type based on InteractiveTransferDetails props
interface HohmannDetailPoint {
  type: "initial" | "transfer" | "final" | "burn1" | "burn2";
  position: "periapsis" | "apoapsis" | "orbit";
  distance: number; // km from center
  velocity: number; // km/s
  angle?: number; // radians
  deltaV?: number; // m/s (for burns)
  burnDescription?: string; // description of the burn
}

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

// Earth radius in km - used for conversion between altitude and distance from center
const EARTH_RADIUS_KM = 6371;

export default function HohmannTransferPage() {
  // Input state
  const [initialInputValue, setInitialInputValue] = useState<string>("400"); // Default LEO
  const [finalInputValue, setFinalInputValue] = useState<string>("35786"); // Default GEO
  const [altitudeUnit, setAltitudeUnit] = useState<AltitudeUnit>("km");
  const [inputType, setInputType] = useState<InputType>("altitude");

  // Results state
  const [results, setResults] = useState<HohmannResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [interactiveHoverPoint, setInteractiveHoverPoint] = useState<HohmannDetailPoint | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);
    const initialValueNum = parseFloat(initialInputValue);
    const finalValueNum = parseFloat(finalInputValue);

    if (isNaN(initialValueNum) || isNaN(finalValueNum)) {
      setError("Please enter valid numbers for both values.");
      return;
    }

    try {
      // Convert inputs to altitude in km based on input type and unit
      let initialAltitudeKm, finalAltitudeKm;

      if (inputType === "altitude") {
        // If input is altitude, convert from miles if needed
        initialAltitudeKm = altitudeUnit === "mi" ? MtoKm(MitoM(initialValueNum)) : initialValueNum;
        finalAltitudeKm = altitudeUnit === "mi" ? MtoKm(MitoM(finalValueNum)) : finalValueNum;
        initialAltitudeKm = altitudeUnit === "mi" ? MtoKm(MitoM(initialValueNum)) : initialValueNum;
        finalAltitudeKm = altitudeUnit === "mi" ? MtoKm(MitoM(finalValueNum)) : finalValueNum;
      } else {
        // If input is distance from center, subtract Earth radius to get altitude
        const initialDistanceKm = altitudeUnit === "mi" ? MtoKm(MitoM(initialValueNum)) : initialValueNum;
        const finalDistanceKm = altitudeUnit === "mi" ? MtoKm(MitoM(finalValueNum)) : finalValueNum;

        initialAltitudeKm = initialDistanceKm - EARTH_RADIUS_KM;
        finalAltitudeKm = finalDistanceKm - EARTH_RADIUS_KM;
      }

      // Ensure altitudes are not negative (below Earth's surface)
      if (initialAltitudeKm < 0 || finalAltitudeKm < 0) {
        throw new Error("Input values result in an orbit below Earth's surface.");
      }
      // Ensure orbits are different
      if (initialAltitudeKm === finalAltitudeKm) {
        throw new Error("Initial and final orbits cannot be the same.");
      }

      const calculatedResults = calculateHohmannTransfer(initialAltitudeKm, finalAltitudeKm);
      setResults(calculatedResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null);
    }
  }, [initialInputValue, finalInputValue, altitudeUnit, inputType]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  const handleInputTypeChange = (newType: InputType) => {
    setInputType(newType);
    setError(null); // Clear error when switching type

    // Convert values if changing input type and values are valid numbers
    const initialNum = parseFloat(initialInputValue);
    const finalNum = parseFloat(finalInputValue);

    if (!isNaN(initialNum)) {
      if (newType === "distance" && inputType === "altitude") {
        // Convert from altitude to distance
        const valueInKm = altitudeUnit === "mi" ? MtoKm(MitoM(initialNum)) : initialNum;
        const distanceInKm = valueInKm + EARTH_RADIUS_KM;
        setInitialInputValue(altitudeUnit === "mi" ? MtoMi(KmtoM(distanceInKm)).toFixed(1) : distanceInKm.toFixed(1));
      } else if (newType === "altitude" && inputType === "distance") {
        // Convert from distance to altitude
        const valueInKm = altitudeUnit === "mi" ? MtoKm(MitoM(initialNum)) : initialNum;
        const altitudeInKm = Math.max(0, valueInKm - EARTH_RADIUS_KM); // Ensure altitude is not negative
        setInitialInputValue(altitudeUnit === "mi" ? MtoMi(KmtoM(altitudeInKm)).toFixed(1) : altitudeInKm.toFixed(1));
      }
    }

    if (!isNaN(finalNum)) {
      if (newType === "distance" && inputType === "altitude") {
        // Convert from altitude to distance
        const valueInKm = altitudeUnit === "mi" ? MtoKm(MitoM(finalNum)) : finalNum;
        const distanceInKm = valueInKm + EARTH_RADIUS_KM;
        setFinalInputValue(altitudeUnit === "mi" ? MtoMi(KmtoM(distanceInKm)).toFixed(1) : distanceInKm.toFixed(1));
      } else if (newType === "altitude" && inputType === "distance") {
        // Convert from distance to altitude
        const valueInKm = altitudeUnit === "mi" ? MtoKm(MitoM(finalNum)) : finalNum;
        const altitudeInKm = Math.max(0, valueInKm - EARTH_RADIUS_KM); // Ensure altitude is not negative
        setFinalInputValue(altitudeUnit === "mi" ? MtoMi(KmtoM(altitudeInKm)).toFixed(1) : altitudeInKm.toFixed(1));
      }
    }
    // Recalculate after type change and potential value conversion
    // Need to use a timeout or effect because state updates are async
    // Or better, include the calculation logic dependency on the new state
    // Let's rely on the useEffect below for recalculation based on inputType change
  };

  // Calculate whenever critical inputs change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const formattedResults = (() => {
    if (!results) return null;
    return {
      initialAltitudeKm: results.initialAltitudeKm.toFixed(1),
      initialAltitudeMi: MtoMi(KmtoM(results.initialAltitudeKm)).toFixed(1),
      finalAltitudeKm: results.finalAltitudeKm.toFixed(1),
      finalAltitudeMi: MtoMi(KmtoM(results.finalAltitudeKm)).toFixed(1),
      deltaV1Ms: results.deltaV1Ms.toFixed(2),
      deltaV1Kms: MStoKMS(results.deltaV1Ms).toFixed(3),
      deltaV1MiS: MtoMi(results.deltaV1Ms).toFixed(3),
      deltaV2Ms: results.deltaV2Ms.toFixed(2),
      deltaV2Kms: MStoKMS(results.deltaV2Ms).toFixed(3),
      deltaV2MiS: MtoMi(results.deltaV2Ms).toFixed(3),
      totalDeltaVMs: results.totalDeltaVMs.toFixed(2),
      totalDeltaVKms: MStoKMS(results.totalDeltaVMs).toFixed(3),
      totalDeltaVMiS: MtoMi(results.totalDeltaVMs).toFixed(3),
      transferTimeS: results.transferTimeS.toFixed(0),
      transferTimeFormatted: formatPeriod(results.transferTimeS),
    };
  })();

  const getInputPlaceholder = (field: "initial" | "final") => {
    if (inputType === "altitude") {
      if (field === "initial") {
        return altitudeUnit === "km" ? "e.g., 400 (LEO)" : "e.g., 249 (LEO)";
      } else {
        return altitudeUnit === "km" ? "e.g., 35786 (GEO)" : "e.g., 22236 (GEO)";
      }
    } else {
      // Distance from center placeholders
      if (field === "initial") {
        return altitudeUnit === "km" ? "e.g., 6771 (LEO)" : "e.g., 4208 (LEO)";
      } else {
        return altitudeUnit === "km" ? "e.g., 42157 (GEO)" : "e.g., 26190 (GEO)";
      }
    }
  };

  const getInputLabel = (field: "initial" | "final") => {
    const prefix = field === "initial" ? "Initial " : "Final ";
    return inputType === "altitude" ? `${prefix}Altitude` : `${prefix}Distance`;
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="hohmann-transfer" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate the required delta-V (change in velocity) and transfer time for an efficient Hohmann transfer
            between two circular orbits around Earth. Assumes impulsive burns and coplanar orbits. Calculate the
            required delta-V (change in velocity) and transfer time for an efficient Hohmann transfer between two
            circular orbits around Earth. Assumes impulsive burns and coplanar orbits.
          </p>

          {/* Input Type Selection */}
          <div className="mb-6">
            <label className="text-foreground mb-1 block text-sm font-medium">Input Type</label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {(["altitude", "distance"] as InputType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleInputTypeChange(type)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    inputType === type ? "bg-card text-primary shadow" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {type === "altitude" ? "Altitude" : "Distance from Center"}
                </button>
              ))}
            </div>
            {inputType === "distance" && (
              <p className="text-muted-foreground mt-2 text-xs">
                Distance is measured from the center of the Earth (Radius ≈ {EARTH_RADIUS_KM} km /{" "}
                {MtoMi(KmtoM(EARTH_RADIUS_KM)).toFixed(0)} mi).
              </p>
            )}
          </div>

          {/* Input Section */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Input Fields */}
            <div className="sm:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Initial Input */}
                <div>
                  <label htmlFor="initial-value" className="text-foreground block text-sm font-medium">
                    {getInputLabel("initial")}
                  </label>
                  <Input
                    type="number"
                    id="initial-value"
                    value={initialInputValue}
                    onChange={(e) => setInitialInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getInputPlaceholder("initial")}
                    className="mt-1"
                  />
                </div>

                {/* Final Input */}
                <div>
                  <label htmlFor="final-value" className="text-foreground block text-sm font-medium">
                    {getInputLabel("final")}
                  </label>
                  <Input
                    type="number"
                    id="final-value"
                    value={finalInputValue}
                    onChange={(e) => setFinalInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getInputPlaceholder("final")}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Unit Selector */}
            <div className="sm:col-span-1">
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
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {formattedResults && (
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Transfer Details:</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Initial Altitude Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaSatellite className="mt-1 h-6 w-6 shrink-0 text-[#9D6EC1]" />
                  <div>
                    <div className="text-foreground font-medium">Initial Orbit</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.initialAltitudeKm} km / {formattedResults.initialAltitudeMi} mi
                    </div>
                  </div>
                </div>

                {/* Final Altitude Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaSatellite className="mt-1 h-6 w-6 shrink-0 text-[#2ECC71]" />
                  <div>
                    <div className="text-foreground font-medium">Final Orbit</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.finalAltitudeKm} km / {formattedResults.finalAltitudeMi} mi
                    </div>
                  </div>
                </div>

                {/* Delta-V 1 Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-orange-500" />
                  <div>
                    <div className="text-foreground font-medium">First Burn (ΔV₁)</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.deltaV1Kms} km/s / {formattedResults.deltaV1MiS} mi/s
                      <span className="text-muted-foreground ml-2 text-xs">({formattedResults.deltaV1Ms} m/s)</span>
                    </div>
                  </div>
                </div>

                {/* Delta-V 2 Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-orange-500" />
                  <div>
                    <div className="text-foreground font-medium">Second Burn (ΔV₂)</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.deltaV2Kms} km/s / {formattedResults.deltaV2MiS} mi/s
                      <span className="text-muted-foreground ml-2 text-xs">({formattedResults.deltaV2Ms} m/s)</span>
                    </div>
                  </div>
                </div>

                {/* Total Delta-V Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-red-500" />
                  <div>
                    <div className="text-foreground font-medium">
                      Total Delta-V (ΔV<sub>Total</sub>)
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.totalDeltaVKms} km/s / {formattedResults.totalDeltaVMiS} mi/s
                      <span className="text-muted-foreground ml-2 text-xs">({formattedResults.totalDeltaVMs} m/s)</span>
                    </div>
                  </div>
                </div>

                {/* Transfer Time Display */}
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaClock className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Transfer Time</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.transferTimeFormatted}
                      <span className="text-muted-foreground ml-2 text-xs">({formattedResults.transferTimeS} s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Transfer Visualization */}
        <div className="border-border bg-card flex flex-col rounded-lg border p-6 shadow-lg">
          <div className="mb-4 flex flex-1 flex-col">
            <Visualization
              initialAltitudeKm={
                inputType === "altitude"
                  ? parseFloat(initialInputValue) || 400
                  : (parseFloat(initialInputValue) || 6771) - EARTH_RADIUS_KM
              }
              finalAltitudeKm={
                inputType === "altitude"
                  ? parseFloat(finalInputValue) || 35786
                  : (parseFloat(finalInputValue) || 42157) - EARTH_RADIUS_KM
              }
              height={400}
              onHoverPoint={setInteractiveHoverPoint}
            />
          </div>
          <Details detailPoint={interactiveHoverPoint} />
        </div>
      </div>

      {/* Theory Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
