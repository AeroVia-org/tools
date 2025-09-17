"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaBalanceScale,
  FaPlaneDeparture,
  FaWeight,
  FaGasPump,
  FaUsers,
  FaRuler,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";

import {
  calculateAircraftWeight,
  getAircraftTypeOptions,
  getMissionTypeOptions,
  AircraftWeightInputs,
  AircraftWeightResult,
  AircraftType,
  MissionType,
  WeightUnit,
  DistanceUnit,
} from "./logic";
import Visualization from "./visualization";
import Theory from "./theory";
import Navigation from "../../components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

type CalculationMode = "fromTakeoffWeight" | "fromEmptyWeight" | "fromMission";

export default function AircraftWeightCalculatorPage() {
  // Input state
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("fromTakeoffWeight");
  const [aircraftType, setAircraftType] = useState<AircraftType>("commercial-airliner");
  const [missionType, setMissionType] = useState<MissionType>("medium-range");

  // Weight inputs
  const [takeoffWeight, setTakeoffWeight] = useState<string>("80000");
  const [emptyWeight, setEmptyWeight] = useState<string>("");
  const [fuelWeight, setFuelWeight] = useState<string>("");
  const [payloadWeight, setPayloadWeight] = useState<string>("");
  const [crewWeight, setCrewWeight] = useState<string>("");

  // Mission inputs
  const [range, setRange] = useState<string>("");
  const [endurance, setEndurance] = useState<string>("");
  const [cruiseSpeed, setCruiseSpeed] = useState<string>("");
  const [cruiseAltitude, setCruiseAltitude] = useState<string>("");

  // Units
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("km");

  // Constraint inputs
  const [mtow, setMtow] = useState<string>("");
  const [mzfw, setMzfw] = useState<string>("");
  const [maxFuelCapacity, setMaxFuelCapacity] = useState<string>("");

  // Results state
  const [results, setResults] = useState<AircraftWeightResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle calculation
  const handleCalculate = useCallback(() => {
    setError(null);
    setResults(null);

    try {
      const inputs: AircraftWeightInputs = {
        aircraftType,
        missionType,
        weightUnit,
        distanceUnit,
      };

      // Add weight inputs based on calculation mode
      if (calculationMode === "fromTakeoffWeight" && takeoffWeight) {
        inputs.takeoffWeight = parseFloat(takeoffWeight);
      } else if (calculationMode === "fromEmptyWeight" && emptyWeight) {
        inputs.emptyWeight = parseFloat(emptyWeight);
      }

      // Add optional inputs
      if (fuelWeight) inputs.fuelWeight = parseFloat(fuelWeight);
      if (payloadWeight) inputs.payloadWeight = parseFloat(payloadWeight);
      if (crewWeight) inputs.crewWeight = parseFloat(crewWeight);
      if (range) inputs.range = parseFloat(range);
      if (endurance) inputs.endurance = parseFloat(endurance);
      if (cruiseSpeed) inputs.cruiseSpeed = parseFloat(cruiseSpeed);
      if (cruiseAltitude) inputs.cruiseAltitude = parseFloat(cruiseAltitude);

      // Constraints
      if (mtow) inputs.mtow = parseFloat(mtow);
      if (mzfw) inputs.mzfw = parseFloat(mzfw);
      if (maxFuelCapacity) inputs.maxFuelCapacity = parseFloat(maxFuelCapacity);

      // Validate inputs
      if (calculationMode === "fromTakeoffWeight" && !takeoffWeight) {
        throw new Error("Please enter a takeoff weight.");
      }
      if (calculationMode === "fromEmptyWeight" && !emptyWeight) {
        throw new Error("Please enter an empty weight.");
      }

      const result = calculateAircraftWeight(inputs);
      setResults(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during calculation.");
      }
      setResults(null);
    }
  }, [
    calculationMode,
    aircraftType,
    missionType,
    takeoffWeight,
    emptyWeight,
    fuelWeight,
    payloadWeight,
    crewWeight,
    range,
    endurance,
    cruiseSpeed,
    cruiseAltitude,
    weightUnit,
    distanceUnit,
    mtow,
    mzfw,
    maxFuelCapacity,
  ]);

  // Recalculate when inputs change
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // Get aircraft and mission options
  const aircraftOptions = getAircraftTypeOptions();
  const missionOptions = getMissionTypeOptions();

  // Format numbers for display
  const formatNumber = (num: number, decimals = 0) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format percentage
  const formatPercentage = (fraction: number, decimals = 1) => {
    return (fraction * 100).toFixed(decimals);
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="aircraft-weight-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Calculate aircraft weight breakdown and analyze weight fractions for different aircraft types and mission
            profiles. This tool provides comprehensive weight analysis for preliminary aircraft design and mission
            planning.
          </p>

          {/* Calculation Mode Selection */}
          <div className="mb-6">
            <Label className="mb-1">Calculation Mode</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {[
                { id: "fromTakeoffWeight", label: "From Takeoff Weight" },
                { id: "fromEmptyWeight", label: "From Empty Weight" },
                { id: "fromMission", label: "From Mission Requirements" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setCalculationMode(mode.id as CalculationMode);
                    setError(null);
                    setResults(null);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    calculationMode === mode.id
                      ? "bg-card text-primary shadow"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aircraft Type and Mission */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="aircraft-type">Aircraft Type</Label>
              <Select value={aircraftType} onValueChange={(value) => setAircraftType(value as AircraftType)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aircraftOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mission-type">Mission Type</Label>
              <Select value={missionType} onValueChange={(value) => setMissionType(value as MissionType)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {missionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Weight Inputs */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Weight Parameters</h3>

            {/* Takeoff Weight Input */}
            {calculationMode === "fromTakeoffWeight" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="takeoff-weight">Takeoff Weight</Label>
                  <Input
                    type="number"
                    id="takeoff-weight"
                    value={takeoffWeight}
                    onChange={(e) => setTakeoffWeight(e.target.value)}
                    placeholder="e.g., 80000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight-unit">Unit</Label>
                  <Select value={weightUnit} onValueChange={(value) => setWeightUnit(value as WeightUnit)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="lb">Pound (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Empty Weight Input */}
            {calculationMode === "fromEmptyWeight" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="empty-weight">Empty Weight</Label>
                  <Input
                    type="number"
                    id="empty-weight"
                    value={emptyWeight}
                    onChange={(e) => setEmptyWeight(e.target.value)}
                    placeholder="e.g., 40000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight-unit">Unit</Label>
                  <Select value={weightUnit} onValueChange={(value) => setWeightUnit(value as WeightUnit)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="lb">Pound (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Optional Weight Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fuel-weight">Fuel Weight (Optional)</Label>
                <Input
                  type="number"
                  id="fuel-weight"
                  value={fuelWeight}
                  onChange={(e) => setFuelWeight(e.target.value)}
                  placeholder="Auto-calculated"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="payload-weight">Payload Weight (Optional)</Label>
                <Input
                  type="number"
                  id="payload-weight"
                  value={payloadWeight}
                  onChange={(e) => setPayloadWeight(e.target.value)}
                  placeholder="Auto-calculated"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="crew-weight">Crew Weight (Optional)</Label>
                <Input
                  type="number"
                  id="crew-weight"
                  value={crewWeight}
                  onChange={(e) => setCrewWeight(e.target.value)}
                  placeholder="Auto-calculated"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Constraints</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="mtow">MTOW</Label>
                <Input
                  type="number"
                  id="mtow"
                  value={mtow}
                  onChange={(e) => setMtow(e.target.value)}
                  placeholder="e.g., 80000"
                  className="mt-1"
                />
                <div className="text-muted-foreground mt-1 text-xs">Maximum Takeoff Weight ({weightUnit})</div>
              </div>
              <div>
                <Label htmlFor="mzfw">MZFW</Label>
                <Input
                  type="number"
                  id="mzfw"
                  value={mzfw}
                  onChange={(e) => setMzfw(e.target.value)}
                  placeholder="e.g., 60000"
                  className="mt-1"
                />
                <div className="text-muted-foreground mt-1 text-xs">Max Zero Fuel Weight ({weightUnit})</div>
              </div>
              <div>
                <Label htmlFor="max-fuel">Max Fuel Capacity</Label>
                <Input
                  type="number"
                  id="max-fuel"
                  value={maxFuelCapacity}
                  onChange={(e) => setMaxFuelCapacity(e.target.value)}
                  placeholder="e.g., 20000"
                  className="mt-1"
                />
                <div className="text-muted-foreground mt-1 text-xs">Usable fuel capacity ({weightUnit})</div>
              </div>
            </div>
          </div>

          {/* Weight Analysis Validation */}
          {results && (
            <div className="mb-4">
              <div
                className={`rounded-md p-4 ${results.isValid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
              >
                <div className="flex items-start gap-3">
                  {results.isValid ? (
                    <FaCheck className="text-success mt-1 h-5 w-5 shrink-0" />
                  ) : (
                    <FaExclamationTriangle className="text-warning mt-1 h-5 w-5 shrink-0" />
                  )}
                  <div className="flex-1">
                    {results.isValid ? (
                      <p className="text-sm">All weight fractions sum to 100% and are within typical ranges.</p>
                    ) : (
                      <div>
                        <p className="mb-2 text-sm">Weight analysis has issues:</p>
                        <ul className="space-y-1 text-sm">
                          {results.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Derived Weights */}
          {results && (
            <div className="mb-6">
              <div className="border-border rounded-lg border p-4">
                <h3 className="text-foreground mb-2 text-sm font-medium">Derived Weights</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-muted-foreground text-xs">OEW (Empty + Crew)</div>
                    <div className="text-foreground font-medium">
                      {formatNumber(results.emptyWeight + results.crewWeight)} {weightUnit}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">ZFW (Empty + Payload)</div>
                    <div className="text-foreground font-medium">
                      {formatNumber(results.emptyWeight + results.payloadWeight)} {weightUnit}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">TOW (Empty + Crew + Payload + Fuel)</div>
                    <div className="text-foreground font-medium">
                      {formatNumber(results.takeoffWeight)} {weightUnit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mission Parameters */}
          <div className="mb-6 space-y-4">
            <h3 className="text-foreground text-lg font-medium">Mission Parameters (Optional)</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="range">Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    id="range"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="Auto-calculated"
                    className="mt-1 flex-1"
                  />
                  <Select value={distanceUnit} onValueChange={(value) => setDistanceUnit(value as DistanceUnit)}>
                    <SelectTrigger className="mt-1 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">km</SelectItem>
                      <SelectItem value="nm">nm</SelectItem>
                      <SelectItem value="mi">mi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="endurance">Endurance (hours)</Label>
                <Input
                  type="number"
                  id="endurance"
                  value={endurance}
                  onChange={(e) => setEndurance(e.target.value)}
                  placeholder="Auto-calculated"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cruise-speed">Cruise Speed (m/s)</Label>
                <Input
                  type="number"
                  id="cruise-speed"
                  value={cruiseSpeed}
                  onChange={(e) => setCruiseSpeed(e.target.value)}
                  placeholder="Auto-calculated"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cruise-altitude">Cruise Altitude (m)</Label>
                <Input
                  type="number"
                  id="cruise-altitude"
                  value={cruiseAltitude}
                  onChange={(e) => setCruiseAltitude(e.target.value)}
                  placeholder="Auto-calculated"
                  className="mt-1"
                />
              </div>
            </div>
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
        <div className="border-border bg-card rounded-lg border p-6 pt-2 shadow-lg">
          {results ? (
            <div className="space-y-6">
              {/* Weight Breakdown Chart */}
              <Visualization result={results} weightUnit={weightUnit} distanceUnit={distanceUnit} />

              {/* Weight Breakdown */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaWeight className="mt-1 h-6 w-6 shrink-0 text-blue-500" />
                  <div>
                    <div className="text-foreground font-medium">Takeoff Weight</div>
                    <div className="text-primary text-lg font-semibold">
                      {formatNumber(results.takeoffWeight)} {weightUnit}
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">Total aircraft weight</div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaPlaneDeparture className="mt-1 h-6 w-6 shrink-0 text-green-500" />
                  <div>
                    <div className="text-foreground font-medium">Empty Weight</div>
                    <div className="text-foreground text-base font-semibold">
                      {formatNumber(results.emptyWeight)} {weightUnit}
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {formatPercentage(results.emptyWeightFraction)}% of takeoff weight
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaGasPump className="mt-1 h-6 w-6 shrink-0 text-red-500" />
                  <div>
                    <div className="text-foreground font-medium">Fuel Weight</div>
                    <div className="text-foreground text-base font-semibold">
                      {formatNumber(results.fuelWeight)} {weightUnit}
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {formatPercentage(results.fuelWeightFraction)}% of takeoff weight
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaUsers className="mt-1 h-6 w-6 shrink-0 text-purple-500" />
                  <div>
                    <div className="text-foreground font-medium">Payload Weight</div>
                    <div className="text-foreground text-base font-semibold">
                      {formatNumber(results.payloadWeight)} {weightUnit}
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {formatPercentage(results.payloadWeightFraction)}% of takeoff weight
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission Parameters */}
              <div className="border-border rounded-lg border p-4">
                <h3 className="text-foreground mb-4 text-lg font-medium">Mission Parameters</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaRuler className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                      <div className="text-foreground font-medium">Range</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.range)} {distanceUnit}
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaTachometerAlt className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <div className="text-foreground font-medium">Endurance</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.endurance, 1)} hours
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaTachometerAlt className="mt-1 h-5 w-5 shrink-0 text-orange-600" />
                    <div>
                      <div className="text-foreground font-medium">Cruise Speed</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.cruiseSpeed)} m/s
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        {formatNumber(results.cruiseSpeed * 3.6)} km/h
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaRuler className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
                    <div>
                      <div className="text-foreground font-medium">Cruise Altitude</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.cruiseAltitude)} m
                      </div>
                      <div className="text-muted-foreground mt-1 text-sm">
                        {formatNumber(results.cruiseAltitude / 1000, 1)} km
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="border-border rounded-lg border p-4">
                <h3 className="text-foreground mb-4 text-lg font-medium">Performance Metrics</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaBalanceScale className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                    <div>
                      <div className="text-foreground font-medium">Wing Loading</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.wingLoading)} N/m²
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaTachometerAlt className="mt-1 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <div className="text-foreground font-medium">Thrust-to-Weight Ratio</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.thrustToWeightRatio, 2)}
                      </div>
                    </div>
                  </div>

                  <div className="border-border flex items-start gap-4 rounded-lg border p-3">
                    <FaGasPump className="mt-1 h-5 w-5 shrink-0 text-yellow-600" />
                    <div>
                      <div className="text-foreground font-medium">Fuel Consumption</div>
                      <div className="text-foreground text-lg font-semibold">
                        {formatNumber(results.fuelConsumption)} kg/h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-48 items-center justify-center">
              <p>Enter parameters to calculate aircraft weight breakdown</p>
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
