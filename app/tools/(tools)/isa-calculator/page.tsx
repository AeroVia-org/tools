"use client";

// TODO: Fix tooltip positioning in Visualization component
// The tooltip becomes unreliable at the top and bottom of the visualization
// because it gets cut off when positioned outside the container boundaries.
// The current implementation uses fixed positioning that doesn't account for
// viewport edges, causing the tooltip to be partially or completely hidden.

import { useState, useEffect, useCallback } from "react";
import { FaTemperatureHigh, FaWind, FaWeightHanging, FaRulerVertical, FaLayerGroup } from "react-icons/fa";
import { calculateIsaFromAltitude, calculateIsaFromPressure, calculateIsaFromTemperature, IsaResult } from "./logic";
import {
  MtoFt,
  FttoM,
  KmtoM,
  MitoM,
  KtoC,
  CtoK,
  PatoHpa,
  HpatoPa,
  AtmtoPa,
  PatoAtm,
  BartoPa,
  PatoBar,
  KtoF,
  FtoK,
} from "@/lib/conversions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";

import OpenSourceCard from "../../components/OpenSourceCard";
import Navigation from "../../components/Navigation";
import ToolTitle from "../../components/ToolTitle";
import Visualization from "./visualization";
import Theory from "./theory";

type InputType = "altitude" | "pressure" | "temperature";
type AltitudeUnit = "m" | "ft" | "km" | "mi";
type PressureUnit = "Pa" | "hPa" | "atm" | "bar";
type TemperatureUnit = "C" | "K" | "F";

export default function IsaCalculatorPage() {
  // Input state
  const [inputType, setInputType] = useState<InputType>("altitude");
  const [inputValue, setInputValue] = useState<string>("1000");
  const [altitudeUnit, setAltitudeUnit] = useState<AltitudeUnit>("m");
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>("hPa");
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("C");

  // Results state
  const [results, setResults] = useState<IsaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);
    const valueNum = parseFloat(inputValue);

    if (isNaN(valueNum)) {
      setError("Please enter a valid number.");
      return;
    }

    try {
      let calculatedResults: IsaResult;

      switch (inputType) {
        case "altitude":
          let altitudeMeters = valueNum;
          switch (altitudeUnit) {
            case "ft":
              altitudeMeters = FttoM(valueNum);
              break;
            case "km":
              altitudeMeters = KmtoM(valueNum);
              break;
            case "mi":
              altitudeMeters = MitoM(valueNum);
              break;
            // "m" is default, no conversion needed
          }
          calculatedResults = calculateIsaFromAltitude(altitudeMeters);
          break;
        case "pressure":
          let pressurePa = valueNum;
          switch (pressureUnit) {
            case "hPa":
              pressurePa = HpatoPa(valueNum);
              break;
            case "atm":
              pressurePa = AtmtoPa(valueNum);
              break;
            case "bar":
              pressurePa = BartoPa(valueNum);
              break;
            // "Pa" is default
          }
          calculatedResults = calculateIsaFromPressure(pressurePa);
          break;
        case "temperature":
          let temperatureK = valueNum;
          switch (temperatureUnit) {
            case "C":
              temperatureK = CtoK(valueNum);
              break;
            case "F":
              temperatureK = FtoK(valueNum);
              break;
            // "K" is default
          }
          calculatedResults = calculateIsaFromTemperature(temperatureK);
          break;
        default:
          throw new Error("Invalid input type selected.");
      }

      setResults(calculatedResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null); // Clear previous results on error
    }
  }, [inputType, inputValue, altitudeUnit, pressureUnit, temperatureUnit]);

  // useEffect to calculate on input/unit change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const formattedResults = (() => {
    if (!results) return null;
    return {
      altitudeM: results.altitude.toFixed(1),
      altitudeFt: MtoFt(results.altitude).toFixed(0),
      temperatureK: results.temperature.toFixed(2),
      temperatureC: KtoC(results.temperature).toFixed(2),
      temperatureF: KtoF(results.temperature).toFixed(2),
      pressurePa: results.pressure.toFixed(0),
      pressureHpa: PatoHpa(results.pressure).toFixed(2),
      pressureAtm: PatoAtm(results.pressure).toFixed(4),
      pressureBar: PatoBar(results.pressure).toFixed(4),
      density: results.density.toFixed(4),
      layer: results.layer || "Unknown",
    };
  })();

  const renderInputUnitSelector = () => {
    switch (inputType) {
      case "altitude":
        return (
          <Select value={altitudeUnit} onValueChange={(value) => setAltitudeUnit(value as AltitudeUnit)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m">Meters (m)</SelectItem>
              <SelectItem value="ft">Feet (ft)</SelectItem>
              <SelectItem value="km">Kilometers (km)</SelectItem>
              <SelectItem value="mi">Miles (mi)</SelectItem>
            </SelectContent>
          </Select>
        );
      case "pressure":
        return (
          <Select value={pressureUnit} onValueChange={(value) => setPressureUnit(value as PressureUnit)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hPa">hPa</SelectItem>
              <SelectItem value="Pa">Pa</SelectItem>
              <SelectItem value="atm">Atmospheres (atm)</SelectItem>
              <SelectItem value="bar">Bar (bar)</SelectItem>
            </SelectContent>
          </Select>
        );
      case "temperature":
        return (
          <Select value={temperatureUnit} onValueChange={(value) => setTemperatureUnit(value as TemperatureUnit)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C">Celsius (°C)</SelectItem>
              <SelectItem value="K">Kelvin (K)</SelectItem>
              <SelectItem value="F">Fahrenheit (°F)</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const getInputLabel = () => {
    switch (inputType) {
      case "altitude":
        return "Altitude";
      case "pressure":
        return "Pressure";
      case "temperature":
        return "Temperature";
      default:
        return "Input";
    }
  };

  const getInputPlaceholder = () => {
    switch (inputType) {
      case "altitude":
        switch (altitudeUnit) {
          case "m":
            return "e.g., 11000";
          case "ft":
            return "e.g., 36089";
          case "km":
            return "e.g., 11";
          case "mi":
            return "e.g., 6.8";
        }
      case "pressure":
        switch (pressureUnit) {
          case "hPa":
            return "e.g., 1013.25";
          case "Pa":
            return "e.g., 101325";
          case "atm":
            return "e.g., 1.0";
          case "bar":
            return "e.g., 1.01325";
          default:
            return "e.g., 101325";
        }
      case "temperature":
        switch (temperatureUnit) {
          case "C":
            return "e.g., 15";
          case "K":
            return "e.g., 288.15";
          case "F":
            return "e.g., 59";
          default:
            return "e.g., 15";
        }
      default:
        return "";
    }
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="isa-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Enter one property to calculate the others based on the International Standard Atmosphere model. Note:
            Calculating from temperature is only valid in the Troposphere.
          </p>

          {/* Input Type Selection */}
          <div className="mb-6">
            <label className="text-foreground mb-1 block text-sm font-medium">Input Property</label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {(["altitude", "pressure", "temperature"] as InputType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setInputType(type);
                    setInputValue("");
                    setError(null);
                    setResults(null);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    inputType === type ? "bg-card text-primary shadow" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Input Value and Unit */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="input-value" className="text-foreground block text-sm font-medium">
                {getInputLabel()} Value
              </label>
              <Input
                type="number"
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="unit" className="text-foreground block text-sm font-medium">
                Unit
              </label>
              {renderInputUnitSelector()}
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
              <h2 className="text-foreground mb-4 text-xl font-semibold">Results:</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaRulerVertical className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Altitude</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.altitudeM} m / {formattedResults.altitudeFt} ft
                    </div>
                  </div>
                </div>
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaTemperatureHigh className="mt-1 h-6 w-6 shrink-0 text-red-500" />
                  <div>
                    <div className="text-foreground font-medium">Temperature</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.temperatureK} K / {formattedResults.temperatureC} °C /{" "}
                      {formattedResults.temperatureF} °F
                    </div>
                  </div>
                </div>
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaWind className="mt-1 h-6 w-6 shrink-0 text-purple-500" />
                  <div>
                    <div className="text-foreground font-medium">Pressure</div>
                    <div className="text-muted-foreground text-sm">
                      {formattedResults.pressurePa} Pa / {formattedResults.pressureHpa} hPa /{" "}
                      {formattedResults.pressureAtm} atm / {formattedResults.pressureBar} bar
                    </div>
                  </div>
                </div>
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaWeightHanging className="mt-1 h-6 w-6 shrink-0 text-orange-500" />
                  <div>
                    <div className="text-foreground font-medium">Density</div>
                    <div className="text-muted-foreground text-sm">{formattedResults.density} kg/m³</div>
                  </div>
                </div>
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaLayerGroup className="mt-1 h-6 w-6 shrink-0 text-green-500" />
                  <div>
                    <div className="text-foreground font-medium">Atmospheric Layer</div>
                    <div className="text-muted-foreground text-sm">{formattedResults.layer}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-border bg-card flex items-center justify-center rounded-lg border p-6 shadow-lg">
          <Visualization maxAltitude={100000} height={600} />
        </div>
      </div>

      {/* Theory Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
