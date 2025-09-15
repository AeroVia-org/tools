export interface NormalShockResult {
  mach1: number; // Upstream Mach number (M₁)
  mach2: number; // Downstream Mach number (M₂)
  pressureRatio: number; // Static pressure ratio (p₂/p₁)
  temperatureRatio: number; // Static temperature ratio (T₂/T₁)
  densityRatio: number; // Density ratio (ρ₂/ρ₁)
  totalPressureRatio: number; // Total pressure ratio (p₀₂/p₀₁)
  entropy: number; // Entropy change (Δs/R)
  gamma: number; // Specific heat ratio (γ)
}

/**
 * Calculates normal shock properties based on the upstream Mach number.
 * Uses standard normal shock relations for a calorically perfect gas.
 *
 * @param mach1 Upstream Mach number (M₁), must be > 1 (supersonic)
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns Properties across the normal shock wave
 */
export function calculateNormalShock(mach1: number, gamma: number = 1.4): NormalShockResult {
  if (mach1 <= 1) {
    throw new Error("Upstream Mach number must be greater than 1 (supersonic)");
  }

  if (gamma <= 1) {
    throw new Error("Specific heat ratio must be greater than 1");
  }

  // Calculate downstream Mach number (M₂)
  const numerator = 1 + ((gamma - 1) * mach1 * mach1) / 2;
  const denominator = gamma * mach1 * mach1 - (gamma - 1) / 2;
  const mach2 = Math.sqrt(numerator / denominator);

  // Calculate pressure ratio (p₂/p₁)
  const pressureRatio = 1 + ((2 * gamma) / (gamma + 1)) * (mach1 * mach1 - 1);

  // Calculate temperature ratio (T₂/T₁)
  const temperatureRatio =
    (pressureRatio * (1 + ((gamma - 1) * mach2 * mach2) / 2)) / (1 + ((gamma - 1) * mach1 * mach1) / 2);

  // Calculate density ratio (ρ₂/ρ₁)
  const densityRatio = pressureRatio / temperatureRatio;

  // Calculate total pressure ratio (p₀₂/p₀₁)
  const term1 = ((gamma + 1) * mach1 * mach1) / ((gamma - 1) * mach1 * mach1 + 2);
  const term2 = Math.pow(gamma / (gamma + 1), gamma / (gamma - 1));
  const totalPressureRatio = Math.pow(term1, gamma / (gamma - 1)) * term2;

  // Calculate entropy change (Δs/R)
  const entropy = Math.log(totalPressureRatio);

  return {
    mach1,
    mach2,
    pressureRatio,
    temperatureRatio,
    densityRatio,
    totalPressureRatio,
    entropy,
    gamma,
  };
}

/**
 * Calculates normal shock properties using Rayleigh Pitot formula for
 * the case where we measure pitot pressure in supersonic flow.
 *
 * @param pitotRatio Ratio of pitot pressure to static pressure (p₀₂/p₁)
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns Properties across the normal shock wave
 */
export function calculateFromPitotRatio(pitotRatio: number, gamma: number = 1.4): NormalShockResult {
  if (pitotRatio <= 1) {
    throw new Error("Pitot pressure ratio must be greater than 1");
  }

  if (gamma <= 1) {
    throw new Error("Specific heat ratio must be greater than 1");
  }

  // Initial guess for Mach number (starting with M=2)
  let mach1 = 2.0;
  const tolerance = 0.00001;
  const maxIterations = 100;

  // Newton-Raphson iteration to find the Mach number
  for (let i = 0; i < maxIterations; i++) {
    // Calculate Rayleigh Pitot formula
    const term1 = Math.pow(((gamma + 1) * mach1 * mach1) / 2, gamma / (gamma - 1));
    const term2 = Math.pow((gamma + 1) / (2 * gamma * mach1 * mach1 - (gamma - 1)), 1 / (gamma - 1));
    const calculatedRatio = term1 * term2;

    // Calculate derivative for Newton-Raphson
    const dTerm1 =
      (gamma / (gamma - 1)) *
      Math.pow(((gamma + 1) * mach1 * mach1) / 2, gamma / (gamma - 1) - 1) *
      (gamma + 1) *
      mach1;
    const dTerm2Numerator = (-2 * gamma * mach1) / (gamma - 1);
    const dTerm2Denominator = Math.pow(2 * gamma * mach1 * mach1 - (gamma - 1), 2);
    const dTerm2 =
      (dTerm2Numerator / dTerm2Denominator) *
      Math.pow((gamma + 1) / (2 * gamma * mach1 * mach1 - (gamma - 1)), 1 / (gamma - 1));

    const derivative = term2 * dTerm1 + term1 * dTerm2;

    // Newton-Raphson update
    const delta = (calculatedRatio - pitotRatio) / derivative;
    mach1 = mach1 - delta;

    // Check for convergence
    if (Math.abs(delta) < tolerance) {
      break;
    }

    // Ensure Mach number stays supersonic
    if (mach1 <= 1.0) {
      mach1 = 1.01;
    }
  }

  // Once we have the Mach number, calculate all the other properties
  return calculateNormalShock(mach1, gamma);
}

/**
 * Calculate various shock parameters for a range of Mach numbers.
 * Useful for generating tables or plots.
 *
 * @param minMach Minimum Mach number to calculate (must be > 1)
 * @param maxMach Maximum Mach number to calculate
 * @param steps Number of Mach number points to calculate
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns Array of normal shock results
 */
export function generateShockTable(
  minMach: number = 1.05,
  maxMach: number = 10.0,
  steps: number = 20,
  gamma: number = 1.4,
): NormalShockResult[] {
  if (minMach <= 1) {
    minMach = 1.05; // Ensure supersonic
  }

  const results: NormalShockResult[] = [];
  const machStep = (maxMach - minMach) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const mach = minMach + i * machStep;
    results.push(calculateNormalShock(mach, gamma));
  }

  return results;
}

/**
 * Calculates the critical Mach number where the stagnation pressure ratio drops to 1%
 * (99% total pressure loss across the shock)
 *
 * @param gamma Specific heat ratio (γ), defaults to 1.4 for air
 * @returns Critical Mach number
 */
export function findCriticalMach(gamma: number = 1.4): number {
  let low = 1.0;
  let high = 100.0;
  const tolerance = 0.0001;
  const targetRatio = 0.01; // 1% of initial total pressure

  while (high - low > tolerance) {
    const mid = (low + high) / 2;
    const result = calculateNormalShock(mid, gamma);

    if (result.totalPressureRatio < targetRatio) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}
