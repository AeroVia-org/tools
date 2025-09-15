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
  custom: {
    name: "Custom Fluid",
    density: AIR_DENSITY_SL, // Default to air properties
    dynamicViscosity: AIR_DYNAMIC_VISCOSITY_SL,
    kinematicViscosity: AIR_KINEMATIC_VISCOSITY_SL,
  },
};

export interface FlowConditions {
  diameter: number; // meters
  velocity: number; // m/s
  temperature: number; // Kelvin
  fluidType: "air" | "water" | "custom";
}

export interface SphereFlowResult {
  reynoldsNumber: number;
  dragCoefficient: number;
  dragForce: number;
  separationAngle: number;
  fluidDensity: number;
  dynamicViscosity: number;
  kinematicViscosity: number;
  flowRegime: string;
  pressureCoefficient: number[];
  wakeLength: number;
  boundaryLayerThickness: number;
}

/**
 * Calculate fluid properties based on temperature and fluid type
 */
function getFluidProperties(temperature: number, fluidType: "air" | "water" | "custom") {
  const baseProps = FLUID_PROPERTIES[fluidType];

  if (fluidType === "air") {
    // Sutherland's law for air viscosity
    const T0 = 288.15; // Reference temperature (K)
    const S = 110.4; // Sutherland constant (K)
    const mu0 = 1.789e-5; // Reference viscosity at T0

    const dynamicViscosity = (mu0 * Math.pow(temperature / T0, 1.5) * (T0 + S)) / (temperature + S);

    // Ideal gas law for density (assuming atmospheric pressure)
    const R = 287; // Specific gas constant for air (J/kg·K)
    const p = 101325; // Atmospheric pressure (Pa)
    const density = p / (R * temperature);

    return {
      density,
      dynamicViscosity,
      kinematicViscosity: dynamicViscosity / density,
    };
  } else if (fluidType === "water") {
    // Water properties are relatively constant with temperature for this application
    return baseProps;
  } else {
    // Custom fluid - use base properties
    return baseProps;
  }
}

/**
 * Calculate drag coefficient for a sphere based on Reynolds number
 * Uses empirical correlations for different flow regimes
 */
function calculateDragCoefficient(reynolds: number): number {
  if (reynolds < 0.1) {
    // Stokes flow (creeping flow)
    return 24 / reynolds;
  } else if (reynolds < 1) {
    // Low Reynolds number - Oseen correction
    return (24 / reynolds) * (1 + (3 * reynolds) / 16);
  } else if (reynolds < 10) {
    // Transitional flow
    return (24 / reynolds) * (1 + 0.15 * Math.pow(reynolds, 0.687));
  } else if (reynolds < 1000) {
    // Subcritical flow - empirical correlation
    return (24 / reynolds) * (1 + 0.15 * Math.pow(reynolds, 0.687)) + 0.42 / (1 + 42500 / Math.pow(reynolds, 1.16));
  } else if (reynolds < 200000) {
    // Critical flow - drag crisis region
    // Complex correlation for the drag crisis
    const logRe = Math.log10(reynolds);
    if (logRe < 4.5) {
      return 0.4; // Approximate constant drag coefficient
    } else if (logRe < 5.0) {
      // Transition region
      return 0.4 - (0.2 * (logRe - 4.5)) / 0.5;
    } else {
      return 0.2; // Post-critical flow
    }
  } else {
    // Supercritical flow
    return 0.2;
  }
}

/**
 * Calculate separation angle based on Reynolds number
 * Separation occurs earlier at higher Reynolds numbers
 */
function calculateSeparationAngle(reynolds: number): number {
  if (reynolds < 1) {
    // Stokes flow - no separation
    return 180;
  } else if (reynolds < 10) {
    // Gradual separation
    return 180 - 10 * Math.log10(reynolds);
  } else if (reynolds < 1000) {
    // Subcritical flow
    return 120 - 20 * Math.log10(reynolds / 10);
  } else if (reynolds < 200000) {
    // Critical flow - separation moves forward
    return 100 - 20 * Math.log10(reynolds / 1000);
  } else {
    // Supercritical flow - separation at ~80°
    return 80;
  }
}

/**
 * Calculate pressure coefficient distribution around sphere
 * Returns array of Cp values for angles from 0° to 180°
 */
function calculatePressureCoefficient(reynolds: number): number[] {
  const angles = Array.from({ length: 181 }, (_, i) => i); // 0° to 180°

  return angles.map((angle) => {
    const theta = (angle * Math.PI) / 180; // Convert to radians

    if (reynolds < 1) {
      // Stokes flow - potential flow solution
      return 1 - (9 / 4) * Math.sin(theta) * Math.sin(theta);
    } else if (reynolds < 1000) {
      // Subcritical flow - modified potential flow
      const baseCp = 1 - (9 / 4) * Math.sin(theta) * Math.sin(theta);
      const separationEffect = Math.exp(-Math.pow(angle - calculateSeparationAngle(reynolds), 2) / 100);
      return baseCp * separationEffect;
    } else {
      // Critical and supercritical flow
      if (angle < calculateSeparationAngle(reynolds)) {
        // Before separation - potential flow
        return 1 - (9 / 4) * Math.sin(theta) * Math.sin(theta);
      } else {
        // After separation - constant pressure in wake
        return -0.5;
      }
    }
  });
}

/**
 * Calculate wake length behind the sphere
 */
function calculateWakeLength(reynolds: number, diameter: number): number {
  if (reynolds < 1) {
    // Stokes flow - very long wake
    return diameter * 10;
  } else if (reynolds < 1000) {
    // Subcritical flow
    return diameter * (5 + 2 * Math.log10(reynolds));
  } else {
    // Critical and supercritical flow - shorter wake
    return diameter * (2 + 1 / Math.log10(reynolds));
  }
}

/**
 * Calculate boundary layer thickness
 */
function calculateBoundaryLayerThickness(reynolds: number, diameter: number): number {
  if (reynolds < 1) {
    // Stokes flow - thick boundary layer
    return diameter * 0.5;
  } else {
    // Turbulent boundary layer
    return diameter / Math.sqrt(reynolds);
  }
}

/**
 * Main function to calculate sphere flow characteristics
 */
export function calculateSphereFlow(conditions: FlowConditions): SphereFlowResult {
  const { diameter, velocity, temperature, fluidType } = conditions;

  // Validate inputs
  if (diameter <= 0) {
    throw new Error("Sphere diameter must be positive");
  }
  if (velocity < 0) {
    throw new Error("Flow velocity must be non-negative");
  }
  if (temperature <= 0) {
    throw new Error("Temperature must be positive");
  }

  // Get fluid properties
  const fluidProps = getFluidProperties(temperature, fluidType);
  const { density, dynamicViscosity, kinematicViscosity } = fluidProps;

  // Calculate Reynolds number
  const reynoldsNumber = (density * velocity * diameter) / dynamicViscosity;

  // Calculate drag coefficient
  const dragCoefficient = calculateDragCoefficient(reynoldsNumber);

  // Calculate drag force
  const frontalArea = Math.PI * Math.pow(diameter / 2, 2);
  const dragForce = 0.5 * density * velocity * velocity * frontalArea * dragCoefficient;

  // Calculate separation angle
  const separationAngle = calculateSeparationAngle(reynoldsNumber);

  // Calculate pressure coefficient distribution
  const pressureCoefficient = calculatePressureCoefficient(reynoldsNumber);

  // Calculate wake length
  const wakeLength = calculateWakeLength(reynoldsNumber, diameter);

  // Calculate boundary layer thickness
  const boundaryLayerThickness = calculateBoundaryLayerThickness(reynoldsNumber, diameter);

  // Determine flow regime
  let flowRegime: string;
  if (reynoldsNumber < 1) {
    flowRegime = "Stokes Flow (Creeping Flow)";
  } else if (reynoldsNumber < 10) {
    flowRegime = "Low Reynolds Number";
  } else if (reynoldsNumber < 100) {
    flowRegime = "Transitional Flow";
  } else if (reynoldsNumber < 1000) {
    flowRegime = "Subcritical Flow";
  } else if (reynoldsNumber < 200000) {
    flowRegime = "Critical Flow";
  } else {
    flowRegime = "Supercritical Flow";
  }

  return {
    reynoldsNumber,
    dragCoefficient,
    dragForce,
    separationAngle,
    fluidDensity: density,
    dynamicViscosity,
    kinematicViscosity,
    flowRegime,
    pressureCoefficient,
    wakeLength,
    boundaryLayerThickness,
  };
}

/**
 * Generate a table of drag coefficients vs Reynolds numbers for visualization
 */
export function generateDragCoefficientTable(): Array<{ reynolds: number; dragCoefficient: number }> {
  const reynoldsRange = [];

  // Generate points for different regimes
  // Low Reynolds numbers (0.1 to 10)
  for (let i = 0.1; i <= 10; i += 0.1) {
    reynoldsRange.push(i);
  }

  // Medium Reynolds numbers (10 to 1000)
  for (let i = 10; i <= 1000; i += 10) {
    reynoldsRange.push(i);
  }

  // High Reynolds numbers (1000 to 1000000)
  for (let i = 1000; i <= 1000000; i *= 1.1) {
    reynoldsRange.push(i);
  }

  return reynoldsRange.map((reynolds) => ({
    reynolds,
    dragCoefficient: calculateDragCoefficient(reynolds),
  }));
}

/**
 * Calculate critical Reynolds number where drag crisis occurs
 */
export function getCriticalReynoldsNumber(): number {
  return 200000; // Approximate value for sphere drag crisis
}

/**
 * Get flow regime information for a given Reynolds number
 */
export function getFlowRegimeInfo(reynolds: number) {
  const regimes = [
    { min: 0, max: 1, name: "Stokes Flow", description: "Creeping flow, no separation" },
    { min: 1, max: 10, name: "Low Re", description: "Gradual separation begins" },
    { min: 10, max: 100, name: "Transitional", description: "Separation point moves forward" },
    { min: 100, max: 1000, name: "Subcritical", description: "Laminar separation" },
    { min: 1000, max: 200000, name: "Critical", description: "Drag crisis region" },
    { min: 200000, max: Infinity, name: "Supercritical", description: "Turbulent separation" },
  ];

  return regimes.find((regime) => reynolds >= regime.min && reynolds < regime.max) || regimes[regimes.length - 1];
}
