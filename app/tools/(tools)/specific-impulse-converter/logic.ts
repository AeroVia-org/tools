// Constants
export const G0 = 9.80665; // Standard gravity (m/s²)

export interface SpecificImpulseResult {
  // Input values
  inputValue: number;
  inputUnit: SpecificImpulseUnit;

  // Converted values
  seconds: number;
  metersPerSecond: number;
  feetPerSecond: number;
  kilometersPerSecond: number;

  // Additional calculations
  effectiveExhaustVelocity: number; // m/s
  thrustPerMassFlow: number; // N/(kg/s)

  // Performance indicators
  performanceCategory: string;
  performanceColor: string;
  typicalApplications: string[];
}

export type SpecificImpulseUnit = "seconds" | "m/s" | "ft/s" | "km/s";

/**
 * Converts specific impulse between different units and provides additional calculations.
 * @param value The input value
 * @param unit The input unit
 * @returns SpecificImpulseResult object with all conversions and calculations
 * @throws Error if parameters are invalid
 */
export function convertSpecificImpulse(value: number, unit: SpecificImpulseUnit): SpecificImpulseResult {
  if (value <= 0) {
    throw new Error("Specific impulse must be positive.");
  }
  if (isNaN(value)) {
    throw new Error("Please enter a valid number.");
  }

  // Convert input to seconds first
  let seconds: number;
  switch (unit) {
    case "seconds":
      seconds = value;
      break;
    case "m/s":
      seconds = value / G0;
      break;
    case "ft/s":
      seconds = value / (G0 * 3.28084); // Convert ft/s to m/s, then to seconds
      break;
    case "km/s":
      seconds = (value * 1000) / G0; // Convert km/s to m/s, then to seconds
      break;
    default:
      throw new Error("Invalid unit specified.");
  }

  // Calculate all other units
  const metersPerSecond = seconds * G0;
  const feetPerSecond = metersPerSecond * 3.28084;
  const kilometersPerSecond = metersPerSecond / 1000;

  // Additional calculations
  const effectiveExhaustVelocity = metersPerSecond; // Same as m/s
  const thrustPerMassFlow = metersPerSecond; // N/(kg/s) = m/s for specific impulse

  // Determine performance category
  const { performanceCategory, performanceColor, typicalApplications } = getPerformanceCategory(seconds);

  return {
    inputValue: value,
    inputUnit: unit,
    seconds,
    metersPerSecond,
    feetPerSecond,
    kilometersPerSecond,
    effectiveExhaustVelocity,
    thrustPerMassFlow,
    performanceCategory,
    performanceColor,
    typicalApplications,
  };
}

/**
 * Determines the performance category based on specific impulse in seconds.
 * @param seconds Specific impulse in seconds
 * @returns Object with category, color, and typical applications
 */
function getPerformanceCategory(seconds: number): {
  performanceCategory: string;
  performanceColor: string;
  typicalApplications: string[];
} {
  if (seconds < 200) {
    return {
      performanceCategory: "Low Performance",
      performanceColor: "text-red-600",
      typicalApplications: ["Cold gas thrusters", "Some monopropellants"],
    };
  } else if (seconds < 300) {
    return {
      performanceCategory: "Moderate Performance",
      performanceColor: "text-orange-600",
      typicalApplications: ["Hydrazine monopropellant", "Some bipropellants"],
    };
  } else if (seconds < 400) {
    return {
      performanceCategory: "Good Performance",
      performanceColor: "text-yellow-600",
      typicalApplications: ["LOX/RP-1", "LOX/LH2", "Most bipropellants"],
    };
  } else if (seconds < 500) {
    return {
      performanceCategory: "High Performance",
      performanceColor: "text-green-600",
      typicalApplications: ["LOX/LH2 (optimized)", "Advanced bipropellants"],
    };
  } else if (seconds < 1000) {
    return {
      performanceCategory: "Very High Performance",
      performanceColor: "text-blue-600",
      typicalApplications: ["Electric propulsion", "Ion engines", "Hall thrusters"],
    };
  } else {
    return {
      performanceCategory: "Exceptional Performance",
      performanceColor: "text-purple-600",
      typicalApplications: ["Advanced electric propulsion", "Nuclear thermal", "Fusion concepts"],
    };
  }
}

/**
 * Gets common specific impulse values for reference.
 * @returns Array of common values with their units and applications
 */
export function getCommonSpecificImpulseValues(): Array<{
  value: number;
  unit: SpecificImpulseUnit;
  application: string;
  description: string;
}> {
  return [
    {
      value: 150,
      unit: "seconds",
      application: "Cold Gas Thruster",
      description: "Nitrogen or helium cold gas propulsion",
    },
    {
      value: 230,
      unit: "seconds",
      application: "Hydrazine Monopropellant",
      description: "Common satellite propulsion system",
    },
    {
      value: 350,
      unit: "seconds",
      application: "LOX/RP-1",
      description: "Liquid oxygen and kerosene rocket fuel",
    },
    {
      value: 450,
      unit: "seconds",
      application: "LOX/LH2",
      description: "Liquid oxygen and liquid hydrogen",
    },
    {
      value: 3000,
      unit: "seconds",
      application: "Ion Engine",
      description: "Xenon ion propulsion system",
    },
    {
      value: 1500,
      unit: "seconds",
      application: "Hall Thruster",
      description: "Electric propulsion for satellites",
    },
  ];
}
