/**
 * Calculations for isentropic flow relations
 * These equations apply to compressible flow with no entropy change (isentropic)
 */

export interface IsentropicFlowResult {
  mach: number; // Mach number
  pressureRatio: number; // Static pressure ratio (p/p₀)
  temperatureRatio: number; // Static temperature ratio (T/T₀)
  densityRatio: number; // Density ratio (ρ/ρ₀)
  areaRatio: number; // Area ratio (A/A*)
  machAngle: number; // Mach angle in degrees
  prandtlMeyerAngle: number; // Prandtl-Meyer angle in degrees
  pitotPressureRatio: number; // Pitot pressure ratio (p₀₂/p₀)
  gamma: number; // Specific heat ratio (γ)
}

/**
 * Calculate isentropic flow properties for a given Mach number
 *
 * @param mach Mach number (M)
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns Isentropic flow properties
 */
export function calculateIsentropicFlow(mach: number, gamma: number = 1.4): IsentropicFlowResult {
  if (mach < 0) {
    throw new Error("Mach number must be positive");
  }

  if (gamma <= 1) {
    throw new Error("Specific heat ratio must be greater than 1");
  }

  // Temperature ratio (T/T₀)
  const temperatureRatio = 1 / (1 + ((gamma - 1) / 2) * mach * mach);

  // Pressure ratio (p/p₀)
  const pressureRatio = Math.pow(temperatureRatio, gamma / (gamma - 1));

  // Density ratio (ρ/ρ₀)
  const densityRatio = Math.pow(temperatureRatio, 1 / (gamma - 1));

  // Area ratio (A/A*) - ratio of area to critical area where M=1
  let areaRatio: number;
  if (mach === 0) {
    areaRatio = Infinity; // At M=0, A/A* is infinite
  } else {
    const term1 = 2 / (gamma + 1);
    const term2 = 1 + ((gamma - 1) / 2) * mach * mach;
    areaRatio = (1 / mach) * Math.pow(term1 * term2, (gamma + 1) / (2 * (gamma - 1)));
  }

  // Mach angle (μ) in degrees - only for supersonic flow
  const machAngle = mach >= 1 ? Math.asin(1 / mach) * (180 / Math.PI) : NaN;

  // Prandtl-Meyer function (ν) in degrees - only for supersonic flow
  let prandtlMeyerAngle: number;
  if (mach >= 1) {
    const sqrtTerm = Math.sqrt((gamma + 1) / (gamma - 1));
    const term1 = sqrtTerm * Math.atan(Math.sqrt(((gamma - 1) / (gamma + 1)) * (mach * mach - 1)));
    const term2 = Math.atan(Math.sqrt(mach * mach - 1));
    prandtlMeyerAngle = (term1 - term2) * (180 / Math.PI);
  } else {
    prandtlMeyerAngle = 0; // For subsonic flow
  }

  // Pitot pressure ratio - ratio of stagnation pressure behind normal shock to freestream stagnation pressure
  let pitotPressureRatio: number;
  if (mach <= 1) {
    pitotPressureRatio = 1.0; // No loss in stagnation pressure for subsonic flow
  } else {
    // For supersonic flow, there's a normal shock at the pitot tube
    const term1 = Math.pow(((gamma + 1) * mach * mach) / 2, gamma / (gamma - 1));
    const term2 = Math.pow((gamma + 1) / (2 * gamma * mach * mach - (gamma - 1)), 1 / (gamma - 1));
    pitotPressureRatio = term1 * term2;
  }

  return {
    mach,
    pressureRatio,
    temperatureRatio,
    densityRatio,
    areaRatio,
    machAngle,
    prandtlMeyerAngle,
    pitotPressureRatio,
    gamma,
  };
}

/**
 * Find the Mach number for a given pressure ratio in isentropic flow
 * Uses a numerical method to iteratively solve for Mach
 *
 * @param pressureRatio Static pressure ratio (p/p₀), must be between 0 and 1
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns The corresponding Mach number
 */
export function findMachFromPressureRatio(pressureRatio: number, gamma: number = 1.4): number {
  if (pressureRatio <= 0 || pressureRatio > 1) {
    throw new Error("Pressure ratio must be between 0 and 1");
  }

  if (gamma <= 1) {
    throw new Error("Specific heat ratio must be greater than 1");
  }

  const exp = (gamma - 1) / gamma;

  if (pressureRatio === 1) {
    return 0; // M = 0 when p/p₀ = 1
  }

  // Initial guess based on approximate formula
  let mach = Math.sqrt((2 * (Math.pow(pressureRatio, -exp) - 1)) / (gamma - 1));
  const tolerance = 1e-8;
  const maxIterations = 100;

  // Newton-Raphson iteration
  for (let i = 0; i < maxIterations; i++) {
    const tempRatio = 1 / (1 + ((gamma - 1) / 2) * mach * mach);
    const calculatedPressureRatio = Math.pow(tempRatio, gamma / (gamma - 1));

    const error = calculatedPressureRatio - pressureRatio;

    if (Math.abs(error) < tolerance) {
      break;
    }

    // Derivative of pressure ratio with respect to Mach
    const derivative = -gamma * mach * Math.pow(tempRatio, gamma / (gamma - 1) + 1);

    // Update Mach number
    mach = mach - error / derivative;

    // Ensure Mach stays positive
    if (mach <= 0) {
      mach = 0.01;
    }
  }

  return mach;
}

/**
 * Find the Mach number for a given area ratio in isentropic flow
 * This has two solutions (subsonic and supersonic), so we specify which regime
 *
 * @param areaRatio Area ratio (A/A*), must be >= 1
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @param supersonic Whether to return the supersonic solution (M>1) or subsonic (M<1)
 * @returns The corresponding Mach number
 */
export function findMachFromAreaRatio(areaRatio: number, gamma: number = 1.4, supersonic: boolean = false): number {
  if (areaRatio < 1) {
    throw new Error("Area ratio must be greater than or equal to 1");
  }

  if (gamma <= 1) {
    throw new Error("Specific heat ratio must be greater than 1");
  }

  if (areaRatio === 1) {
    return 1; // M = 1 when A/A* = 1 (critical condition)
  }

  // Initial guess based on regime
  let mach = supersonic ? 2.0 : 0.5;
  const tolerance = 1e-8;
  const maxIterations = 100;

  // Newton-Raphson iteration
  for (let i = 0; i < maxIterations; i++) {
    const term1 = 2 / (gamma + 1);
    const term2 = 1 + ((gamma - 1) / 2) * mach * mach;
    const calculatedAreaRatio = (1 / mach) * Math.pow(term1 * term2, (gamma + 1) / (2 * (gamma - 1)));

    const error = calculatedAreaRatio - areaRatio;

    if (Math.abs(error) < tolerance) {
      break;
    }

    // Derivative of area ratio with respect to Mach (complicated expression)
    const powerTerm = (gamma + 1) / (2 * (gamma - 1));
    const term3 = Math.pow(term1 * term2, powerTerm);
    const term4 = ((term3 / mach) * ((gamma - 1) * mach)) / term2;
    const derivative = -term3 / (mach * mach) + term4;

    // Update Mach number
    mach = mach - error / derivative;

    // Ensure Mach stays in correct regime
    if (supersonic && mach <= 1) {
      mach = 1.01;
    } else if (!supersonic && mach >= 1) {
      mach = 0.99;
    } else if (mach <= 0) {
      mach = 0.01;
    }
  }

  return mach;
}

/**
 * Find the Mach number for a given temperature ratio in isentropic flow
 *
 * @param temperatureRatio Static temperature ratio (T/T₀), must be between 0 and 1
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns The corresponding Mach number
 */
export function findMachFromTemperatureRatio(temperatureRatio: number, gamma: number = 1.4): number {
  if (temperatureRatio <= 0 || temperatureRatio > 1) {
    throw new Error("Temperature ratio must be between 0 and 1");
  }

  if (gamma <= 1) {
    throw new Error("Specific heat ratio must be greater than 1");
  }

  // For temperature ratio, we can directly compute Mach number
  const mach = Math.sqrt((2 * (1 - temperatureRatio)) / ((gamma - 1) * temperatureRatio));

  return mach;
}

/**
 * Calculate isentropic flow properties for a range of Mach numbers
 * Useful for generating tables or plots
 *
 * @param minMach Minimum Mach number
 * @param maxMach Maximum Mach number
 * @param steps Number of Mach number points
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns Array of isentropic flow results
 */
export function generateIsentropicTable(
  minMach: number = 0.1,
  maxMach: number = 5.0,
  steps: number = 20,
  gamma: number = 1.4,
): IsentropicFlowResult[] {
  if (minMach < 0) {
    minMach = 0; // Ensure non-negative Mach
  }

  const results: IsentropicFlowResult[] = [];
  const machStep = (maxMach - minMach) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const mach = minMach + i * machStep;
    results.push(calculateIsentropicFlow(mach, gamma));
  }

  return results;
}
