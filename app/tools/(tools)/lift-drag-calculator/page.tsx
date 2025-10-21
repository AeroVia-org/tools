"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

import { useState, useEffect, useCallback } from "react";
import {
  FaPlaneDeparture,
  FaRuler,
  FaTachometerAlt,
  FaWind,
  FaCalculator,
  FaExclamationTriangle,
} from "react-icons/fa";
import { calculateLiftAndDrag, getAirfoilTypes, LiftDragResult, FlightConditions } from "./logic";
import { MStoKMH, MStoKnots, MtoFt, FttoM, Ft2toM2 } from "@/lib/conversions";
import Theory from "./theory";
import { Checkbox } from "@packages/ui/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

// Define unit types
type VelocityUnit = "m/s" | "km/h" | "knot";
type AltitudeUnit = "m" | "ft";
type AreaUnit = "m²" | "ft²";
type LengthUnit = "m" | "ft";

export default function LiftDragCalculatorPage() {
  // Input state
  const [velocity, setVelocity] = useState<string>("50");
  const [altitude, setAltitude] = useState<string>("1000");
  const [angleOfAttack, setAngleOfAttack] = useState<string>("5");
  const [wingArea, setWingArea] = useState<string>("16");
  const [wingSpan, setWingSpan] = useState<string>("8");
  const [airfoilType, setAirfoilType] = useState<string>("naca-2412");

  // Units
  const [velocityUnit, setVelocityUnit] = useState<VelocityUnit>("m/s");
  const [altitudeUnit, setAltitudeUnit] = useState<AltitudeUnit>("m");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("m²");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("m");

  // Custom airfoil parameters
  const [useCustomAirfoil, setUseCustomAirfoil] = useState<boolean>(false);
  const [customClMax, setCustomClMax] = useState<string>("1.4");
  const [customCl0, setCustomCl0] = useState<string>("0.25");
  const [customCd0, setCustomCd0] = useState<string>("0.006");
  const [customOswaldEfficiency, setCustomOswaldEfficiency] = useState<string>("0.85");

  // Results state
  const [results, setResults] = useState<LiftDragResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert velocity to m/s
  const velocityToMs = useCallback((vel: number, unit: VelocityUnit): number => {
    switch (unit) {
      case "km/h":
        return vel / 3.6;
      case "knot":
        return vel * 0.5144;
      default:
        return vel;
    }
  }, []);

  // Convert altitude to meters
  const altitudeToMeters = useCallback((alt: number, unit: AltitudeUnit): number => {
    switch (unit) {
      case "ft":
        return FttoM(alt);
      default:
        return alt;
    }
  }, []);

  // Convert area to m²
  const areaToM2 = useCallback((area: number, unit: AreaUnit): number => {
    switch (unit) {
      case "ft²":
        return Ft2toM2(area);
      default:
        return area;
    }
  }, []);

  // Convert length to meters
  const lengthToMeters = useCallback((length: number, unit: LengthUnit): number => {
    switch (unit) {
      case "ft":
        return FttoM(length);
      default:
        return length;
    }
  }, []);

  // Handle calculation
  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);

    try {
      // Validate inputs
      if (!velocity || !altitude || !angleOfAttack || !wingArea || !wingSpan) {
        throw new Error("Please fill in all required fields.");
      }

      const velocityMs = velocityToMs(parseFloat(velocity), velocityUnit);
      const altitudeM = altitudeToMeters(parseFloat(altitude), altitudeUnit);
      const angleOfAttackDeg = parseFloat(angleOfAttack);
      const wingAreaM2 = areaToM2(parseFloat(wingArea), areaUnit);
      const wingSpanM = lengthToMeters(parseFloat(wingSpan), lengthUnit);

      // Validate numeric values
      if (isNaN(velocityMs) || isNaN(altitudeM) || isNaN(angleOfAttackDeg) || isNaN(wingAreaM2) || isNaN(wingSpanM)) {
        throw new Error("Please enter valid numbers for all fields.");
      }

      if (velocityMs <= 0) {
        throw new Error("Velocity must be positive.");
      }

      if (altitudeM < 0) {
        throw new Error("Altitude cannot be negative.");
      }

      if (wingAreaM2 <= 0) {
        throw new Error("Wing area must be positive.");
      }

      if (wingSpanM <= 0) {
        throw new Error("Wing span must be positive.");
      }

      // Prepare flight conditions
      const conditions: FlightConditions = {
        velocity: velocityMs,
        altitude: altitudeM,
        angleOfAttack: angleOfAttackDeg,
        wingArea: wingAreaM2,
        wingSpan: wingSpanM,
        aspectRatio: (wingSpanM * wingSpanM) / wingAreaM2,
        airfoilType: useCustomAirfoil ? "custom" : airfoilType,
        customClMax: useCustomAirfoil ? parseFloat(customClMax) : undefined,
        customCl0: useCustomAirfoil ? parseFloat(customCl0) : undefined,
        customCd0: useCustomAirfoil ? parseFloat(customCd0) : undefined,
        customOswaldEfficiency: useCustomAirfoil ? parseFloat(customOswaldEfficiency) : undefined,
      };

      const result = calculateLiftAndDrag(conditions);
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
    velocity,
    altitude,
    angleOfAttack,
    wingArea,
    wingSpan,
    airfoilType,
    velocityUnit,
    altitudeUnit,
    areaUnit,
    lengthUnit,
    useCustomAirfoil,
    customClMax,
    customCl0,
    customCd0,
    customOswaldEfficiency,
    velocityToMs,
    altitudeToMeters,
    areaToM2,
    lengthToMeters,
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

  // Format numbers for display
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Get airfoil options
  const airfoilOptions = getAirfoilTypes();

  return (
    <div className="mx-auto pt-0 md:pt-8 pb-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="lift-drag-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate lift and drag forces for an aircraft based on flight conditions, wing geometry, and airfoil
            characteristics. This calculator uses simplified aerodynamic models suitable for preliminary design.
          </p>

          {/* Flight Conditions Section */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Flight Conditions</h3>

            {/* Velocity */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label>Velocity</Label>
                <Input
                  type="number"
                  id="velocity"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={velocityUnit} onValueChange={(value) => setVelocityUnit(value as VelocityUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m/s">m/s</SelectItem>
                    <SelectItem value="km/h">km/h</SelectItem>
                    <SelectItem value="knot">knots</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Altitude */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label>Altitude</Label>
                <Input
                  type="number"
                  id="altitude"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={altitudeUnit} onValueChange={(value) => setAltitudeUnit(value as AltitudeUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">meters</SelectItem>
                    <SelectItem value="ft">feet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Angle of Attack */}
            <div>
              <Label>Angle of Attack</Label>
              <Input
                type="number"
                id="angle-of-attack"
                value={angleOfAttack}
                onChange={(e) => setAngleOfAttack(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 5"
                className="mt-1"
              />
              <p className="text-muted-foreground mt-1 text-xs">Angle in degrees</p>
            </div>
          </div>

          {/* Wing Geometry Section */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Wing Geometry</h3>

            {/* Wing Area */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label>Wing Area</Label>
                <Input
                  type="number"
                  id="wing-area"
                  value={wingArea}
                  onChange={(e) => setWingArea(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={areaUnit} onValueChange={(value) => setAreaUnit(value as AreaUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m²">m²</SelectItem>
                    <SelectItem value="ft²">ft²</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Wing Span */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label>Wing Span</Label>
                <Input
                  type="number"
                  id="wing-span"
                  value={wingSpan}
                  onChange={(e) => setWingSpan(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={lengthUnit} onValueChange={(value) => setLengthUnit(value as LengthUnit)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">meters</SelectItem>
                    <SelectItem value="ft">feet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Airfoil Section */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Airfoil Characteristics</h3>

            {/* Airfoil Type Selection */}
            <div>
              <Label>Airfoil Type</Label>
              <Select value={airfoilType} onValueChange={(value) => setAirfoilType(value)} disabled={useCustomAirfoil}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {airfoilOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Airfoil Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom-airfoil"
                checked={useCustomAirfoil}
                onCheckedChange={(checked) => setUseCustomAirfoil(checked === true)}
              />
              <Label>Use Custom Airfoil Parameters</Label>
            </div>

            {/* Custom Airfoil Parameters */}
            {useCustomAirfoil && (
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                <div>
                  <Label>CL Max</Label>
                  <Input
                    type="number"
                    id="custom-cl-max"
                    value={customClMax}
                    onChange={(e) => setCustomClMax(e.target.value)}
                    onKeyDown={handleKeyDown}
                    step="0.1"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>CL0</Label>
                  <Input
                    type="number"
                    id="custom-cl0"
                    value={customCl0}
                    onChange={(e) => setCustomCl0(e.target.value)}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>CD0</Label>
                  <Input
                    type="number"
                    id="custom-cd0"
                    value={customCd0}
                    onChange={(e) => setCustomCd0(e.target.value)}
                    onKeyDown={handleKeyDown}
                    step="0.001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Oswald Efficiency</Label>
                  <Input
                    type="number"
                    id="custom-oswald"
                    value={customOswaldEfficiency}
                    onChange={(e) => setCustomOswaldEfficiency(e.target.value)}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    min="0"
                    max="1"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <h2 className="text-foreground mb-6 text-lg font-semibold">Lift & Drag Results</h2>

          {results ? (
            <div className="space-y-6">
              {/* Main Results - Lift and Drag */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Lift Force */}
                <div className="border-border bg-muted/50 flex flex-col items-center rounded-lg border p-4 text-center">
                  <FaPlaneDeparture className="mb-2 h-8 w-8 text-blue-600" />
                  <h3 className="text-foreground text-lg font-medium">Lift Force</h3>
                  <div className="text-primary mt-1 text-2xl font-bold">{formatNumber(results.lift)} N</div>
                  <div className="text-muted-foreground mt-1 text-sm">CL = {formatNumber(results.cl, 3)}</div>
                </div>

                {/* Drag Force */}
                <div className="border-border bg-muted/50 flex flex-col items-center rounded-lg border p-4 text-center">
                  <FaWind className="mb-2 h-8 w-8 text-red-600" />
                  <h3 className="text-foreground text-lg font-medium">Drag Force</h3>
                  <div className="text-primary mt-1 text-2xl font-bold">{formatNumber(results.drag)} N</div>
                  <div className="text-muted-foreground mt-1 text-sm">CD = {formatNumber(results.cd, 4)}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="border-border rounded-lg border p-4">
                <h3 className="text-foreground mb-4 text-lg font-medium">Performance Metrics</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Lift-to-Drag Ratio */}
                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaCalculator className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <div className="text-foreground font-medium">Lift/Drag Ratio</div>
                      <div className="text-foreground text-lg font-semibold">{formatNumber(results.clCd, 1)}</div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        Max L/D = {formatNumber(results.maxLiftToDragRatio, 1)}
                      </div>
                    </div>
                  </div>

                  {/* Stall Speed */}
                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaTachometerAlt className="mt-1 h-5 w-5 shrink-0 text-orange-600" />
                    <div>
                      <div className="text-foreground font-medium">Stall Speed</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.stallSpeed)} m/s
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        {formatNumber(MStoKMH(results.stallSpeed))} km/h
                      </div>
                    </div>
                  </div>

                  {/* Optimal Angle of Attack */}
                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaRuler className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
                    <div>
                      <div className="text-foreground font-medium">Optimal AOA</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.optimalAngleOfAttack, 1)}°
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">For max L/D ratio</div>
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaRuler className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                    <div>
                      <div className="text-foreground font-medium">Aspect Ratio</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.aspectRatio, 1)}
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">Span²/Area</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Conditions Summary */}
              <div className="border-border rounded-lg border p-4">
                <h3 className="text-foreground mb-4 text-lg font-medium">Flight Conditions</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaTachometerAlt className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                      <div className="text-foreground font-medium">Velocity</div>
                      <div className="text-foreground text-base font-semibold">
                        {formatNumber(results.velocity)} m/s
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        {formatNumber(MStoKMH(results.velocity))} km/h ≈ {formatNumber(MStoKnots(results.velocity))}{" "}
                        knots
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaRuler className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <div className="text-foreground font-medium">Altitude</div>
                      <div className="text-foreground text-base font-semibold">{formatNumber(results.altitude)} m</div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        {formatNumber(MtoFt(results.altitude))} ft
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaWind className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
                    <div>
                      <div className="text-foreground font-medium">Air Density</div>
                      <div className="text-foreground text-base font-semibold">
                        {formatNumber(results.density, 4)} kg/m³
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        Dynamic pressure: {formatNumber(results.dynamicPressure)} Pa
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaPlaneDeparture className="mt-1 h-5 w-5 shrink-0 text-orange-600" />
                    <div>
                      <div className="text-foreground font-medium">Airfoil</div>
                      <div className="text-foreground text-base font-semibold">{results.airfoilName}</div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        CLmax: {formatNumber(results.clMax, 2)} | CD0: {formatNumber(results.cd0, 4)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {results.warnings.length > 0 && (
                <div className="border-border bg-warning/10 rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="text-warning mt-1 h-5 w-5 shrink-0" />
                    <div>
                      <h4 className="text-foreground font-medium">Warnings</h4>
                      <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                        {results.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground flex h-48 items-center justify-center">
              <p>Enter parameters to calculate lift and drag</p>
            </div>
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
