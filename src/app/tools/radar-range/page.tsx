"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { FaBullseye } from "react-icons/fa";
import {
  calculateRadarRange,
  RadarRangeResult,
  convertPowerToW,
  convertGainToLinear,
  convertFrequencyToHz,
  convertRcsToM2,
  convertSignalToW,
} from "./logic";
import Visualization from "./Visualization";
import Theory from "./Theory";
import Navigation from "../components/Navigation";

// Placeholder examples mapped to units
const powerPlaceholders: Record<InputUnits["power"], string> = {
  W: "e.g., 1000000", // 1 MW
  kW: "e.g., 1000", // 1 MW
  MW: "e.g., 1", // 1 MW
};

const gainPlaceholders: Record<InputUnits["gain"], string> = {
  dBi: "e.g., 30", // ~1000 linear
  linear: "e.g., 1000", // 30 dBi
};

const frequencyPlaceholders: Record<InputUnits["frequency"], string> = {
  MHz: "e.g., 1000", // 1 GHz
  GHz: "e.g., 1", // 1 GHz
};

const rcsPlaceholders: Record<InputUnits["rcs"], string> = {
  "m²": "e.g., 1", // 1 m² = 0 dBsm
  dBsm: "e.g., 0", // 0 dBsm = 1 m²
};

const minSignalPlaceholders: Record<InputUnits["minSignal"], string> = {
  W: "e.g., 1e-13", // -100 dBm
  mW: "e.g., 1e-10", // -100 dBm
  dBm: "e.g., -100", // -100 dBm
};

type InputUnits = {
  power: "W" | "kW" | "MW";
  gain: "dBi" | "linear";
  frequency: "MHz" | "GHz";
  rcs: "m²" | "dBsm";
  minSignal: "W" | "mW" | "dBm";
  range: "m" | "km" | "mi" | "nmi";
};

// Export the type so it can be imported elsewhere
export type { InputUnits };

export default function RadarRangePage() {
  // Input state
  const [transmitPower, setTransmitPower] = useState<string>("1000"); // W
  const [antennaGain, setAntennaGain] = useState<string>("30"); // dBi
  const [frequency, setFrequency] = useState<string>("1000"); // MHz
  const [rcs, setRcs] = useState<string>("1"); // m²
  const [minDetectableSignal, setMinDetectableSignal] = useState<string>("-100"); // dBm
  const [units, setUnits] = useState<InputUnits>({
    power: "kW",
    gain: "dBi",
    frequency: "GHz",
    rcs: "m²",
    minSignal: "dBm",
    range: "km",
  });

  // Results state
  const [results, setResults] = useState<RadarRangeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);

    // Basic validation
    const powerNum = parseFloat(transmitPower);
    const gainNum = parseFloat(antennaGain);
    const freqNum = parseFloat(frequency);
    const rcsNum = parseFloat(rcs);
    const signalNum = parseFloat(minDetectableSignal);

    if (isNaN(powerNum) || isNaN(gainNum) || isNaN(freqNum) || isNaN(rcsNum) || isNaN(signalNum)) {
      setError("Please enter valid numbers for all inputs.");
      return;
    }

    try {
      // Convert inputs to SI units using helpers from logic.ts
      const powerW = convertPowerToW(powerNum, units.power);
      const gainLinear = convertGainToLinear(gainNum, units.gain);
      const frequencyHz = convertFrequencyToHz(freqNum, units.frequency);
      const rcsM2 = convertRcsToM2(rcsNum, units.rcs);
      const minSignalW = convertSignalToW(signalNum, units.minSignal);

      // Perform calculation
      const calculatedResult = calculateRadarRange(powerW, gainLinear, frequencyHz, rcsM2, minSignalW);
      setResults(calculatedResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null);
    }
  }, [transmitPower, antennaGain, frequency, rcs, minDetectableSignal, units]); // Now includes units

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const formattedResults = useMemo(() => {
    if (!results) return null;
    // Convert results (which are in SI - meters) to selected display unit
    const rangeM = results.maxRangeM;
    let displayRange: string;
    switch (units.range) {
      case "m":
        displayRange = rangeM.toFixed(0);
        break;
      case "km":
        displayRange = (rangeM / 1000).toFixed(2);
        break;
      case "mi":
        displayRange = (rangeM / 1609.34).toFixed(2);
        break;
      case "nmi":
        displayRange = (rangeM / 1852).toFixed(2);
        break;
      default:
        displayRange = rangeM.toFixed(0); // Default to meters
    }

    return {
      displayRange: displayRange,
      // Keep other intermediate results if needed for display later
      wavelength: results.wavelengthM.toExponential(3),
    };
  }, [results, units.range]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Radar Range Equation Calculator
      </h1>

      <Navigation
        name="Radar Range Equation Calculator"
        description="Estimate the maximum detection range of a radar system based on its parameters."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Input and Results Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Estimate the maximum theoretical detection range of a radar system based on its parameters and target
            characteristics. Assumes ideal conditions (free space, no losses).
          </p>

          {/* Input Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Transmit Power */}
            <div>
              <label htmlFor="power" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Transmit Power (Pt)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  id="power"
                  value={transmitPower}
                  onChange={(e) => setTransmitPower(e.target.value)}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={powerPlaceholders[units.power]}
                />
                <select
                  value={units.power}
                  onChange={(e) => setUnits({ ...units, power: e.target.value as InputUnits["power"] })}
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="W">W</option>
                  <option value="kW">kW</option>
                  <option value="MW">MW</option>
                </select>
              </div>
            </div>

            {/* Antenna Gain */}
            <div>
              <label htmlFor="gain" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Antenna Gain (G)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  id="gain"
                  value={antennaGain}
                  onChange={(e) => setAntennaGain(e.target.value)}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={gainPlaceholders[units.gain]}
                />
                <select
                  value={units.gain}
                  onChange={(e) => setUnits({ ...units, gain: e.target.value as InputUnits["gain"] })}
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="dBi">dBi</option>
                  <option value="linear">Linear</option>
                </select>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Frequency (f)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={frequencyPlaceholders[units.frequency]}
                />
                <select
                  value={units.frequency}
                  onChange={(e) => setUnits({ ...units, frequency: e.target.value as InputUnits["frequency"] })}
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="MHz">MHz</option>
                  <option value="GHz">GHz</option>
                </select>
              </div>
            </div>

            {/* Target RCS */}
            <div>
              <label htmlFor="rcs" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Target RCS (σ)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  id="rcs"
                  value={rcs}
                  onChange={(e) => setRcs(e.target.value)}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={rcsPlaceholders[units.rcs]}
                />
                <select
                  value={units.rcs}
                  onChange={(e) => setUnits({ ...units, rcs: e.target.value as InputUnits["rcs"] })}
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="m²">m²</option>
                  <option value="dBsm">dBsm</option>
                </select>
              </div>
            </div>

            {/* Minimum Detectable Signal */}
            <div className="sm:col-span-2">
              <label htmlFor="minSignal" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Minimum Detectable Signal (Smin)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  id="minSignal"
                  value={minDetectableSignal}
                  onChange={(e) => setMinDetectableSignal(e.target.value)}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={minSignalPlaceholders[units.minSignal]}
                />
                <select
                  value={units.minSignal}
                  onChange={(e) => setUnits({ ...units, minSignal: e.target.value as InputUnits["minSignal"] })}
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="W">W</option>
                  <option value="mW">mW</option>
                  <option value="dBm">dBm</option>
                </select>
              </div>
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
          {formattedResults && !error && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Calculated Maximum Range (Rmax):
              </h2>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                <div className="flex items-center justify-center gap-4 text-center">
                  <FaBullseye className="h-8 w-8 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formattedResults.displayRange}
                  </div>
                  <select
                    value={units.range}
                    onChange={(e) => setUnits({ ...units, range: e.target.value as InputUnits["range"] })}
                    className="rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="km">Kilometers (km)</option>
                    <option value="mi">Miles (mi)</option>
                    <option value="nmi">Nautical Miles (nmi)</option>
                    <option value="m">Meters (m)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Panel */}
        <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-center text-xl font-semibold text-gray-900 dark:text-white">Visualization</h2>
          <div className="flex-grow">
            <Visualization
              results={results}
              displayRangeValue={formattedResults?.displayRange}
              displayUnit={units.range}
            />
          </div>
          {/* Maybe add interactive details section later */}
        </div>
      </div>

      {/* Theory Section */}
      <Theory />
    </div>
  );
}
