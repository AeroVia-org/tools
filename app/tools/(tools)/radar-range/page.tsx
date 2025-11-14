"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState } from "react";
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
import Visualization from "./visualization";
import Theory from "../../components/Theory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

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

  // Derived calculation from inputs (no effect-driven state)
  const { results, error }: { results: RadarRangeResult | null; error: string | null } = (() => {
    const powerNum = parseFloat(transmitPower);
    const gainNum = parseFloat(antennaGain);
    const freqNum = parseFloat(frequency);
    const rcsNum = parseFloat(rcs);
    const signalNum = parseFloat(minDetectableSignal);
    if (isNaN(powerNum) || isNaN(gainNum) || isNaN(freqNum) || isNaN(rcsNum) || isNaN(signalNum)) {
      return {
        results: null,
        error: "Please enter valid numbers for all inputs.",
      };
    }
    try {
      // Convert inputs to SI units using helpers from logic.ts
      const powerW = convertPowerToW(powerNum, units.power);
      const gainLinear = convertGainToLinear(gainNum, units.gain);
      const frequencyHz = convertFrequencyToHz(freqNum, units.frequency);
      const rcsM2 = convertRcsToM2(rcsNum, units.rcs);
      const minSignalW = convertSignalToW(signalNum, units.minSignal);
      const calculatedResult = calculateRadarRange(powerW, gainLinear, frequencyHz, rcsM2, minSignalW);
      return { results: calculatedResult, error: null };
    } catch (err) {
      if (err instanceof Error) {
        return { results: null, error: err.message };
      }
      return {
        results: null,
        error: "An unknown error occurred during calculation.",
      };
    }
  })();

  const formattedResults = (() => {
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
  })();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <ToolTitle toolKey="radar-range" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input and Results Panel */}
        <div className="border-border bg-card rounded-lg border p-4 shadow-lg sm:p-6">
          <p className="text-muted-foreground mb-4">
            Estimate the maximum theoretical detection range of a radar system based on its parameters and target
            characteristics. Assumes ideal conditions (free space, no losses).
          </p>

          {/* Input Grid */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Transmit Power */}
            <div>
              <Label htmlFor="power" className="mb-1">
                Transmit Power (Pt)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="power"
                  value={transmitPower}
                  onChange={(e) => setTransmitPower(e.target.value)}
                  placeholder={powerPlaceholders[units.power]}
                  className="mt-1"
                />
                <Select
                  value={units.power}
                  onValueChange={(value) => setUnits({ ...units, power: value as InputUnits["power"] })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="W">W</SelectItem>
                    <SelectItem value="kW">kW</SelectItem>
                    <SelectItem value="MW">MW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Antenna Gain */}
            <div>
              <Label htmlFor="gain" className="mb-1">
                Antenna Gain (G)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="gain"
                  value={antennaGain}
                  onChange={(e) => setAntennaGain(e.target.value)}
                  placeholder={gainPlaceholders[units.gain]}
                  className="mt-1"
                />
                <Select
                  value={units.gain}
                  onValueChange={(value) => setUnits({ ...units, gain: value as InputUnits["gain"] })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dBi">dBi</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <Label htmlFor="frequency" className="mb-1">
                Frequency (f)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder={frequencyPlaceholders[units.frequency]}
                  className="mt-1"
                />
                <Select
                  value={units.frequency}
                  onValueChange={(value) =>
                    setUnits({
                      ...units,
                      frequency: value as InputUnits["frequency"],
                    })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MHz">MHz</SelectItem>
                    <SelectItem value="GHz">GHz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target RCS */}
            <div>
              <Label htmlFor="rcs" className="mb-1">
                Target RCS (σ)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="rcs"
                  value={rcs}
                  onChange={(e) => setRcs(e.target.value)}
                  placeholder={rcsPlaceholders[units.rcs]}
                  className="mt-1"
                />
                <Select
                  value={units.rcs}
                  onValueChange={(value) => setUnits({ ...units, rcs: value as InputUnits["rcs"] })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m²">m²</SelectItem>
                    <SelectItem value="dBsm">dBsm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Minimum Detectable Signal */}
            <div className="sm:col-span-2">
              <Label htmlFor="minSignal" className="mb-1">
                Minimum Detectable Signal (Smin)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="minSignal"
                  value={minDetectableSignal}
                  onChange={(e) => setMinDetectableSignal(e.target.value)}
                  placeholder={minSignalPlaceholders[units.minSignal]}
                  className="mt-1"
                />
                <Select
                  value={units.minSignal}
                  onValueChange={(value) =>
                    setUnits({
                      ...units,
                      minSignal: value as InputUnits["minSignal"],
                    })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="W">W</SelectItem>
                    <SelectItem value="mW">mW</SelectItem>
                    <SelectItem value="dBm">dBm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 mb-4 rounded-md p-3">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Results Section */}
          {formattedResults && !error && (
            <div className="mt-6">
              <h3 className="text-foreground mb-4 text-lg font-medium">Calculated Maximum Range (Rmax):</h3>
              <div className="border-border bg-card rounded-lg border p-4">
                <div className="flex items-center justify-center gap-4 text-center">
                  <FaBullseye className="h-8 w-8 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formattedResults.displayRange}
                  </div>
                  <Select
                    value={units.range}
                    onValueChange={(value) =>
                      setUnits({
                        ...units,
                        range: value as InputUnits["range"],
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers (km)</SelectItem>
                      <SelectItem value="mi">Miles (mi)</SelectItem>
                      <SelectItem value="nmi">Nautical Miles (nmi)</SelectItem>
                      <SelectItem value="m">Meters (m)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Panel */}
        <div className="border-border bg-card flex flex-col rounded-lg border p-4 shadow-lg sm:p-6">
          <h2 className="text-foreground mb-4 text-xl font-semibold">Radar Range Visualization</h2>
          <div className="flex-grow">
            <Visualization
              results={results}
              displayRangeValue={formattedResults?.displayRange}
              displayUnit={units.range}
            />
          </div>
        </div>
      </div>

      {/* Theory Section */}
      <Theory toolKey="radar-range" />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
