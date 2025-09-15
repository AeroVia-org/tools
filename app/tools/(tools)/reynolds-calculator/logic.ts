// Constants for standard air properties at sea level
const AIR_DENSITY_SL = 1.225; // kg/m³ at sea level
const AIR_DYNAMIC_VISCOSITY_SL = 1.789e-5; // kg/(m·s) at sea level
const AIR_KINEMATIC_VISCOSITY_SL = 1.46e-5; // m²/s at sea level

// Constants for standard water properties at 20°C
const WATER_DENSITY = 998.2; // kg/m³
const WATER_DYNAMIC_VISCOSITY = 1.002e-3; // kg/(m·s)
const WATER_KINEMATIC_VISCOSITY = 1.004e-6; // m²/s

// Constants for common fluids at standard temperature (20°C)
export const FLUID_PROPERTIES = {
  air: {
    name: "Air",
    density: AIR_DENSITY_SL, // kg/m³
    dynamicViscosity: AIR_DYNAMIC_VISCOSITY_SL, // kg/(m·s)
    kinematicViscosity: AIR_KINEMATIC_VISCOSITY_SL, // m²/s
  },
  water: {
    name: "Water",
    density: WATER_DENSITY, // kg/m³
    dynamicViscosity: WATER_DYNAMIC_VISCOSITY, // kg/(m·s)
    kinematicViscosity: WATER_KINEMATIC_VISCOSITY, // m²/s
  },
  seawater: {
    name: "Seawater",
    density: 1025, // kg/m³
    dynamicViscosity: 1.08e-3, // kg/(m·s)
    kinematicViscosity: 1.05e-6, // m²/s
  },
  glycerin: {
    name: "Glycerin",
    density: 1260, // kg/m³
    dynamicViscosity: 1.41, // kg/(m·s)
    kinematicViscosity: 1.12e-3, // m²/s
  },
  oil: {
    name: "Engine Oil (SAE 30)",
    density: 891, // kg/m³
    dynamicViscosity: 0.29, // kg/(m·s)
    kinematicViscosity: 3.25e-4, // m²/s
  },
  gasoline: {
    name: "Gasoline",
    density: 750, // kg/m³
    dynamicViscosity: 2.92e-4, // kg/(m·s)
    kinematicViscosity: 3.89e-7, // m²/s
  },
  hydrogen: {
    name: "Hydrogen",
    density: 0.0899, // kg/m³
    dynamicViscosity: 8.4e-6, // kg/(m·s)
    kinematicViscosity: 9.34e-5, // m²/s
  },
  oxygen: {
    name: "Oxygen",
    density: 1.429, // kg/m³
    dynamicViscosity: 1.92e-5, // kg/(m·s)
    kinematicViscosity: 1.34e-5, // m²/s
  },
  methane: {
    name: "Methane",
    density: 0.668, // kg/m³
    dynamicViscosity: 1.1e-5, // kg/(m·s)
    kinematicViscosity: 1.65e-5, // m²/s
  },
  custom: {
    name: "Custom",
    density: 1000, // kg/m³
    dynamicViscosity: 1e-3, // kg/(m·s)
    kinematicViscosity: 1e-6, // m²/s
  },
};

export interface FluidProperty {
  name: string;
  density: number;
  dynamicViscosity: number;
  kinematicViscosity: number;
}

export interface ReynoldsNumberResult {
  reynoldsNumber: number;
  flowRegime: string;
  velocity: number;
  characteristicLength: number;
  density: number;
  dynamicViscosity: number;
  kinematicViscosity: number;
  fluidName: string;
  usedKinematicFormula: boolean;
}

/**
 * Determine the flow regime description based on Reynolds number
 * @param re Reynolds number
 * @param isInternal Whether it's internal flow (e.g., in pipes)
 * @returns Text description of the flow regime
 */
export function determineFlowRegime(re: number, isInternal: boolean = false): string {
  if (isInternal) {
    // Internal flow (pipes, ducts)
    if (re < 2300) {
      return "Laminar";
    } else if (re < 4000) {
      return "Transitional";
    } else {
      return "Turbulent";
    }
  } else {
    // External flow (airfoils, obstacles)
    if (re < 3e5) {
      return "Laminar";
    } else if (re < 5e5) {
      return "Transitional";
    } else {
      return "Turbulent";
    }
  }
}

/**
 * Calculate Reynolds number using the standard formula
 * @param velocity Flow velocity (m/s)
 * @param characteristicLength Characteristic length (m) - diameter for internal flow, chord/length for external flow
 * @param density Fluid density (kg/m³)
 * @param dynamicViscosity Fluid dynamic viscosity (kg/(m·s))
 * @param isInternal Whether this is internal flow (pipe, duct) or external flow (airfoil, obstacle)
 * @param fluidName Name of the fluid being used (for display purposes)
 * @returns Reynolds Number calculation results
 */
export function calculateReynoldsNumber(
  velocity: number,
  characteristicLength: number,
  density: number,
  dynamicViscosity: number,
  isInternal: boolean = false,
  fluidName: string = "Custom",
): ReynoldsNumberResult {
  if (velocity <= 0) {
    throw new Error("Velocity must be positive.");
  }
  if (characteristicLength <= 0) {
    throw new Error("Characteristic length must be positive.");
  }
  if (density <= 0) {
    throw new Error("Density must be positive.");
  }
  if (dynamicViscosity <= 0) {
    throw new Error("Dynamic viscosity must be positive.");
  }

  // Calculate kinematic viscosity
  const kinematicViscosity = dynamicViscosity / density;

  // Calculate Reynolds number
  const reynoldsNumber = (density * velocity * characteristicLength) / dynamicViscosity;

  // Determine flow regime
  const flowRegime = determineFlowRegime(reynoldsNumber, isInternal);

  return {
    reynoldsNumber,
    flowRegime,
    velocity,
    characteristicLength,
    density,
    dynamicViscosity,
    kinematicViscosity,
    fluidName,
    usedKinematicFormula: false,
  };
}

/**
 * Calculate Reynolds number using the kinematic viscosity formula
 * @param velocity Flow velocity (m/s)
 * @param characteristicLength Characteristic length (m)
 * @param kinematicViscosity Fluid kinematic viscosity (m²/s)
 * @param fluidName Name of the fluid (for display purposes)
 * @param density Fluid density (kg/m³, for reference)
 * @param dynamicViscosity Fluid dynamic viscosity (kg/(m·s), for reference)
 * @param isInternal Whether this is internal flow (pipe, duct) or external flow (airfoil, obstacle)
 * @returns Reynolds Number calculation results
 */
export function calculateReynoldsNumberKinematic(
  velocity: number,
  characteristicLength: number,
  kinematicViscosity: number,
  fluidName: string = "Custom",
  density: number = 0,
  dynamicViscosity: number = 0,
  isInternal: boolean = false,
): ReynoldsNumberResult {
  if (velocity <= 0) {
    throw new Error("Velocity must be positive.");
  }
  if (characteristicLength <= 0) {
    throw new Error("Characteristic length must be positive.");
  }
  if (kinematicViscosity <= 0) {
    throw new Error("Kinematic viscosity must be positive.");
  }

  // Calculate Reynolds number using kinematic viscosity
  const reynoldsNumber = (velocity * characteristicLength) / kinematicViscosity;

  // Determine flow regime
  const flowRegime = determineFlowRegime(reynoldsNumber, isInternal);

  return {
    reynoldsNumber,
    flowRegime,
    velocity,
    characteristicLength,
    density: density || 0, // May not be provided in kinematic formula
    dynamicViscosity: dynamicViscosity || 0, // May not be provided in kinematic formula
    kinematicViscosity,
    fluidName,
    usedKinematicFormula: true,
  };
}

/**
 * Calculate the kinematic viscosity from density and dynamic viscosity
 * @param density Fluid density (kg/m³)
 * @param dynamicViscosity Fluid dynamic viscosity (kg/(m·s))
 * @returns Kinematic viscosity (m²/s)
 */
export function calculateKinematicViscosity(density: number, dynamicViscosity: number): number {
  if (density <= 0) {
    throw new Error("Density must be positive.");
  }
  if (dynamicViscosity <= 0) {
    throw new Error("Dynamic viscosity must be positive.");
  }

  return dynamicViscosity / density;
}

/**
 * Calculate the dynamic viscosity from density and kinematic viscosity
 * @param density Fluid density (kg/m³)
 * @param kinematicViscosity Fluid kinematic viscosity (m²/s)
 * @returns Dynamic viscosity (kg/(m·s))
 */
export function calculateDynamicViscosity(density: number, kinematicViscosity: number): number {
  if (density <= 0) {
    throw new Error("Density must be positive.");
  }
  if (kinematicViscosity <= 0) {
    throw new Error("Kinematic viscosity must be positive.");
  }

  return kinematicViscosity * density;
}
