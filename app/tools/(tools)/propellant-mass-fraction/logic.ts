export interface PropellantMassFractionResult {
  propellantMassFraction: number;
  structuralMassFraction: number;
  initialMass: number;
  propellantMass: number;
  structuralMass: number;
}

/**
 * Calculates the Propellant Mass Fraction (PMF) and related values.
 * @param initialMassKg Total initial mass of the vehicle (kg).
 * @param finalMassKg Final mass (dry mass / structural mass) of the vehicle (kg).
 * @returns Object containing PMF, structural mass fraction, and masses.
 * @throws Error if masses are invalid.
 */
export function calculatePropellantMassFraction(
  initialMassKg: number,
  finalMassKg: number,
): PropellantMassFractionResult {
  if (isNaN(initialMassKg) || isNaN(finalMassKg) || initialMassKg <= 0 || finalMassKg < 0) {
    throw new Error("Initial mass must be positive, and final mass cannot be negative.");
  }
  if (finalMassKg >= initialMassKg) {
    throw new Error("Final mass (dry mass) must be less than the initial mass.");
  }

  const propellantMass = initialMassKg - finalMassKg;
  const structuralMass = finalMassKg;
  const propellantMassFraction = propellantMass / initialMassKg;
  const structuralMassFraction = structuralMass / initialMassKg;

  return {
    propellantMassFraction,
    structuralMassFraction,
    initialMass: initialMassKg,
    propellantMass,
    structuralMass,
  };
}
