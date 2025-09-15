// Constants
export const g0 = 9.80665; // Standard gravity (m/s²)

export interface TWRResult {
  twr: number; // Thrust-to-weight ratio (dimensionless)
  thrust: number; // Thrust in Newtons
  weight: number; // Weight in Newtons
  mass: number; // Mass in kg
  thrustPerMass: number; // Thrust per unit mass (N/kg)
  isCapableOfVerticalFlight: boolean; // True if TWR > 1
  flightCapability: string; // Description of flight capability
  flightCapabilityColor: string; // Color class for flight capability
}

/**
 * Calculates the Thrust-to-Weight Ratio (TWR) and related values.
 * @param thrustN Thrust in Newtons
 * @param massKg Mass in kilograms
 * @returns TWR result object
 * @throws Error if parameters are invalid
 */
export function calculateTWR(thrustN: number, massKg: number): TWRResult {
  if (thrustN <= 0) {
    throw new Error("Thrust must be positive.");
  }
  if (massKg <= 0) {
    throw new Error("Mass must be positive.");
  }

  const weight = massKg * g0; // Weight = mass × gravity
  const twr = thrustN / weight;
  const thrustPerMass = thrustN / massKg;
  const isCapableOfVerticalFlight = twr > 1;

  let flightCapability = "";
  let flightCapabilityColor = "";
  if (twr < 0.5) {
    flightCapability = "Very low thrust - suitable for horizontal flight only";
    flightCapabilityColor = "text-muted-foreground";
  } else if (twr < 1.0) {
    flightCapability = "Low thrust - horizontal flight, gliding capability";
    flightCapabilityColor = "text-yellow-600";
  } else if (twr < 1.5) {
    flightCapability = "Moderate thrust - capable of vertical takeoff";
    flightCapabilityColor = "text-blue-600";
  } else if (twr < 2.0) {
    flightCapability = "Good thrust - excellent vertical performance";
    flightCapabilityColor = "text-green-600";
  } else if (twr < 3.0) {
    flightCapability = "High thrust - rocket-like performance";
    flightCapabilityColor = "text-orange-600";
  } else {
    flightCapability = "Very high thrust - ballistic flight capability";
    flightCapabilityColor = "text-red-600";
  }

  return {
    twr,
    thrust: thrustN,
    weight,
    mass: massKg,
    thrustPerMass,
    isCapableOfVerticalFlight,
    flightCapability,
    flightCapabilityColor,
  };
}

/**
 * Calculates the required thrust for a given TWR and mass.
 * @param twr Desired thrust-to-weight ratio
 * @param massKg Mass in kilograms
 * @returns TWR result object
 * @throws Error if parameters are invalid
 */
export function calculateRequiredThrust(twr: number, massKg: number): TWRResult {
  if (twr <= 0) {
    throw new Error("TWR must be positive.");
  }
  if (massKg <= 0) {
    throw new Error("Mass must be positive.");
  }

  const weight = massKg * g0;
  const thrustN = twr * weight;
  const thrustPerMass = thrustN / massKg;
  const isCapableOfVerticalFlight = twr > 1;

  let flightCapability = "";
  let flightCapabilityColor = "";
  if (twr < 0.5) {
    flightCapability = "Very low thrust - suitable for horizontal flight only";
    flightCapabilityColor = "text-muted-foreground";
  } else if (twr < 1.0) {
    flightCapability = "Low thrust - horizontal flight, gliding capability";
    flightCapabilityColor = "text-yellow-600";
  } else if (twr < 1.5) {
    flightCapability = "Moderate thrust - capable of vertical takeoff";
    flightCapabilityColor = "text-blue-600";
  } else if (twr < 2.0) {
    flightCapability = "Good thrust - excellent vertical performance";
    flightCapabilityColor = "text-green-600";
  } else if (twr < 3.0) {
    flightCapability = "High thrust - rocket-like performance";
    flightCapabilityColor = "text-orange-600";
  } else {
    flightCapability = "Very high thrust - ballistic flight capability";
    flightCapabilityColor = "text-red-600";
  }

  return {
    twr,
    thrust: thrustN,
    weight,
    mass: massKg,
    thrustPerMass,
    isCapableOfVerticalFlight,
    flightCapability,
    flightCapabilityColor,
  };
}

/**
 * Calculates the maximum mass for a given thrust and TWR.
 * @param thrustN Thrust in Newtons
 * @param twr Desired thrust-to-weight ratio
 * @returns TWR result object
 * @throws Error if parameters are invalid
 */
export function calculateMaximumMass(thrustN: number, twr: number): TWRResult {
  if (thrustN <= 0) {
    throw new Error("Thrust must be positive.");
  }
  if (twr <= 0) {
    throw new Error("TWR must be positive.");
  }

  const weight = thrustN / twr;
  const massKg = weight / g0;
  const thrustPerMass = thrustN / massKg;
  const isCapableOfVerticalFlight = twr > 1;

  let flightCapability = "";
  let flightCapabilityColor = "";
  if (twr < 0.5) {
    flightCapability = "Very low thrust - suitable for horizontal flight only";
    flightCapabilityColor = "text-muted-foreground";
  } else if (twr < 1.0) {
    flightCapability = "Low thrust - horizontal flight, gliding capability";
    flightCapabilityColor = "text-yellow-600";
  } else if (twr < 1.5) {
    flightCapability = "Moderate thrust - capable of vertical takeoff";
    flightCapabilityColor = "text-blue-600";
  } else if (twr < 2.0) {
    flightCapability = "Good thrust - excellent vertical performance";
    flightCapabilityColor = "text-green-600";
  } else if (twr < 3.0) {
    flightCapability = "High thrust - rocket-like performance";
    flightCapabilityColor = "text-orange-600";
  } else {
    flightCapability = "Very high thrust - ballistic flight capability";
    flightCapabilityColor = "text-red-600";
  }

  return {
    twr,
    thrust: thrustN,
    weight,
    mass: massKg,
    thrustPerMass,
    isCapableOfVerticalFlight,
    flightCapability,
    flightCapabilityColor,
  };
}
