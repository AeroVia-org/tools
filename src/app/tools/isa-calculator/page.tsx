"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FaTemperatureHigh, FaWind, FaWeightHanging, FaRulerVertical, FaLayerGroup } from "react-icons/fa";
import { calculateIsaFromAltitude, calculateIsaFromPressure, calculateIsaFromTemperature, IsaResult } from "./logic";
import Visualization from "./Visualization";
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
} from "@/utils/conversions";
import Navigation from "../components/Navigation";
import Theory from "./Theory";

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

  const formattedResults = useMemo(() => {
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
  }, [results]);

  const renderInputUnitSelector = () => {
    switch (inputType) {
      case "altitude":
        return (
          <select
            id="unit"
            value={altitudeUnit}
            onChange={(e) => setAltitudeUnit(e.target.value as AltitudeUnit)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="m">Meters (m)</option>
            <option value="ft">Feet (ft)</option>
            <option value="km">Kilometers (km)</option>
            <option value="mi">Miles (mi)</option>
          </select>
        );
      case "pressure":
        return (
          <select
            id="unit"
            value={pressureUnit}
            onChange={(e) => setPressureUnit(e.target.value as PressureUnit)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="hPa">hPa</option>
            <option value="Pa">Pa</option>
            <option value="atm">Atmospheres (atm)</option>
            <option value="bar">Bar (bar)</option>
          </select>
        );
      case "temperature":
        return (
          <select
            id="unit"
            value={temperatureUnit}
            onChange={(e) => setTemperatureUnit(e.target.value as TemperatureUnit)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="C">Celsius (°C)</option>
            <option value="K">Kelvin (K)</option>
            <option value="F">Fahrenheit (°F)</option>
          </select>
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        ISA Calculator
      </h1>

      <Navigation
        name="ISA Calculator"
        description="Enter one property to calculate the others based on the International Standard Atmosphere model."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Enter one property to calculate the others based on the International Standard Atmosphere model. Note:
            Calculating from temperature is only valid in the Troposphere.
          </p>

          {/* Input Type Selection */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Input Property</label>
            <div className="flex space-x-4 rounded-md bg-gray-100 p-1 dark:bg-gray-700">
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
                    inputType === type
                      ? "bg-white text-blue-700 shadow dark:bg-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
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
              <label htmlFor="input-value" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {getInputLabel()} Value
              </label>
              <input
                type="number"
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Unit
              </label>
              {renderInputUnitSelector()}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-100 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {formattedResults && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Results:</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaRulerVertical className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Altitude</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.altitudeM} m / {formattedResults.altitudeFt} ft
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaTemperatureHigh className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Temperature</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.temperatureK} K / {formattedResults.temperatureC} °C /{" "}
                      {formattedResults.temperatureF} °F
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaWind className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Pressure</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedResults.pressurePa} Pa / {formattedResults.pressureHpa} hPa /{" "}
                      {formattedResults.pressureAtm} atm / {formattedResults.pressureBar} bar
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaWeightHanging className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Density</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formattedResults.density} kg/m³</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                  <FaLayerGroup className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Atmospheric Layer</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formattedResults.layer}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <Visualization maxAltitude={100000} height={600} />
        </div>
      </div>

      {/* Theory Section */}
      <Theory />
    </div>
  );
}
