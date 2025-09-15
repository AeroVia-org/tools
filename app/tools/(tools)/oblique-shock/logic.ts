/**
 * Calculations for oblique shock wave relations
 * These equations apply to supersonic flow turning into itself through a wedge or similar deflection.
 */

// Constants
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const MAX_ITERATIONS = 100;
const TOLERANCE = 1e-8;

export interface ObliqueShockResult {
  upstreamMach: number;
  downstreamMach: number;
  waveAngle: number; // degrees
  deflectionAngle: number; // degrees
  pressureRatio: number;
  temperatureRatio: number;
  densityRatio: number;
  stagnationPressureRatio: number;
  machAngle: number; // degrees
  maxDeflectionAngle: number; // degrees
  gamma: number;
}

/**
 * The θ-β-M relation function. Calculates θ for given M₁, β, and γ.
 * tan(θ) = 2 * cot(β) * (M₁² * sin²(β) - 1) / (M₁² * (γ + cos(2β)) + 2)
 * @param M1 Upstream Mach number
 * @param beta Wave angle in RADIANS
 * @param gamma Specific heat ratio
 * @returns Deflection angle θ in RADIANS
 */
function thetaBetaMachRelation(M1: number, beta: number, gamma: number): number {
  const M1_sq = M1 * M1;
  const sin_beta = Math.sin(beta);
  const cos_beta = Math.cos(beta);
  const sin_sq_beta = sin_beta * sin_beta;

  // Handle beta at PI/2 (90 degrees) where cot_beta would be 0 if not handled carefully.
  // Or if sin_beta is extremely close to zero (beta near 0 or PI)
  if (Math.abs(sin_beta) < TOLERANCE) {
    // If beta is 0 or PI, cot_beta is infinite. This shouldn't happen if beta is constrained correctly (e.g., > machAngle and < PI/2).
    // For beta = PI/2 (normal shock), cot_beta = 0. Numerator becomes 0. tan(theta) = 0 -> theta = 0. This is correct.
    if (Math.abs(Math.PI / 2 - beta) < TOLERANCE) {
      // If beta is 90 degrees
      return 0; // Deflection angle is 0 for a normal shock in this formulation context.
    }
    return NaN; // Or handle as an error, as beta shouldn't be 0 or PI.
  }
  const cot_beta = cos_beta / sin_beta;

  const term_M1_sq_sin_sq_beta_minus_1 = M1_sq * sin_sq_beta - 1;

  // For a physically valid oblique shock, M1*sin(beta) must be > 1.
  // If M1*sin(beta) < 1, then term_M1_sq_sin_sq_beta_minus_1 is negative.
  // This implies beta < mach_angle, which should not occur if beta is chosen correctly for the scan/solve.
  // If it does, tan_theta can be negative, resulting in a negative theta, which is unphysical for positive deflections.
  // The calling functions should ensure beta >= mach_angle.
  // If term_M1_sq_sin_sq_beta_minus_1 is very near 0 (beta is very near mach_angle), theta should be near 0.

  const numerator = 2 * cot_beta * term_M1_sq_sin_sq_beta_minus_1;
  const denominator = M1_sq * (gamma + Math.cos(2 * beta)) + 2;

  if (Math.abs(denominator) < TOLERANCE || isNaN(numerator) || isNaN(denominator)) {
    // If denominator is zero, tan(theta) is infinite, theta is PI/2. This is unlikely for physical oblique shocks.
    return NaN;
  }

  return Math.atan(numerator / denominator); // Corrected from Math.atan(numerator)
}

/**
 * Derivative of the θ-β-M relation with respect to β (dθ/dβ).
 * Used for Newton-Raphson solver.
 * @param M1 Upstream Mach number
 * @param beta Wave angle in RADIANS
 * @param gamma Specific heat ratio
 * @returns dθ/dβ
 */
function thetaBetaMachDerivative(M1: number, beta: number, gamma: number): number {
  const M1_sq = M1 * M1;
  const sin_beta = Math.sin(beta);
  const sin_sq = sin_beta * sin_beta;

  const termA = M1_sq * sin_sq - 1;
  const termA_safe = termA === 0 ? TOLERANCE : termA;

  const termB = ((gamma + 1) / 2) * M1_sq - termA_safe;
  const termC = 1 + ((gamma - 1) / 2) * M1_sq;
  const tan_theta = Math.tan(thetaBetaMachRelation(M1, beta, gamma));

  const numerator_deriv = M1_sq * Math.sin(2 * beta) * (termB * termC - (termA_safe * termA_safe * (gamma + 1)) / 2);
  const denominator_deriv = termA_safe * termA_safe + tan_theta * tan_theta * termB * termB;

  if (denominator_deriv === 0 || isNaN(numerator_deriv) || isNaN(denominator_deriv)) {
    return NaN; // Indicate failure
  }
  const derivative = numerator_deriv / denominator_deriv;
  const MAX_DERIVATIVE = 1e6;
  return Math.max(-MAX_DERIVATIVE, Math.min(MAX_DERIVATIVE, derivative));
}

/**
 * Solves for the wave angle β using Newton-Raphson method.
 * @param M1 Upstream Mach number
 * @param theta Deflection angle in RADIANS
 * @param gamma Specific heat ratio
 * @param initialGuess Initial guess for β in RADIANS
 * @returns Wave angle β in RADIANS, or NaN if no solution found
 */
function solveBeta(M1: number, theta: number, gamma: number, initialGuess: number): number {
  let beta = initialGuess;
  const minBeta = Math.asin(1 / M1);

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    if (beta <= minBeta) beta = minBeta + TOLERANCE * 10; // Ensure beta is slightly larger than minBeta
    if (beta >= Math.PI / 2) beta = Math.PI / 2 - TOLERANCE * 10; // Ensure beta is slightly less than PI/2

    const calculatedTheta = thetaBetaMachRelation(M1, beta, gamma);
    const derivative = thetaBetaMachDerivative(M1, beta, gamma);

    if (isNaN(calculatedTheta) || isNaN(derivative)) {
      return NaN;
    }

    const error = calculatedTheta - theta;

    if (Math.abs(error) < TOLERANCE) {
      if (beta > minBeta - TOLERANCE && beta < Math.PI / 2 + TOLERANCE) {
        // Allow slight tolerance for boundary checks
        return beta;
      } else {
        // console.warn(`Solver converged to a beta (${beta * RAD_TO_DEG}deg) outside valid physical range [${minBeta * RAD_TO_DEG}deg, 90deg].`);
        return NaN;
      }
    }

    if (Math.abs(derivative) < TOLERANCE / 100) {
      // Check if derivative is very close to zero
      if (Math.abs(error) < TOLERANCE * 100) {
        // If error is also very small, accept solution
        // console.warn("Derivative is near zero, but error is also small. Accepting solution.");
        return beta;
      } else {
        return NaN;
      }
    }

    let step = error / derivative;
    const MAX_STEP = 15 * DEG_TO_RAD; // Max step of 15 degrees
    if (Math.abs(step) > MAX_STEP) {
      step = Math.sign(step) * MAX_STEP;
    }

    // Damping factor to stabilize convergence, especially near problematic regions
    const dampingFactor = 0.85;
    beta = beta - dampingFactor * step;
  }
  // console.warn(`Solver did not converge within max iterations for M1=${M1}, theta=${theta * RAD_TO_DEG}deg.`);
  return NaN;
}

/**
 * Calculates maximum deflection angle θ_max for a given M₁ and γ by iteration.
 * Uses a simple search as the derivative can be problematic near the maximum.
 * @param M1 Upstream Mach number
 * @param gamma Specific heat ratio
 * @returns Object containing max deflection angle (degrees) and corresponding wave angle (degrees)
 */
export function calculateMaxDeflectionAngle(M1: number, gamma: number): { maxTheta: number; betaAtMaxTheta: number } {
  // Handle M1 very close to 1 or <= 1.
  if (M1 <= 1.000001) {
    return { maxTheta: 0, betaAtMaxTheta: Math.asin(1 / Math.max(1.000001, M1)) * RAD_TO_DEG };
  }

  let maxThetaRad = 0;
  const machAngleRad = Math.asin(1 / M1);
  let betaAtMaxThetaRad = machAngleRad; // For theta=0, beta is the Mach angle.

  const steps = 1000; // A reasonable number of steps for the scan.

  // Scan beta from just above the Mach angle to just below 90 degrees.
  const startBetaScan = machAngleRad + TOLERANCE; // Add TOLERANCE to avoid issues at exact Mach angle if M1*sin(beta)-1 becomes zero.
  const endBetaScan = Math.PI / 2 - TOLERANCE; // Subtract TOLERANCE to avoid issues with cot(beta) at 90 deg.

  // Ensure the scan range is valid (can be an issue if M1 is extremely close to 1, making machAngleRad near PI/2)
  if (startBetaScan >= endBetaScan) {
    maxThetaRad = 0; // Default to 0 if the scan range is non-positive.
    betaAtMaxThetaRad = machAngleRad;
  } else {
    for (let i = 0; i <= steps; i++) {
      const currentBetaRad = startBetaScan + (endBetaScan - startBetaScan) * (i / steps);

      // Defensive check, though loop construction should maintain this.
      if (currentBetaRad <= machAngleRad || currentBetaRad >= Math.PI / 2) {
        continue;
      }

      const thetaRad = thetaBetaMachRelation(M1, currentBetaRad, gamma);

      // We are looking for the maximum positive deflection angle.
      if (!isNaN(thetaRad) && thetaRad > maxThetaRad) {
        maxThetaRad = thetaRad;
        betaAtMaxThetaRad = currentBetaRad;
      }
    }
  }

  // If maxThetaRad is still extremely small (e.g., for M1 very slightly > 1), or became negative due to some numerical noise with beta < mu,
  // clamp it to 0. theta should not be negative for physical wedge deflection.
  if (maxThetaRad < TOLERANCE * 10) {
    // Using a slightly larger tolerance for this check
    maxThetaRad = 0;
    betaAtMaxThetaRad = machAngleRad;
  }

  return {
    maxTheta: maxThetaRad * RAD_TO_DEG,
    betaAtMaxTheta: betaAtMaxThetaRad * RAD_TO_DEG,
  };
}

/**
 * Calculates oblique shock properties for given M₁, θ, γ, and solution type.
 *
 * @param M1 Upstream Mach number (must be > 1)
 * @param theta Deflection angle in degrees (must be positive)
 * @param gamma Specific heat ratio (must be > 1)
 * @param weakSolution True for weak shock, false for strong shock
 * @returns ObliqueShockResult object
 * @throws Error if inputs are invalid or no shock solution exists
 */
export function calculateObliqueShock(
  M1: number,
  thetaDegrees: number,
  gamma: number = 1.4,
  weakSolution: boolean = true,
): ObliqueShockResult {
  if (M1 <= 1) {
    throw new Error("Upstream Mach number must be supersonic (M₁ > 1)");
  }
  // Allow slightly negative angles due to potential float precision issues in UI
  if (thetaDegrees < -TOLERANCE) {
    throw new Error("Deflection angle cannot be significantly negative.");
  }
  // Treat very small negative angles as zero
  if (thetaDegrees < 0) {
    thetaDegrees = 0;
  }

  if (gamma <= 1) {
    throw new Error("Specific heat ratio (γ) must be greater than 1");
  }

  const thetaRad = thetaDegrees * DEG_TO_RAD;
  const machAngleRad = Math.asin(1 / M1);

  const { maxTheta, betaAtMaxTheta } = calculateMaxDeflectionAngle(M1, gamma);

  // Add tolerance when comparing angles
  if (thetaDegrees > maxTheta + TOLERANCE * 10) {
    throw new Error(
      `Deflection angle (${thetaDegrees.toFixed(2)}°) exceeds maximum possible (${maxTheta.toFixed(2)}°) for M₁=${M1}. Shock detached.`,
    );
  }

  // Handle theta = 0 case explicitly: beta = mach angle
  if (Math.abs(thetaRad) < TOLERANCE) {
    const betaRadZeroTheta = machAngleRad;
    // Calculate properties for Mach wave (zero strength shock)
    const M2 = M1; // No change across Mach wave
    const pressureRatio = 1;
    const densityRatio = 1;
    const temperatureRatio = 1;
    const stagnationPressureRatio = 1;

    return {
      upstreamMach: M1,
      downstreamMach: M2,
      waveAngle: betaRadZeroTheta * RAD_TO_DEG,
      deflectionAngle: 0,
      pressureRatio,
      temperatureRatio,
      densityRatio,
      stagnationPressureRatio,
      machAngle: machAngleRad * RAD_TO_DEG,
      maxDeflectionAngle: maxTheta,
      gamma,
    };
  }

  // Initial guesses for beta solver
  // Weak solution: guess slightly above mach angle
  // Strong solution: guess slightly below 90 degrees (or near beta for max theta)
  const betaAtMaxThetaRad = betaAtMaxTheta * DEG_TO_RAD;
  const initialGuessWeak = Math.max(machAngleRad + TOLERANCE * 100, (machAngleRad + betaAtMaxThetaRad) / 2.1);
  const initialGuessStrong = Math.min(Math.PI / 2 - TOLERANCE * 100, (betaAtMaxThetaRad + Math.PI / 2) / 1.9);

  let betaRad = solveBeta(M1, thetaRad, gamma, weakSolution ? initialGuessWeak : initialGuessStrong);

  if (isNaN(betaRad)) {
    // console.warn(`Initial solver failed for ${weakSolution ? "weak" : "strong"} solution. Trying fallback guess.`);
    const fallbackGuess = weakSolution ? initialGuessStrong : initialGuessWeak;
    betaRad = solveBeta(M1, thetaRad, gamma, fallbackGuess);
  }

  if (isNaN(betaRad)) {
    const solutionTypeMsg = weakSolution ? "weak" : "strong";
    // Check if theta is very close to maxTheta, which is a common point of solver failure
    if (Math.abs(thetaDegrees - maxTheta) < 0.01) {
      // 0.01 degrees tolerance
      throw new Error(
        `Solver failed for ${solutionTypeMsg} solution at θ ≈ θ_max (${formatNumber(thetaDegrees, 2)}° ≈ ${formatNumber(maxTheta, 2)}°). Try adjusting θ slightly or check M₁.`,
      );
    }
    throw new Error(
      `Could not find a ${solutionTypeMsg} shock solution for M₁=${formatNumber(M1, 2)}, θ=${formatNumber(thetaDegrees, 2)}°. Max θ ≈ ${formatNumber(maxTheta, 2)}°. Solver failed.`,
    );
  }

  const betaDeg = betaRad * RAD_TO_DEG;
  // const isWeak = betaDeg < betaAtMaxTheta; // This check can be too strict due to numerical precision
  // const isStrong = betaDeg > betaAtMaxTheta;
  // const angleTolerance = 0.1;

  // if (weakSolution && !isWeak && Math.abs(betaDeg - betaAtMaxTheta) > angleTolerance) {
  //   // console.warn(
  //   //   `Solver found strong solution (β=${betaDeg.toFixed(2)}°) when weak was requested (β_maxθ=${betaAtMaxTheta.toFixed(2)}°). M1=${M1}, θ=${thetaDegrees}`,
  //   // );
  // } else if (!weakSolution && !isStrong && Math.abs(betaDeg - betaAtMaxTheta) > angleTolerance) {
  //   // console.warn(
  //   //   `Solver found weak solution (β=${betaDeg.toFixed(2)}°) when strong was requested (β_maxθ=${betaAtMaxTheta.toFixed(2)}°). M1=${M1}, θ=${thetaDegrees}`,
  //   // );
  // }

  const sin_beta = Math.sin(betaRad);
  let M1n_sq = M1 * M1 * sin_beta * sin_beta;

  if (M1n_sq < 1) {
    if (Math.abs(M1n_sq - 1) < TOLERANCE * 100) {
      // If M1n_sq is extremely close to 1 (e.g. 0.999999), treat as 1 to avoid numerical issues in downstream calcs but still flag it as a limit.
      // This can happen if beta is very close to machAngle and theta is near 0.
      // Results are for a Mach wave in this scenario.
      M1n_sq = 1.0;
      // No error thrown here if it's essentially a Mach wave, downstream properties will be M1=M2 etc.
    } else {
      throw new Error(
        `Upstream Mach component normal to shock (M₁ₙ = ${formatNumber(Math.sqrt(M1n_sq), 3)}) is subsonic. Cannot form a shock. Expected M₁ₙ > 1. Beta: ${formatNumber(betaRad * RAD_TO_DEG, 2)}°, Theta: ${formatNumber(thetaDegrees, 2)}°`,
      );
    }
  }

  const gp1 = gamma + 1;
  const gm1 = gamma - 1;

  // Normal shock relations:
  const pressureRatio = (2 * gamma * M1n_sq - gm1) / gp1;
  const densityRatio = (gp1 * M1n_sq) / (gm1 * M1n_sq + 2);
  const temperatureRatio = pressureRatio / densityRatio; // From ideal gas law p = ρRT -> T₂/T₁ = (p₂/p₁)/(ρ₂/ρ₁)
  const M2n = Math.sqrt((1 + ((gamma - 1) / 2) * M1n_sq) / (gamma * M1n_sq - (gamma - 1) / 2));

  // Downstream Mach number M₂ = M₂ₙ / sin(β - θ)
  const betaMinusTheta = betaRad - thetaRad;
  const sinBetaMinusTheta = Math.sin(betaMinusTheta);
  let M2: number;

  if (Math.abs(sinBetaMinusTheta) < TOLERANCE && M2n > TOLERANCE) {
    // M2n > TOLERANCE to avoid NaN for 0/0 case if flow is parallel to shock
    // This case (sin(beta-theta) ~ 0) implies beta ~ theta.
    // Physically, this is a very strong shock where the flow becomes nearly parallel to the shock wave itself.
    // M2 would be M2n / (small_number), leading to a very large M2 if M2n is not also very small.
    // However, for such strong shocks, M2n should be subsonic and M2 should also be subsonic.
    // If M2n is significantly positive and sin(beta-theta) is zero, it can imply an issue or extreme case.
    // The formulas should still generally hold if inputs are physical.
    // console.warn(
    //   `sin(β - θ) is near zero (β=${betaDeg.toFixed(2)}°, θ=${thetaDegrees.toFixed(2)}°). M₂ might be inaccurate or indicate an extreme flow condition.`,
    // );
    // If beta is extremely close to theta, M2 should be M2n. (flow almost aligned with shock downstream)
    // This is an extreme limit, but let M2n be the dominant factor if sin(beta-theta) is effectively zero.
    // However, the more robust approach is to calculate it and check validity.
    M2 = M2n / sinBetaMinusTheta;
  } else if (Math.abs(sinBetaMinusTheta) < TOLERANCE && Math.abs(M2n) < TOLERANCE) {
    // If both M2n and sin(beta-theta) are near zero, it can happen for theta=0, beta=mu, M1n=1, M2n=1.
    // M2 should be M1 in this specific Mach wave case.
    M2 = M1;
  } else {
    M2 = M2n / sinBetaMinusTheta;
  }

  if (isNaN(M2) || M2 < 0 || M2 > M1 * 50) {
    // Added check for excessively large M2
    // console.error( // Convert to throw
    //   `Calculated downstream Mach M2 is invalid: ${M2}. Inputs: M1=${M1}, θ=${thetaDegrees}°, β=${betaDeg.toFixed(2)}°`,
    // );
    throw new Error(
      `Calculation resulted in an invalid downstream Mach number (M₂ = ${formatNumber(M2, 3)}). Review inputs (M₁=${formatNumber(M1, 2)}, θ=${formatNumber(thetaDegrees, 2)}°, β=${formatNumber(betaDeg, 2)}°). This may indicate an extreme condition or solver issue.`,
    );
  }

  // Stagnation pressure ratio (p₀₂/p₀₁)
  // Uses Rayleigh Pitot formula applied to the normal component M₁ₙ
  const stagnationTerm1 = Math.pow((gp1 * M1n_sq) / (gm1 * M1n_sq + 2), gamma / gm1);
  const stagnationTerm2 = Math.pow(gp1 / (2 * gamma * M1n_sq - gm1), 1 / gm1);
  const stagnationPressureRatio = stagnationTerm1 * stagnationTerm2;

  return {
    upstreamMach: M1,
    downstreamMach: M2,
    waveAngle: betaDeg, // Already in degrees
    deflectionAngle: thetaDegrees,
    pressureRatio,
    temperatureRatio,
    densityRatio,
    stagnationPressureRatio,
    machAngle: machAngleRad * RAD_TO_DEG,
    maxDeflectionAngle: maxTheta,
    gamma,
  };
}

// TODO: Implement the θ-β-M relation solver (numerical method required)
// TODO: Implement functions to calculate properties based on M₁, β, and γ

// Helper function for formatting numbers in error messages, if not available globally
function formatNumber(num: number | undefined | null, decimals: number = 2): string {
  if (num === undefined || num === null || isNaN(num)) return "N/A";
  if (num === 0) return "0";
  if ((Math.abs(num) < 0.001 && num !== 0) || Math.abs(num) > 10000) {
    return num.toExponential(decimals);
  }
  return num.toFixed(decimals);
}
