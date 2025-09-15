// Constants
export const RHO_SEA_LEVEL = 1.225; // kg/m³ - sea level air density
export const G = 9.80665; // m/s² - gravitational acceleration

// Airfoil types with typical aerodynamic coefficients
export interface AirfoilData {
  name: string;
  clMax: number; // Maximum lift coefficient
  cl0: number; // Zero-lift angle coefficient
  cd0: number; // Zero-lift drag coefficient
  oswaldEfficiency: number; // Oswald efficiency factor
  stallAngle: number; // Stall angle in degrees
  aspectRatio?: number; // Optional aspect ratio (calculated from wing geometry)
}

export const AIRFOIL_TYPES: Record<string, AirfoilData> = {
  "naca-2412": {
    name: "NACA 2412",
    clMax: 1.4,
    cl0: 0.25,
    cd0: 0.006,
    oswaldEfficiency: 0.85,
    stallAngle: 16,
  },
  "naca-4412": {
    name: "NACA 4412",
    clMax: 1.5,
    cl0: 0.35,
    cd0: 0.007,
    oswaldEfficiency: 0.87,
    stallAngle: 18,
  },
  "naca-23012": {
    name: "NACA 23012",
    clMax: 1.6,
    cl0: 0.3,
    cd0: 0.005,
    oswaldEfficiency: 0.9,
    stallAngle: 17,
  },
  "clark-y": {
    name: "Clark Y",
    clMax: 1.45,
    cl0: 0.4,
    cd0: 0.0065,
    oswaldEfficiency: 0.88,
    stallAngle: 16.5,
  },
  custom: {
    name: "Custom Airfoil",
    clMax: 1.2,
    cl0: 0.2,
    cd0: 0.008,
    oswaldEfficiency: 0.8,
    stallAngle: 15,
  },
};

// Flight condition interface
export interface FlightConditions {
  velocity: number; // m/s
  altitude: number; // m
  angleOfAttack: number; // degrees
  wingArea: number; // m²
  wingSpan: number; // m
  aspectRatio: number; // calculated from span and area
  airfoilType: string;
  customClMax?: number;
  customCl0?: number;
  customCd0?: number;
  customOswaldEfficiency?: number;
}

// Results interface
export interface LiftDragResult {
  // Flight conditions
  velocity: number; // m/s
  altitude: number; // m
  density: number; // kg/m³
  dynamicPressure: number; // Pa

  // Wing geometry
  wingArea: number; // m²
  wingSpan: number; // m
  aspectRatio: number;

  // Aerodynamic coefficients
  cl: number; // Lift coefficient
  cd: number; // Drag coefficient
  clCd: number; // Lift-to-drag ratio

  // Forces
  lift: number; // N
  drag: number; // N

  // Performance metrics
  stallSpeed: number; // m/s
  maxLiftToDragRatio: number;
  optimalAngleOfAttack: number; // degrees

  // Airfoil data
  airfoilName: string;
  clMax: number;
  cd0: number;
  oswaldEfficiency: number;
  stallAngle: number;

  // Validation
  isStalled: boolean;
  isValid: boolean;
  warnings: string[];
}

/**
 * Calculate air density at given altitude using ISA model
 * Simplified version - for more accurate results use ISA calculator
 */
function calculateDensity(altitude: number): number {
  if (altitude <= 11000) {
    // Troposphere (0-11km)
    const temperature = 288.15 - 0.0065 * altitude;
    const pressure = 101325 * Math.pow(temperature / 288.15, 5.256);
    return pressure / (287.05 * temperature);
  } else if (altitude <= 20000) {
    // Lower stratosphere (11-20km)
    const temperature = 216.65;
    const pressure = 22632 * Math.exp((-9.80665 * (altitude - 11000)) / (287.05 * 216.65));
    return pressure / (287.05 * temperature);
  } else {
    // Upper atmosphere - simplified
    return RHO_SEA_LEVEL * Math.exp(-altitude / 7400);
  }
}

/**
 * Calculate lift coefficient based on angle of attack and airfoil characteristics
 */
function calculateLiftCoefficient(
  angleOfAttack: number,
  airfoilData: AirfoilData,
  customClMax?: number,
  customCl0?: number,
): number {
  const cl0 = customCl0 || airfoilData.cl0;
  const stallAngle = airfoilData.stallAngle;

  // Convert angle of attack to radians
  const alphaRad = (angleOfAttack * Math.PI) / 180;
  const alpha0Rad = (cl0 * Math.PI) / 180;

  // Linear region (before stall)
  if (angleOfAttack <= stallAngle) {
    // Approximate lift curve slope of 2π per radian
    const clAlpha = 2 * Math.PI;
    return cl0 + clAlpha * (alphaRad - alpha0Rad);
  } else {
    // Post-stall region - simplified model
    const stallCl = cl0 + 2 * Math.PI * ((stallAngle * Math.PI) / 180 - alpha0Rad);
    const postStallDrop = 0.1 * (angleOfAttack - stallAngle);
    return Math.max(stallCl - postStallDrop, 0.3);
  }
}

/**
 * Calculate drag coefficient using drag polar equation
 */
function calculateDragCoefficient(
  cl: number,
  airfoilData: AirfoilData,
  customCd0?: number,
  customOswaldEfficiency?: number,
): number {
  const cd0 = customCd0 || airfoilData.cd0;
  const e = customOswaldEfficiency || airfoilData.oswaldEfficiency;
  const AR = airfoilData.aspectRatio || 6; // Default aspect ratio if not provided

  // Drag polar: CD = CD0 + CL²/(π * AR * e)
  return cd0 + (cl * cl) / (Math.PI * AR * e);
}

/**
 * Calculate optimal angle of attack for maximum L/D ratio
 */
function calculateOptimalAngleOfAttack(airfoilData: AirfoilData): number {
  const cl0 = airfoilData.cl0;
  const cd0 = airfoilData.cd0;
  const e = airfoilData.oswaldEfficiency;
  const AR = airfoilData.aspectRatio || 6; // Default aspect ratio if not provided

  // Optimal CL for maximum L/D: CL_opt = sqrt(CD0 * π * AR * e)
  const clOpt = Math.sqrt(cd0 * Math.PI * AR * e);

  // Convert back to angle of attack
  const clAlpha = 2 * Math.PI; // per radian
  const alpha0Rad = (cl0 * Math.PI) / 180;
  const alphaOptRad = alpha0Rad + (clOpt - cl0) / clAlpha;

  return (alphaOptRad * 180) / Math.PI;
}

/**
 * Calculate maximum lift-to-drag ratio
 */
function calculateMaxLiftToDragRatio(airfoilData: AirfoilData): number {
  const cd0 = airfoilData.cd0;
  const e = airfoilData.oswaldEfficiency;
  const AR = airfoilData.aspectRatio || 6; // Default aspect ratio if not provided

  // Maximum L/D = sqrt(π * AR * e) / (2 * sqrt(CD0))
  return Math.sqrt(Math.PI * AR * e) / (2 * Math.sqrt(cd0));
}

/**
 * Calculate stall speed
 */
function calculateStallSpeed(
  wingArea: number,
  airfoilData: AirfoilData,
  density: number,
  weight: number = 1000, // Default weight in N
): number {
  const clMax = airfoilData.clMax;
  return Math.sqrt((2 * weight) / (density * wingArea * clMax));
}

/**
 * Main calculation function for lift and drag
 */
export function calculateLiftAndDrag(conditions: FlightConditions): LiftDragResult {
  const warnings: string[] = [];

  // Validate inputs
  if (conditions.velocity <= 0) {
    throw new Error("Velocity must be positive");
  }
  if (conditions.altitude < 0) {
    throw new Error("Altitude cannot be negative");
  }
  if (conditions.wingArea <= 0) {
    throw new Error("Wing area must be positive");
  }
  if (conditions.wingSpan <= 0) {
    throw new Error("Wing span must be positive");
  }

  // Get airfoil data
  const airfoilData = AIRFOIL_TYPES[conditions.airfoilType];
  if (!airfoilData) {
    throw new Error("Invalid airfoil type");
  }

  // Calculate derived parameters
  const density = calculateDensity(conditions.altitude);
  const dynamicPressure = 0.5 * density * conditions.velocity * conditions.velocity;
  const aspectRatio = (conditions.wingSpan * conditions.wingSpan) / conditions.wingArea;

  // Update airfoil data with calculated aspect ratio
  const updatedAirfoilData = {
    ...airfoilData,
    aspectRatio,
  };

  // Calculate aerodynamic coefficients
  const cl = calculateLiftCoefficient(
    conditions.angleOfAttack,
    updatedAirfoilData,
    conditions.customClMax,
    conditions.customCl0,
  );

  const cd = calculateDragCoefficient(cl, updatedAirfoilData, conditions.customCd0, conditions.customOswaldEfficiency);

  // Calculate forces
  const lift = cl * dynamicPressure * conditions.wingArea;
  const drag = cd * dynamicPressure * conditions.wingArea;

  // Calculate performance metrics
  const clCd = cl / cd;
  const maxLiftToDragRatio = calculateMaxLiftToDragRatio(updatedAirfoilData);
  const optimalAngleOfAttack = calculateOptimalAngleOfAttack(updatedAirfoilData);
  const stallSpeed = calculateStallSpeed(conditions.wingArea, updatedAirfoilData, density);

  // Check for stall condition
  const isStalled = conditions.angleOfAttack > airfoilData.stallAngle;

  // Generate warnings
  if (isStalled) {
    warnings.push("Aircraft is stalled - lift coefficient may be unreliable");
  }
  if (conditions.velocity < stallSpeed * 1.1) {
    warnings.push("Velocity is close to stall speed - consider increasing speed");
  }
  if (conditions.angleOfAttack > 25) {
    warnings.push("Angle of attack is very high - results may be inaccurate");
  }

  // Validate results
  const isValid = lift > 0 && drag > 0 && !isNaN(cl) && !isNaN(cd);

  return {
    // Flight conditions
    velocity: conditions.velocity,
    altitude: conditions.altitude,
    density,
    dynamicPressure,

    // Wing geometry
    wingArea: conditions.wingArea,
    wingSpan: conditions.wingSpan,
    aspectRatio,

    // Aerodynamic coefficients
    cl,
    cd,
    clCd,

    // Forces
    lift,
    drag,

    // Performance metrics
    stallSpeed,
    maxLiftToDragRatio,
    optimalAngleOfAttack,

    // Airfoil data
    airfoilName: airfoilData.name,
    clMax: conditions.customClMax || airfoilData.clMax,
    cd0: conditions.customCd0 || airfoilData.cd0,
    oswaldEfficiency: conditions.customOswaldEfficiency || airfoilData.oswaldEfficiency,
    stallAngle: airfoilData.stallAngle,

    // Validation
    isStalled,
    isValid,
    warnings,
  };
}

/**
 * Calculate lift and drag for a range of angles of attack
 */
export function calculateLiftDragCurve(
  conditions: Omit<FlightConditions, "angleOfAttack">,
  angleRange: { min: number; max: number; steps: number } = { min: -5, max: 20, steps: 26 },
): Array<{ angleOfAttack: number; cl: number; cd: number; clCd: number; lift: number; drag: number }> {
  const results = [];
  const stepSize = (angleRange.max - angleRange.min) / (angleRange.steps - 1);

  for (let i = 0; i < angleRange.steps; i++) {
    const angleOfAttack = angleRange.min + i * stepSize;
    const result = calculateLiftAndDrag({ ...conditions, angleOfAttack });

    results.push({
      angleOfAttack,
      cl: result.cl,
      cd: result.cd,
      clCd: result.clCd,
      lift: result.lift,
      drag: result.drag,
    });
  }

  return results;
}

/**
 * Get available airfoil types
 */
export function getAirfoilTypes(): Array<{ value: string; label: string }> {
  return Object.entries(AIRFOIL_TYPES).map(([key, airfoil]) => ({
    value: key,
    label: airfoil.name,
  }));
}
