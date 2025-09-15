"use client";
// TODO publish this tool
// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
import {
  FaGlobe,
  FaTachometerAlt,
  FaWind,
  FaCalculator,
  FaExclamationTriangle,
  FaEye,
  FaChartLine,
} from "react-icons/fa";
import { calculateSphereFlow, SphereFlowResult, FlowConditions } from "./logic";
import Theory from "./theory";
import Navigation from "../../components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@packages/ui/components/ui/card";
import { Badge } from "@packages/ui/components/ui/badge";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

// Define unit types
type VelocityUnit = "m/s" | "km/h" | "knot";
type LengthUnit = "m" | "ft";
type TemperatureUnit = "°C" | "°F" | "K";

export default function SphereFlowCalculatorPage() {
  // Input state
  const [sphereDiameter, setSphereDiameter] = useState<string>("0.1");
  const [flowVelocity, setFlowVelocity] = useState<string>("10");
  const [temperature, setTemperature] = useState<string>("20");
  const [fluidType, setFluidType] = useState<string>("air");

  // Units
  const [velocityUnit, setVelocityUnit] = useState<VelocityUnit>("m/s");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("m");
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("°C");

  // Results state
  const [results, setResults] = useState<SphereFlowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showVisualization, setShowVisualization] = useState<boolean>(true);
  const [showPressureDistribution, setShowPressureDistribution] = useState<boolean>(true);
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);

  // Format number to fixed decimal places with proper rounding
  const formatNumber = (num: number, decimals: number = 4): string => {
    if (num === 0) return "0";
    if (Math.abs(num) < 0.001) return num.toExponential(decimals);
    return num.toFixed(decimals);
  };

  // Convert velocity to m/s for calculations
  const convertVelocityToMs = (velocity: number, unit: VelocityUnit): number => {
    switch (unit) {
      case "m/s":
        return velocity;
      case "km/h":
        return velocity / 3.6;
      case "knot":
        return velocity * 0.514444;
      default:
        return velocity;
    }
  };

  // Convert length to meters for calculations
  const convertLengthToM = (length: number, unit: LengthUnit): number => {
    switch (unit) {
      case "m":
        return length;
      case "ft":
        return length * 0.3048;
      default:
        return length;
    }
  };

  // Convert temperature to Kelvin for calculations
  const convertTemperatureToK = (temp: number, unit: TemperatureUnit): number => {
    switch (unit) {
      case "°C":
        return temp + 273.15;
      case "°F":
        return (temp - 32) * (5 / 9) + 273.15;
      case "K":
        return temp;
      default:
        return temp + 273.15;
    }
  };

  // Calculate sphere flow
  const calculateFlow = useCallback(() => {
    try {
      setError(null);

      const diameter = parseFloat(sphereDiameter);
      const velocity = parseFloat(flowVelocity);
      const temp = parseFloat(temperature);

      if (isNaN(diameter) || diameter <= 0) {
        throw new Error("Sphere diameter must be a positive number");
      }

      if (isNaN(velocity) || velocity < 0) {
        throw new Error("Flow velocity must be a non-negative number");
      }

      if (isNaN(temp)) {
        throw new Error("Temperature must be a valid number");
      }

      // Convert units
      const diameterM = convertLengthToM(diameter, lengthUnit);
      const velocityMs = convertVelocityToMs(velocity, velocityUnit);
      const temperatureK = convertTemperatureToK(temp, temperatureUnit);

      const conditions: FlowConditions = {
        diameter: diameterM,
        velocity: velocityMs,
        temperature: temperatureK,
        fluidType: fluidType as "air" | "water" | "custom",
      };

      const result = calculateSphereFlow(conditions);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during calculation");
      setResults(null);
    }
  }, [sphereDiameter, flowVelocity, temperature, fluidType, velocityUnit, lengthUnit, temperatureUnit]);

  // Recalculate when inputs change
  useEffect(() => {
    calculateFlow();
  }, [calculateFlow]);

  // Get flow regime description
  const getFlowRegimeDescription = (reynolds: number): string => {
    if (reynolds < 1) return "Stokes Flow (Creeping Flow)";
    if (reynolds < 10) return "Low Reynolds Number";
    if (reynolds < 100) return "Transitional Flow";
    if (reynolds < 1000) return "Subcritical Flow";
    if (reynolds < 200000) return "Critical Flow";
    return "Supercritical Flow";
  };

  // Get flow regime color
  const getFlowRegimeColor = (reynolds: number): string => {
    if (reynolds < 1) return "bg-blue-100 text-blue-800";
    if (reynolds < 10) return "bg-green-100 text-green-800";
    if (reynolds < 100) return "bg-yellow-100 text-yellow-800";
    if (reynolds < 1000) return "bg-orange-100 text-orange-800";
    if (reynolds < 200000) return "bg-red-100 text-red-800";
    return "bg-purple-100 text-purple-800";
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="sphere-flow-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Input Panel */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCalculator className="text-primary" />
                Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sphere Diameter */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Sphere Diameter</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={sphereDiameter}
                    onChange={(e) => setSphereDiameter(e.target.value)}
                    placeholder="0.1"
                    className="flex-1"
                  />
                  <Select value={lengthUnit} onValueChange={(value: LengthUnit) => setLengthUnit(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Flow Velocity */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Flow Velocity</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={flowVelocity}
                    onChange={(e) => setFlowVelocity(e.target.value)}
                    placeholder="10"
                    className="flex-1"
                  />
                  <Select value={velocityUnit} onValueChange={(value: VelocityUnit) => setVelocityUnit(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m/s">m/s</SelectItem>
                      <SelectItem value="km/h">km/h</SelectItem>
                      <SelectItem value="knot">knot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Temperature</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="20"
                    className="flex-1"
                  />
                  <Select value={temperatureUnit} onValueChange={(value: TemperatureUnit) => setTemperatureUnit(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="°C">°C</SelectItem>
                      <SelectItem value="°F">°F</SelectItem>
                      <SelectItem value="K">K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fluid Type */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Fluid Type</label>
                <Select value={fluidType} onValueChange={setFluidType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visualization Options */}
              <div className="border-border space-y-3 border-t pt-4">
                <label className="text-foreground text-sm font-medium">Visualization Options</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showVisualization}
                      onChange={(e) => setShowVisualization(e.target.checked)}
                      className="border-border rounded"
                    />
                    <span className="text-foreground text-sm">Show Flow Visualization</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showPressureDistribution}
                      onChange={(e) => setShowPressureDistribution(e.target.checked)}
                      className="border-border rounded"
                    />
                    <span className="text-foreground text-sm">Show Pressure Distribution</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showStreamlines}
                      onChange={(e) => setShowStreamlines(e.target.checked)}
                      className="border-border rounded"
                    />
                    <span className="text-foreground text-sm">Show Streamlines</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-destructive flex items-center gap-2">
                  <FaExclamationTriangle />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-destructive mt-2 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6 lg:col-span-2">
          {results && (
            <>
              {/* Flow Regime */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaEye className="text-primary" />
                    Flow Regime Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Badge className={getFlowRegimeColor(results.reynoldsNumber)}>
                      {getFlowRegimeDescription(results.reynoldsNumber)}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      Re = {formatNumber(results.reynoldsNumber, 2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Main Results */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaChartLine className="text-primary" />
                      Drag Characteristics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Drag Coefficient:</span>
                      <span className="font-mono text-sm">{formatNumber(results.dragCoefficient, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Drag Force:</span>
                      <span className="font-mono text-sm">{formatNumber(results.dragForce, 2)} N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Separation Angle:</span>
                      <span className="font-mono text-sm">{formatNumber(results.separationAngle, 1)}°</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaWind className="text-primary" />
                      Flow Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Reynolds Number:</span>
                      <span className="font-mono text-sm">{formatNumber(results.reynoldsNumber, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Fluid Density:</span>
                      <span className="font-mono text-sm">{formatNumber(results.fluidDensity, 3)} kg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Dynamic Viscosity:</span>
                      <span className="font-mono text-sm">{formatNumber(results.dynamicViscosity, 6)} Pa·s</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pressure Distribution */}
              {showPressureDistribution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaTachometerAlt className="text-primary" />
                      Pressure Coefficient Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground py-8 text-center">
                      <FaChartLine className="mx-auto mb-4 text-4xl" />
                      <p>Pressure distribution visualization will be implemented here</p>
                      <p className="mt-2 text-sm">Shows Cp vs θ around the sphere surface</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Flow Visualization */}
              {showVisualization && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaEye className="text-primary" />
                      Flow Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground py-8 text-center">
                      <FaGlobe className="mx-auto mb-4 text-4xl" />
                      <p>Interactive flow visualization will be implemented here</p>
                      <p className="mt-2 text-sm">
                        Shows streamlines, wake formation, and flow patterns around the sphere
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Theory Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
