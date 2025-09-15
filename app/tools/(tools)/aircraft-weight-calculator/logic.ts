// Aircraft Weight Calculator Logic
// Implements comprehensive aircraft weight analysis and mission planning

export type AircraftType =
  | "commercial-airliner"
  | "business-jet"
  | "military-transport"
  | "military-fighter"
  | "helicopter"
  | "general-aviation"
  | "uav";

export type MissionType = "short-range" | "medium-range" | "long-range" | "endurance" | "ferry" | "training";

export type WeightUnit = "kg" | "lb";
export type DistanceUnit = "km" | "nm" | "mi";

export interface AircraftWeightInputs {
  aircraftType: AircraftType;
  missionType: MissionType;
  takeoffWeight?: number;
  emptyWeight?: number;
  fuelWeight?: number;
  payloadWeight?: number;
  crewWeight?: number;
  range?: number;
  endurance?: number; // hours
  cruiseSpeed?: number; // m/s
  cruiseAltitude?: number; // m
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  // Optional structural/operational constraints (in weightUnit)
  mtow?: number; // Maximum Takeoff Weight
  mzfw?: number; // Maximum Zero Fuel Weight (empty + payload)
  maxFuelCapacity?: number; // Maximum usable fuel capacity
}

export interface AircraftWeightResult {
  // Weight breakdown
  takeoffWeight: number;
  emptyWeight: number;
  fuelWeight: number;
  payloadWeight: number;
  crewWeight: number;

  // Weight fractions
  emptyWeightFraction: number;
  fuelWeightFraction: number;
  payloadWeightFraction: number;
  crewWeightFraction: number;

  // Mission parameters
  range: number;
  endurance: number;
  cruiseSpeed: number;
  cruiseAltitude: number;

  // Performance metrics
  wingLoading: number; // N/m²
  thrustToWeightRatio: number;
  fuelConsumption: number; // kg/h (average over mission)

  // Range–payload points (kg payload vs km range)
  rangePayloadPoints?: Array<{ range: number; payload: number }>;

  // Validation
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

// Aircraft type characteristics database (simplified, research-informed defaults)
// Notes:
// - L/D and c (1/hr) are typical cruise values used in Breguet equations.
// - Fractions for empty/payload/crew are only used for initial partitioning when inputs are missing.
const AIRCRAFT_CHARACTERISTICS = {
  "commercial-airliner": {
    emptyWeightFraction: 0.47,
    fuelWeightFraction: 0.25,
    payloadWeightFraction: 0.23,
    crewWeightFraction: 0.05,
    typicalRange: 5000, // km
    typicalCruiseSpeed: 250, // m/s (~485 kt)
    typicalCruiseAltitude: 11000, // m
    wingLoading: 6000, // N/m²
    thrustToWeightRatio: 0.3,
    liftToDrag: 17,
    cCruise: 0.6, // 1/hr
  },
  "business-jet": {
    emptyWeightFraction: 0.52,
    fuelWeightFraction: 0.28,
    payloadWeightFraction: 0.15,
    crewWeightFraction: 0.05,
    typicalRange: 6000, // km
    typicalCruiseSpeed: 220, // m/s
    typicalCruiseAltitude: 13000, // m
    wingLoading: 4000, // N/m²
    thrustToWeightRatio: 0.4,
    liftToDrag: 15,
    cCruise: 0.65, // 1/hr
  },
  "military-transport": {
    emptyWeightFraction: 0.42,
    fuelWeightFraction: 0.34,
    payloadWeightFraction: 0.19,
    crewWeightFraction: 0.05,
    typicalRange: 4000, // km
    typicalCruiseSpeed: 200, // m/s
    typicalCruiseAltitude: 9000, // m
    wingLoading: 5000, // N/m²
    thrustToWeightRatio: 0.35,
    liftToDrag: 14,
    cCruise: 0.65, // 1/hr
  },
  "military-fighter": {
    emptyWeightFraction: 0.6,
    fuelWeightFraction: 0.25,
    payloadWeightFraction: 0.1,
    crewWeightFraction: 0.05,
    typicalRange: 2000, // km
    typicalCruiseSpeed: 300, // m/s
    typicalCruiseAltitude: 15000, // m
    wingLoading: 8000, // N/m²
    thrustToWeightRatio: 0.8,
    liftToDrag: 9,
    cCruise: 0.9, // 1/hr
  },
  helicopter: {
    emptyWeightFraction: 0.55,
    fuelWeightFraction: 0.22,
    payloadWeightFraction: 0.18,
    crewWeightFraction: 0.05,
    typicalRange: 500, // km
    typicalCruiseSpeed: 60, // m/s
    typicalCruiseAltitude: 3000, // m
    wingLoading: 0, // Not applicable
    thrustToWeightRatio: 1.2,
    liftToDrag: 5, // effective
    cCruise: 0.8, // 1/hr (effective)
  },
  "general-aviation": {
    emptyWeightFraction: 0.64,
    fuelWeightFraction: 0.2,
    payloadWeightFraction: 0.11,
    crewWeightFraction: 0.05,
    typicalRange: 1000, // km
    typicalCruiseSpeed: 80, // m/s
    typicalCruiseAltitude: 3000, // m
    wingLoading: 2000, // N/m²
    thrustToWeightRatio: 0.2,
    liftToDrag: 11,
    cCruise: 0.45, // 1/hr (effective)
  },
  uav: {
    emptyWeightFraction: 0.7,
    fuelWeightFraction: 0.2,
    payloadWeightFraction: 0.05,
    crewWeightFraction: 0.05,
    typicalRange: 200, // km
    typicalCruiseSpeed: 50, // m/s
    typicalCruiseAltitude: 5000, // m
    wingLoading: 1500, // N/m²
    thrustToWeightRatio: 0.3,
    liftToDrag: 12,
    cCruise: 0.5, // 1/hr (effective)
  },
} as const;

// Mission type characteristics and simple segment factors
const MISSION_CHARACTERISTICS = {
  "short-range": {
    rangeMultiplier: 0.5,
    fuelMultiplier: 1.0,
    payloadMultiplier: 1.1,
    preCruiseFraction: 0.985, // taxi/takeoff/climb
    postCruiseFraction: 0.99, // descent/approach/landing
    reserveLoiterMinutes: 30,
  },
  "medium-range": {
    rangeMultiplier: 1.0,
    fuelMultiplier: 1.0,
    payloadMultiplier: 1.0,
    preCruiseFraction: 0.98,
    postCruiseFraction: 0.99,
    reserveLoiterMinutes: 45,
  },
  "long-range": {
    rangeMultiplier: 2.0,
    fuelMultiplier: 1.2,
    payloadMultiplier: 0.8,
    preCruiseFraction: 0.975,
    postCruiseFraction: 0.99,
    reserveLoiterMinutes: 45,
  },
  endurance: {
    rangeMultiplier: 0.3,
    fuelMultiplier: 1.1,
    payloadMultiplier: 0.6,
    preCruiseFraction: 0.985,
    postCruiseFraction: 0.995,
    reserveLoiterMinutes: 15,
  },
  ferry: {
    rangeMultiplier: 1.5,
    fuelMultiplier: 1.3,
    payloadMultiplier: 0.1,
    preCruiseFraction: 0.98,
    postCruiseFraction: 0.99,
    reserveLoiterMinutes: 30,
  },
  training: {
    rangeMultiplier: 0.3,
    fuelMultiplier: 0.7,
    payloadMultiplier: 0.8,
    preCruiseFraction: 0.99,
    postCruiseFraction: 0.995,
    reserveLoiterMinutes: 30,
  },
} as const;

// Conversion factors
const KG_TO_LB = 2.20462;
const LB_TO_KG = 0.453592;
const KM_TO_NM = 0.539957;
const NM_TO_KM = 1.852;
const KM_TO_MI = 0.621371;
const MI_TO_KM = 1.60934;

// Convert weight units
function convertWeight(value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return value;
  if (fromUnit === "kg" && toUnit === "lb") return value * KG_TO_LB;
  if (fromUnit === "lb" && toUnit === "kg") return value * LB_TO_KG;
  return value;
}

// Convert distance units
function convertDistance(value: number, fromUnit: DistanceUnit, toUnit: DistanceUnit): number {
  if (fromUnit === toUnit) return value;

  // Convert to km first
  let kmValue = value;
  if (fromUnit === "nm") kmValue = value * NM_TO_KM;
  if (fromUnit === "mi") kmValue = value * MI_TO_KM;

  // Convert from km to target unit
  if (toUnit === "nm") return kmValue * KM_TO_NM;
  if (toUnit === "mi") return kmValue * KM_TO_MI;
  return kmValue;
}

// Breguet helpers (simplified)
function breguetCruiseFractionForRangeKm(rangeKm: number, V_ms: number, c_per_hr: number, liftToDrag: number): number {
  const V_kmh = Math.max(1e-6, V_ms * 3.6);
  const exponent = -c_per_hr * (rangeKm / (V_kmh * Math.max(1e-6, liftToDrag)));
  return Math.exp(exponent);
}

function breguetCruiseRangeKmFromFraction(fCruise: number, V_ms: number, c_per_hr: number, liftToDrag: number): number {
  const V_kmh = Math.max(1e-6, V_ms * 3.6);
  const frac = Math.min(Math.max(fCruise, 1e-6), 0.999999);
  return (V_kmh / c_per_hr) * liftToDrag * Math.log(1 / frac);
}

function loiterFractionForMinutes(minutes: number, c_per_hr: number, liftToDrag: number): number {
  const hours = Math.max(0, minutes) / 60;
  const exponent = -c_per_hr * (hours / Math.max(1e-6, liftToDrag));
  return Math.exp(exponent);
}

// Main calculation function
export function calculateAircraftWeight(inputs: AircraftWeightInputs): AircraftWeightResult {
  const characteristics = AIRCRAFT_CHARACTERISTICS[inputs.aircraftType];
  const mission = MISSION_CHARACTERISTICS[inputs.missionType];

  const warnings: string[] = [];
  const errors: string[] = [];

  // Convert all inputs to metric (kg, km)
  const takeoffWeightKgIn = inputs.takeoffWeight ? convertWeight(inputs.takeoffWeight, inputs.weightUnit, "kg") : 0;
  const emptyWeightKgIn = inputs.emptyWeight ? convertWeight(inputs.emptyWeight, inputs.weightUnit, "kg") : 0;
  const fuelWeightKgIn = inputs.fuelWeight ? convertWeight(inputs.fuelWeight, inputs.weightUnit, "kg") : 0;
  const payloadWeightKgIn = inputs.payloadWeight ? convertWeight(inputs.payloadWeight, inputs.weightUnit, "kg") : 0;
  const crewWeightKgIn = inputs.crewWeight ? convertWeight(inputs.crewWeight, inputs.weightUnit, "kg") : 0;

  const mtowKg = inputs.mtow ? convertWeight(inputs.mtow, inputs.weightUnit, "kg") : undefined;
  const mzfwKg = inputs.mzfw ? convertWeight(inputs.mzfw, inputs.weightUnit, "kg") : undefined;
  const maxFuelCapacityKg = inputs.maxFuelCapacity
    ? convertWeight(inputs.maxFuelCapacity, inputs.weightUnit, "kg")
    : undefined;

  const rangeKmIn = inputs.range ? convertDistance(inputs.range, inputs.distanceUnit, "km") : 0;

  // Choose base TOW / partition
  let takeoffWeight = takeoffWeightKgIn;
  if (takeoffWeight <= 0 && emptyWeightKgIn > 0) {
    takeoffWeight = emptyWeightKgIn / Math.max(1e-6, characteristics.emptyWeightFraction);
  }
  if (takeoffWeight <= 0) {
    takeoffWeight = 10000; // default guess
  }

  const emptyWeight = emptyWeightKgIn > 0 ? emptyWeightKgIn : takeoffWeight * characteristics.emptyWeightFraction;
  const crewWeight = crewWeightKgIn > 0 ? crewWeightKgIn : takeoffWeight * characteristics.crewWeightFraction;
  let payloadWeight =
    payloadWeightKgIn > 0
      ? payloadWeightKgIn
      : takeoffWeight * characteristics.payloadWeightFraction * mission.payloadMultiplier;
  let fuelWeight = fuelWeightKgIn > 0 ? fuelWeightKgIn : takeoffWeight * characteristics.fuelWeightFraction;

  // Apply MZFW early to payload
  if (mzfwKg !== undefined) {
    const zfw = emptyWeight + payloadWeight;
    if (zfw > mzfwKg) {
      payloadWeight = Math.max(0, mzfwKg - emptyWeight);
      warnings.push("Payload capped by MZFW (empty + payload exceeds MZFW)");
    }
    if (mzfwKg < emptyWeight) {
      warnings.push("MZFW is below empty weight; payload forced to 0");
    }
  }

  // Mission aerodynamic params
  const V_ms = inputs.cruiseSpeed || characteristics.typicalCruiseSpeed;
  const cruiseAltitude = inputs.cruiseAltitude || characteristics.typicalCruiseAltitude; // presently unused in model
  const L_D = characteristics.liftToDrag;
  const cCruise = characteristics.cCruise * mission.fuelMultiplier; // simple scaling by mission difficulty

  // Segment fractions
  const fPre = mission.preCruiseFraction;
  const fPost = mission.postCruiseFraction;
  const fReserve = loiterFractionForMinutes(mission.reserveLoiterMinutes, cCruise, L_D);

  // Compute fuel from range or range from fuel using Breguet
  const computeFuelFromRange = (tow: number, rangeKm: number): number => {
    const fCruise = breguetCruiseFractionForRangeKm(rangeKm, V_ms, cCruise, L_D);
    const fOverall = fPre * fCruise * fPost * fReserve;
    const fuel = Math.max(0, tow * (1 - fOverall));
    return fuel;
  };

  const computeRangeFromFuel = (tow: number, fuelKg: number): number => {
    const fOverall = Math.max(1e-6, 1 - fuelKg / Math.max(1e-6, tow));
    const fCruise = Math.min(Math.max(fOverall / Math.max(1e-6, fPre * fPost * fReserve), 1e-6), 0.999999);
    return breguetCruiseRangeKmFromFraction(fCruise, V_ms, cCruise, L_D);
  };

  // If user provided range, compute fuel to achieve it; else compute range from current fuel
  if (rangeKmIn > 0) {
    fuelWeight = computeFuelFromRange(takeoffWeight, rangeKmIn);
  }

  // Apply max fuel capacity
  if (maxFuelCapacityKg !== undefined && fuelWeight > maxFuelCapacityKg) {
    fuelWeight = maxFuelCapacityKg;
    warnings.push("Fuel capped by maximum fuel capacity");
  }

  // Recompute TOW and apply MTOW constraint (reduce fuel first, then payload)
  let currentTOW = emptyWeight + crewWeight + payloadWeight + fuelWeight;
  if (mtowKg !== undefined && currentTOW > mtowKg) {
    warnings.push("Takeoff weight exceeds MTOW; reducing fuel then payload");
  }
  if (mtowKg !== undefined && currentTOW > mtowKg) {
    let excess = currentTOW - mtowKg;
    const fuelReduction = Math.min(fuelWeight, excess);
    fuelWeight -= fuelReduction;
    excess -= fuelReduction;
    if (fuelReduction > 0) warnings.push("Fuel reduced to meet MTOW");

    if (excess > 0) {
      const payloadReduction = Math.min(payloadWeight, excess);
      payloadWeight -= payloadReduction;
      excess -= payloadReduction;
      if (payloadReduction > 0) warnings.push("Payload reduced to meet MTOW");
    }

    currentTOW = emptyWeight + crewWeight + payloadWeight + fuelWeight;
  }

  // Final range/endurance calculations
  const rangeKm = rangeKmIn > 0 ? rangeKmIn : computeRangeFromFuel(currentTOW, fuelWeight);
  const cruiseTimeHours = Math.max(0, rangeKm) / Math.max(1e-6, V_ms * 3.6);
  const reserveTimeHours = mission.reserveLoiterMinutes / 60;
  const enduranceHours =
    inputs.endurance && inputs.endurance > 0 ? inputs.endurance : cruiseTimeHours + reserveTimeHours;

  // Performance metrics
  const wingLoading = characteristics.wingLoading;
  const thrustToWeightRatio = characteristics.thrustToWeightRatio;
  const fuelConsumption = enduranceHours > 0 ? fuelWeight / enduranceHours : 0;

  // Weight fractions
  const emptyWeightFraction = emptyWeight / Math.max(1e-6, currentTOW);
  const fuelWeightFraction = fuelWeight / Math.max(1e-6, currentTOW);
  const payloadWeightFraction = payloadWeight / Math.max(1e-6, currentTOW);
  const crewWeightFraction = crewWeight / Math.max(1e-6, currentTOW);

  // Sanity warnings
  const fractionSum = emptyWeightFraction + fuelWeightFraction + payloadWeightFraction + crewWeightFraction;
  if (Math.abs(fractionSum - 1) > 0.01) {
    warnings.push(`Weight fractions sum to ${(fractionSum * 100).toFixed(1)}% instead of 100%`);
  }

  // Range–payload points using Breguet
  const oew = emptyWeight + crewWeight;
  const mtowRef = mtowKg ?? currentTOW;
  const payloadMax = Math.max(0, mzfwKg !== undefined ? Math.min(payloadWeight, mzfwKg - emptyWeight) : payloadWeight);

  const computeRangeFromFuelAtTow = (tow: number, fuelKg: number): number => computeRangeFromFuel(tow, fuelKg);

  // B: MTOW with payloadMax
  const fuelAtB_unclamped = Math.max(0, mtowRef - oew - payloadMax);
  const fuelAtB = Math.max(0, Math.min(fuelAtB_unclamped, maxFuelCapacityKg ?? fuelWeight));
  const rangeB = computeRangeFromFuelAtTow(oew + payloadMax + fuelAtB, fuelAtB);

  // C: MTOW with full tanks and positive payload
  const fuelMax = Math.max(0, Math.min(maxFuelCapacityKg ?? fuelWeight, mtowRef - oew));
  let payloadC = Math.max(0, mtowRef - oew - fuelMax);
  if (mzfwKg !== undefined) payloadC = Math.max(0, Math.min(payloadC, mzfwKg - emptyWeight));
  const rangeC = computeRangeFromFuelAtTow(oew + payloadC + fuelMax, fuelMax);

  // D: Zero payload, full tanks (ferry)
  const towD = oew + fuelMax;
  const rangeD = computeRangeFromFuelAtTow(towD, fuelMax);

  const rawPoints: Array<{ range: number; payload: number }> = [
    { range: 0, payload: payloadMax },
    { range: rangeB, payload: payloadMax },
    { range: rangeC, payload: payloadC },
    { range: rangeD, payload: 0 },
  ];
  const uniquePoints = rawPoints.filter(
    (p, idx, arr) =>
      idx === arr.findIndex((q) => Math.abs(q.range - p.range) < 1e-6 && Math.abs(q.payload - p.payload) < 1e-6),
  );
  uniquePoints.sort((a, b) => a.range - b.range);
  const rangePayloadPoints = uniquePoints;

  const isValid = errors.length === 0 && warnings.length === 0;

  return {
    takeoffWeight: currentTOW,
    emptyWeight,
    fuelWeight,
    payloadWeight,
    crewWeight,
    emptyWeightFraction,
    fuelWeightFraction,
    payloadWeightFraction,
    crewWeightFraction,
    range: rangeKm,
    endurance: enduranceHours,
    cruiseSpeed: V_ms,
    cruiseAltitude,
    wingLoading,
    thrustToWeightRatio,
    fuelConsumption,
    rangePayloadPoints,
    isValid,
    warnings,
    errors,
  };
}

// Get aircraft type options for UI
export function getAircraftTypeOptions() {
  return [
    { value: "commercial-airliner", label: "Commercial Airliner" },
    { value: "business-jet", label: "Business Jet" },
    { value: "military-transport", label: "Military Transport" },
    { value: "military-fighter", label: "Military Fighter" },
    { value: "helicopter", label: "Helicopter" },
    { value: "general-aviation", label: "General Aviation" },
    { value: "uav", label: "UAV/Drone" },
  ];
}

// Get mission type options for UI
export function getMissionTypeOptions() {
  return [
    { value: "short-range", label: "Short Range" },
    { value: "medium-range", label: "Medium Range" },
    { value: "long-range", label: "Long Range" },
    { value: "endurance", label: "Endurance" },
    { value: "ferry", label: "Ferry Flight" },
    { value: "training", label: "Training Mission" },
  ];
}

// Get aircraft characteristics for display
export function getAircraftCharacteristics(aircraftType: AircraftType) {
  return AIRCRAFT_CHARACTERISTICS[aircraftType];
}

// Get mission characteristics for display
export function getMissionCharacteristics(missionType: MissionType) {
  return MISSION_CHARACTERISTICS[missionType];
}
