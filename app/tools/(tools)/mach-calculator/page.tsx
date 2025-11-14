"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
import { FaPlaneDeparture, FaThermometerHalf, FaVolumeUp } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import { calculateMachNumber, calculateAirspeed, MachCalculatorResult } from "./logic";
import { MStoKMH } from "@/lib/conversions";
import Theory from "../../components/Theory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

// Define the calculation mode
type CalculationMode = "calculateMach" | "calculateAirspeed";

// Define the altitude units
type AltitudeUnit = "m" | "ft" | "km";

// Define the velocity units
type VelocityUnit = "m/s" | "km/h" | "ft/s" | "knot";

export default function MachCalculatorPage() {
  // Input state
  const [airspeed, setAirspeed] = useState<string>("300");
  const [altitude, setAltitude] = useState<string>("10000");
  const [machNumber, setMachNumber] = useState<string>("0.85");
  const [altitudeUnit, setAltitudeUnit] = useState<AltitudeUnit>("m");
  const [velocityUnit, setVelocityUnit] = useState<VelocityUnit>("m/s");
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("calculateMach");

  // Results state
  const [results, setResults] = useState<MachCalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert altitude to meters based on selected unit
  const altitudeToMeters = useCallback((alt: number, unit: AltitudeUnit): number => {
    switch (unit) {
      case "ft":
        return alt / 3.28084;
      case "km":
        return alt * 1000;
      default:
        return alt;
    }
  }, []);

  // Convert velocity to m/s based on selected unit
  const velocityToMs = useCallback((vel: number, unit: VelocityUnit): number => {
    switch (unit) {
      case "km/h":
        return vel / 3.6;
      case "ft/s":
        return vel / 3.28084;
      case "knot":
        return vel * 0.51444;
      default:
        return vel;
    }
  }, []);

  // Handle calculation
  const handleCalculate = useCallback(() => {
    setError(null);
    try {
      const altitudeM = altitudeToMeters(parseFloat(altitude), altitudeUnit);
      let result: MachCalculatorResult;

      // Parse altitude
      if (!altitude) {
        throw new Error("Please enter a valid altitude.");
      }

      if (calculationMode === "calculateMach") {
        // Parse airspeed
        if (!airspeed) {
          throw new Error("Please enter a valid airspeed.");
        }
        const airspeedMS = velocityToMs(parseFloat(airspeed), velocityUnit);
        result = calculateMachNumber(airspeedMS, altitudeM);
      } else {
        // Parse Mach number
        if (!machNumber) {
          throw new Error("Please enter a valid Mach number.");
        }
        const machValue = parseFloat(machNumber);
        result = calculateAirspeed(machValue, altitudeM);
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
    altitude, // value
    altitudeUnit, // value
    airspeed, // value
    velocityUnit, // value
    machNumber, // value
    calculationMode, // value
    altitudeToMeters, // function dependency
    velocityToMs, // function dependency
  ]);

  // Recalculate when inputs change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // Handle key press (Enter to calculate)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  // Get appropriate input placeholders
  const getPlaceholder = (field: "airspeed" | "altitude" | "mach") => {
    switch (field) {
      case "airspeed":
        switch (velocityUnit) {
          case "m/s":
            return "e.g., 300";
          case "km/h":
            return "e.g., 1080";
          case "ft/s":
            return "e.g., 984";
          case "knot":
            return "e.g., 583";
        }
      case "altitude":
        switch (altitudeUnit) {
          case "m":
            return "e.g., 10000";
          case "ft":
            return "e.g., 32808";
          case "km":
            return "e.g., 10";
        }
      case "mach":
        return "e.g., 0.85";
    }
  };

  // Format numbers for display
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <ToolTitle toolKey="mach-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate Mach number from airspeed and altitude, or calculate the airspeed for a given Mach number at a
            specific altitude.
          </p>

          {/* Calculation Mode Selection */}
          <div className="mb-6">
            <Label className="mb-1">Calculation Mode</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {(["calculateMach", "calculateAirspeed"] as CalculationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalculationMode(mode)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMode === mode ? "bg-card text-primary shadow" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {mode === "calculateMach" ? "Calculate Mach Number" : "Calculate Airspeed"}
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {/* Airspeed Input (visible when calculating Mach) */}
            {calculationMode === "calculateMach" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="airspeed">Airspeed</Label>
                  <Input
                    type="number"
                    id="airspeed"
                    value={airspeed}
                    onChange={(e) => setAirspeed(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholder("airspeed")}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
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
            )}

            {/* Mach Number Input (visible when calculating airspeed) */}
            {calculationMode === "calculateAirspeed" && (
              <div>
                <Label htmlFor="mach">Mach Number</Label>
                <Input
                  type="number"
                  id="mach"
                  value={machNumber}
                  onChange={(e) => setMachNumber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder("mach")}
                  className="mt-1 block w-full"
                />
              </div>
            )}

            {/* Altitude Input (always visible) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="altitude">Altitude</Label>
                <Input
                  type="number"
                  id="altitude"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder("altitude")}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Label htmlFor="altitude-unit">Unit</Label>
                <Select value={altitudeUnit} onValueChange={(value) => setAltitudeUnit(value as AltitudeUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">meters (m)</SelectItem>
                    <SelectItem value="ft">feet (ft)</SelectItem>
                    <SelectItem value="km">kilometers (km)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 mt-4 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <h2 className="text-foreground mb-6 text-lg font-semibold">
            {calculationMode === "calculateMach" ? "Mach Number Results" : "Airspeed Results"}
          </h2>

          {results ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Mach Number Display */}
              <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                <IoSpeedometer className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                <div>
                  <div className="text-foreground font-medium">Mach Number</div>
                  <div className="text-primary text-lg font-semibold">{formatNumber(results.machNumber, 3)}</div>
                  <div className="text-muted-foreground mt-1 text-sm">{results.regimeDescription} flight regime</div>
                </div>
              </div>

              {/* Speed of Sound Display */}
              <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                <FaVolumeUp className="mt-1 h-6 w-6 shrink-0 text-purple-600" />
                <div>
                  <div className="text-foreground font-medium">Speed of Sound</div>
                  <div className="text-foreground text-base font-semibold">
                    {formatNumber(results.speedOfSound)} m/s
                  </div>
                  <div className="text-muted-foreground mt-1 text-sm">
                    {formatNumber(MStoKMH(results.speedOfSound))} km/h
                  </div>
                </div>
              </div>

              {/* Airspeed Display */}
              <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                <FaPlaneDeparture className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                <div>
                  <div className="text-foreground font-medium">True Airspeed</div>
                  <div className="text-foreground text-base font-semibold">{formatNumber(results.airspeed)} m/s</div>
                  <div className="text-muted-foreground mt-1 text-sm">
                    {formatNumber(MStoKMH(results.airspeed))} km/h ≈ {formatNumber(results.airspeed * 1.94384, 1)} knots
                  </div>
                </div>
              </div>

              {/* Temperature Display */}
              <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                <FaThermometerHalf className="mt-1 h-6 w-6 shrink-0 text-red-600" />
                <div>
                  <div className="text-foreground font-medium">Air Temperature</div>
                  <div className="text-foreground text-base font-semibold">
                    {formatNumber(results.temperatureC, 1)}°C
                  </div>
                  <div className="text-muted-foreground mt-1 text-sm">
                    {formatNumber(results.temperatureF, 1)}°F / {formatNumber(results.temperature, 1)} K
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-48 items-center justify-center">
              <p>Enter valid parameters to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Theory Section - Replaced */}
      <Theory toolKey="mach-calculator" />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
