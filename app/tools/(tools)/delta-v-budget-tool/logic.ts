// Constants
export const COMMON_MISSION_PHASES = [
  "Launch to LEO",
  "LEO to GTO",
  "GTO to GEO",
  "LEO to Moon",
  "Moon Landing",
  "Moon to Earth",
  "LEO to Mars",
  "Mars Landing",
  "Mars to Earth",
  "Deep Space Maneuver",
  "Station Keeping",
  "Deorbit",
  "Orbit Insertion",
  "Plane Change",
  "Altitude Change",
  "Attitude Control",
  "Rendezvous",
  "Docking",
  "Undocking",
  "Emergency Maneuver",
] as const;

export interface MissionPhase {
  id: string;
  name: string;
  deltaV: number; // m/s
  description?: string;
  category: "launch" | "transfer" | "orbital" | "landing" | "other";
  isEnabled: boolean;
}

export interface DeltaVBudgetResult {
  phases: MissionPhase[];
  totalDeltaV: number; // m/s
  totalDeltaVKm: number; // km/s
  enabledPhases: MissionPhase[];
  enabledTotalDeltaV: number; // m/s
  enabledTotalDeltaVKm: number; // km/s
  budgetBreakdown: {
    launch: number;
    transfer: number;
    orbital: number;
    landing: number;
    other: number;
  };
  missionComplexity: string;
  complexityColor: string;
  recommendations: string[];
}

export type VelocityUnit = "m/s" | "km/s" | "ft/s";

/**
 * Calculates the total delta-v budget from mission phases.
 * @param phases Array of mission phases with delta-v values
 * @returns DeltaVBudgetResult with comprehensive budget analysis
 */
export function calculateDeltaVBudget(phases: MissionPhase[]): DeltaVBudgetResult {
  if (!phases || phases.length === 0) {
    return {
      phases: [],
      totalDeltaV: 0,
      totalDeltaVKm: 0,
      enabledPhases: [],
      enabledTotalDeltaV: 0,
      enabledTotalDeltaVKm: 0,
      budgetBreakdown: {
        launch: 0,
        transfer: 0,
        orbital: 0,
        landing: 0,
        other: 0,
      },
      missionComplexity: "No Mission Defined",
      complexityColor: "text-muted-foreground",
      recommendations: ["Add mission phases to calculate delta-v budget"],
    };
  }

  // Calculate totals
  const totalDeltaV = phases.reduce((sum, phase) => sum + phase.deltaV, 0);
  const totalDeltaVKm = totalDeltaV / 1000;

  // Filter enabled phases
  const enabledPhases = phases.filter((phase) => phase.isEnabled);
  const enabledTotalDeltaV = enabledPhases.reduce((sum, phase) => sum + phase.deltaV, 0);
  const enabledTotalDeltaVKm = enabledTotalDeltaV / 1000;

  // Calculate budget breakdown by category
  const budgetBreakdown = phases.reduce(
    (breakdown, phase) => {
      if (phase.isEnabled) {
        breakdown[phase.category] += phase.deltaV;
      }
      return breakdown;
    },
    {
      launch: 0,
      transfer: 0,
      orbital: 0,
      landing: 0,
      other: 0,
    },
  );

  // Determine mission complexity
  const { missionComplexity, complexityColor, recommendations } = getMissionComplexity(enabledTotalDeltaV);

  return {
    phases,
    totalDeltaV,
    totalDeltaVKm,
    enabledPhases,
    enabledTotalDeltaV,
    enabledTotalDeltaVKm,
    budgetBreakdown,
    missionComplexity,
    complexityColor,
    recommendations,
  };
}

/**
 * Determines mission complexity based on delta-v requirements.
 * @param totalDeltaV Total delta-v in m/s
 * @returns Object with complexity assessment and recommendations
 */
function getMissionComplexity(totalDeltaV: number): {
  missionComplexity: string;
  complexityColor: string;
  recommendations: string[];
} {
  // Assess complexity based on total delta-v
  if (totalDeltaV < 2000) {
    return {
      missionComplexity: "Low Complexity",
      complexityColor: "text-green-600",
      recommendations: [
        "Simple mission with low delta-v requirements",
        "Consider single-stage or simple multi-stage design",
        "Minimal propellant mass fraction needed",
      ],
    };
  } else if (totalDeltaV < 5000) {
    return {
      missionComplexity: "Moderate Complexity",
      complexityColor: "text-yellow-600",
      recommendations: [
        "Moderate delta-v requirements",
        "Consider multi-stage rocket or efficient propulsion",
        "Plan for adequate propellant margins (10-20%)",
      ],
    };
  } else if (totalDeltaV < 10000) {
    return {
      missionComplexity: "High Complexity",
      complexityColor: "text-orange-600",
      recommendations: [
        "High delta-v requirements",
        "Requires advanced propulsion systems",
        "Consider electric propulsion for deep space phases",
        "Plan for significant propellant margins (20-30%)",
      ],
    };
  } else if (totalDeltaV < 20000) {
    return {
      missionComplexity: "Very High Complexity",
      complexityColor: "text-red-600",
      recommendations: [
        "Very high delta-v requirements",
        "Requires multiple propulsion systems",
        "Consider nuclear or advanced electric propulsion",
        "Plan for large propellant margins (30-50%)",
        "May require gravity assists or aerobraking",
      ],
    };
  } else {
    return {
      missionComplexity: "Extreme Complexity",
      complexityColor: "text-purple-600",
      recommendations: [
        "Extreme delta-v requirements",
        "Requires revolutionary propulsion technology",
        "Consider nuclear thermal or fusion propulsion",
        "Plan for massive propellant margins (50%+)",
        "Gravity assists and aerobraking essential",
        "May require in-situ resource utilization",
      ],
    };
  }
}

/**
 * Creates a new mission phase with default values.
 * @param name Phase name
 * @param deltaV Delta-v value in m/s
 * @param category Phase category
 * @param description Optional description
 * @returns New MissionPhase object
 */
export function createMissionPhase(
  name: string,
  deltaV: number,
  category: MissionPhase["category"],
  description?: string,
): MissionPhase {
  return {
    id: `phase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    deltaV,
    description,
    category,
    isEnabled: true,
  };
}

/**
 * Gets common delta-v values for reference.
 * @returns Array of common delta-v values with descriptions
 */
export function getCommonDeltaVValues(): Array<{
  name: string;
  deltaV: number;
  category: MissionPhase["category"];
  description: string;
}> {
  return [
    {
      name: "Launch to LEO",
      deltaV: 9400,
      category: "launch",
      description: "Earth surface to Low Earth Orbit (200km)",
    },
    {
      name: "LEO to GTO",
      deltaV: 2400,
      category: "transfer",
      description: "Low Earth Orbit to Geostationary Transfer Orbit",
    },
    {
      name: "GTO to GEO",
      deltaV: 1500,
      category: "orbital",
      description: "Geostationary Transfer Orbit to Geostationary Orbit",
    },
    {
      name: "LEO to Moon",
      deltaV: 3200,
      category: "transfer",
      description: "Low Earth Orbit to Lunar orbit",
    },
    {
      name: "Moon Landing",
      deltaV: 1800,
      category: "landing",
      description: "Lunar orbit to Moon surface",
    },
    {
      name: "Moon to Earth",
      deltaV: 800,
      category: "transfer",
      description: "Moon surface to Earth return trajectory",
    },
    {
      name: "LEO to Mars",
      deltaV: 3600,
      category: "transfer",
      description: "Low Earth Orbit to Mars transfer orbit",
    },
    {
      name: "Mars Landing",
      deltaV: 2000,
      category: "landing",
      description: "Mars orbit to Mars surface",
    },
    {
      name: "Mars to Earth",
      deltaV: 2100,
      category: "transfer",
      description: "Mars surface to Earth return trajectory",
    },
    {
      name: "Station Keeping",
      deltaV: 50,
      category: "orbital",
      description: "Annual station keeping for GEO satellites",
    },
    {
      name: "Deorbit",
      deltaV: 100,
      category: "orbital",
      description: "Deorbit burn for atmospheric reentry",
    },
    {
      name: "Plane Change (10°)",
      deltaV: 1400,
      category: "orbital",
      description: "10-degree orbital plane change in LEO",
    },
    {
      name: "Altitude Change (100km)",
      deltaV: 200,
      category: "orbital",
      description: "100km altitude change in LEO",
    },
  ];
}

/**
 * Converts delta-v between different units.
 * @param value Delta-v value
 * @param fromUnit Source unit
 * @param toUnit Target unit
 * @returns Converted value
 */
export function convertDeltaV(value: number, fromUnit: VelocityUnit, toUnit: VelocityUnit): number {
  // Convert to m/s first
  let valueInMs: number;
  switch (fromUnit) {
    case "m/s":
      valueInMs = value;
      break;
    case "km/s":
      valueInMs = value * 1000;
      break;
    case "ft/s":
      valueInMs = value * 0.3048; // Convert feet to meters
      break;
    default:
      valueInMs = value;
  }

  // Convert to target unit
  switch (toUnit) {
    case "m/s":
      return valueInMs;
    case "km/s":
      return valueInMs / 1000;
    case "ft/s":
      return valueInMs / 0.3048; // Convert meters to feet
    default:
      return valueInMs;
  }
}
