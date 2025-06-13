"use client";

import { useState, useEffect, useCallback } from "react";
import { FaPlaneDeparture, FaThermometerHalf, FaVolumeUp } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import { calculateMachNumber, calculateAirspeed, MachCalculatorResult } from "./logic";
import { MStoKMH } from "@/utils/conversions";
import Theory from "./Theory";
import Navigation from "../components/Navigation";

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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Mach Number Calculator
      </h1>

      <Navigation
        name="Mach Number Calculator"
        description="Calculate Mach number, speed of sound, and temperature based on altitude and airspeed."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Input Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Calculate Mach number from airspeed and altitude, or calculate the airspeed for a given Mach number at a
            specific altitude.
          </p>

          {/* Calculation Mode Selection */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Calculation Mode</label>
            <div className="flex space-x-4 rounded-md bg-gray-100 p-1 dark:bg-gray-700">
              {(["calculateMach", "calculateAirspeed"] as CalculationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalculationMode(mode)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMode === mode
                      ? "bg-white text-blue-700 shadow dark:bg-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
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
                  <label htmlFor="airspeed" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Airspeed
                  </label>
                  <input
                    type="number"
                    id="airspeed"
                    value={airspeed}
                    onChange={(e) => setAirspeed(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholder("airspeed")}
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div>
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
            )}

            {/* Mach Number Input (visible when calculating airspeed) */}
            {calculationMode === "calculateAirspeed" && (
              <div>
                <label htmlFor="mach" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mach Number
                </label>
                <input
                  type="number"
                  id="mach"
                  value={machNumber}
                  onChange={(e) => setMachNumber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder("mach")}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            )}

            {/* Altitude Input (always visible) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="altitude" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Altitude
                </label>
                <input
                  type="number"
                  id="altitude"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder("altitude")}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="altitude-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Unit
                </label>
                <select
                  id="altitude-unit"
                  value={altitudeUnit}
                  onChange={(e) => setAltitudeUnit(e.target.value as AltitudeUnit)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="m">meters (m)</option>
                  <option value="ft">feet (ft)</option>
                  <option value="km">kilometers (km)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-md bg-red-100 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            {calculationMode === "calculateMach" ? "Mach Number Results" : "Airspeed Results"}
          </h2>

          {results ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Mach Number Display */}
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                <IoSpeedometer className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">Mach Number</div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {formatNumber(results.machNumber, 3)}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {results.regimeDescription} flight regime
                  </div>
                </div>
              </div>

              {/* Speed of Sound Display */}
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                <FaVolumeUp className="mt-1 h-6 w-6 shrink-0 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">Speed of Sound</div>
                  <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    {formatNumber(results.speedOfSound)} m/s
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {formatNumber(MStoKMH(results.speedOfSound))} km/h
                  </div>
                </div>
              </div>

              {/* Airspeed Display */}
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                <FaPlaneDeparture className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">True Airspeed</div>
                  <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    {formatNumber(results.airspeed)} m/s
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {formatNumber(MStoKMH(results.airspeed))} km/h ≈ {formatNumber(results.airspeed * 1.94384, 1)} knots
                  </div>
                </div>
              </div>

              {/* Temperature Display */}
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                <FaThermometerHalf className="mt-1 h-6 w-6 shrink-0 text-red-600" />
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">Air Temperature</div>
                  <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    {formatNumber(results.temperatureC, 1)}°C
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {formatNumber(results.temperatureF, 1)}°F / {formatNumber(results.temperature, 1)} K
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400 dark:text-gray-500">
              <p>Enter valid parameters to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Theory Section - Replaced */}
      <Theory />
    </div>
  );
}
