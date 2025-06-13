// Constants
export const g0 = 9.80665; // Standard gravity (m/s²)

export interface RocketEquationResult {
  deltaV: number; // Change in velocity (m/s)
  exhaustVelocity: number; // Effective exhaust velocity (m/s)
  specificImpulse: number; // Specific impulse (s)
  initialMass: number; // Initial mass (kg)
  finalMass: number; // Final mass (kg)
  massRatio: number; // Mass ratio (dimensionless)
  propellantMass: number; // Propellant mass (kg)
  propellantMassFraction: number; // Propellant mass fraction (dimensionless)
}

/**
 * Calculates the delta-v from mass ratio and specific impulse or exhaust velocity.
 * @param initialMass Initial total mass including propellant (kg)
 * @param finalMass Final total mass without propellant (kg)
 * @param specificImpulse Specific impulse of the propellant (s), optional if exhaustVelocity is provided
 * @param exhaustVelocity Effective exhaust velocity (m/s), optional if specificImpulse is provided
 * @returns Rocket equation results object
 * @throws Error if parameters are invalid
 */
export function calculateDeltaV(
  initialMass: number,
  finalMass: number,
  specificImpulse?: number,
  exhaustVelocity?: number,
): RocketEquationResult {
  if (initialMass <= 0) {
    throw new Error("Initial mass must be positive.");
  }
  if (finalMass <= 0) {
    throw new Error("Final mass must be positive.");
  }
  if (finalMass > initialMass) {
    throw new Error("Final mass cannot be greater than initial mass.");
  }

  let effectiveExhaustVelocity: number;
  let effectiveSpecificImpulse: number;

  // Determine exhaust velocity from specific impulse or vice versa
  if (exhaustVelocity !== undefined && exhaustVelocity > 0) {
    effectiveExhaustVelocity = exhaustVelocity;
    effectiveSpecificImpulse = exhaustVelocity / g0;
  } else if (specificImpulse !== undefined && specificImpulse > 0) {
    effectiveSpecificImpulse = specificImpulse;
    effectiveExhaustVelocity = specificImpulse * g0;
  } else {
    throw new Error("Either specific impulse or exhaust velocity must be provided.");
  }

  const massRatio = initialMass / finalMass;
  const deltaV = effectiveExhaustVelocity * Math.log(massRatio);
  const propellantMass = initialMass - finalMass;
  const propellantMassFraction = propellantMass / initialMass;

  return {
    deltaV,
    exhaustVelocity: effectiveExhaustVelocity,
    specificImpulse: effectiveSpecificImpulse,
    initialMass,
    finalMass,
    massRatio,
    propellantMass,
    propellantMassFraction,
  };
}

/**
 * Calculates the required initial mass given the final mass and desired delta-v.
 * @param finalMass Final total mass (kg)
 * @param deltaV Desired change in velocity (m/s)
 * @param specificImpulse Specific impulse of the propellant (s), optional if exhaustVelocity is provided
 * @param exhaustVelocity Effective exhaust velocity (m/s), optional if specificImpulse is provided
 * @returns Rocket equation results object
 * @throws Error if parameters are invalid
 */
export function calculateInitialMass(
  finalMass: number,
  deltaV: number,
  specificImpulse?: number,
  exhaustVelocity?: number,
): RocketEquationResult {
  if (finalMass <= 0) {
    throw new Error("Final mass must be positive.");
  }
  if (deltaV < 0) {
    throw new Error("Delta-v cannot be negative.");
  }

  let effectiveExhaustVelocity: number;
  let effectiveSpecificImpulse: number;

  // Determine exhaust velocity from specific impulse or vice versa
  if (exhaustVelocity !== undefined && exhaustVelocity > 0) {
    effectiveExhaustVelocity = exhaustVelocity;
    effectiveSpecificImpulse = exhaustVelocity / g0;
  } else if (specificImpulse !== undefined && specificImpulse > 0) {
    effectiveSpecificImpulse = specificImpulse;
    effectiveExhaustVelocity = specificImpulse * g0;
  } else {
    throw new Error("Either specific impulse or exhaust velocity must be provided.");
  }

  const massRatio = Math.exp(deltaV / effectiveExhaustVelocity);
  const initialMass = finalMass * massRatio;
  const propellantMass = initialMass - finalMass;
  const propellantMassFraction = propellantMass / initialMass;

  return {
    deltaV,
    exhaustVelocity: effectiveExhaustVelocity,
    specificImpulse: effectiveSpecificImpulse,
    initialMass,
    finalMass,
    massRatio,
    propellantMass,
    propellantMassFraction,
  };
}

/**
 * Calculates the required specific impulse or exhaust velocity given the mass ratio and desired delta-v.
 * @param initialMass Initial total mass including propellant (kg)
 * @param finalMass Final total mass without propellant (kg)
 * @param deltaV Desired change in velocity (m/s)
 * @returns Rocket equation results object
 * @throws Error if parameters are invalid
 */
export function calculateRequiredSpecificImpulse(
  initialMass: number,
  finalMass: number,
  deltaV: number,
): RocketEquationResult {
  if (initialMass <= 0) {
    throw new Error("Initial mass must be positive.");
  }
  if (finalMass <= 0) {
    throw new Error("Final mass must be positive.");
  }
  if (finalMass > initialMass) {
    throw new Error("Final mass cannot be greater than initial mass.");
  }
  if (deltaV <= 0) {
    throw new Error("Delta-v must be positive.");
  }

  const massRatio = initialMass / finalMass;
  const exhaustVelocity = deltaV / Math.log(massRatio);
  const specificImpulse = exhaustVelocity / g0;
  const propellantMass = initialMass - finalMass;
  const propellantMassFraction = propellantMass / initialMass;

  return {
    deltaV,
    exhaustVelocity,
    specificImpulse,
    initialMass,
    finalMass,
    massRatio,
    propellantMass,
    propellantMassFraction,
  };
}
