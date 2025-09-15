// Speed of light in m/s
const C = 299792458;

export interface RadarRangeResult {
  maxRangeM: number; // Maximum range in meters
  wavelengthM: number; // Wavelength in meters
  // Include inputs in SI units for reference
  powerW: number;
  gainLinear: number;
  frequencyHz: number;
  rcsM2: number;
  minSignalW: number;
}

/**
 * Converts power value from selected unit to Watts (W).
 */
export function convertPowerToW(value: number, unit: "W" | "kW" | "MW"): number {
  switch (unit) {
    case "W":
      return value;
    case "kW":
      return value * 1e3;
    case "MW":
      return value * 1e6;
    default:
      throw new Error(`Invalid power unit: ${unit}`);
  }
}

/**
 * Converts antenna gain from selected unit to linear scale.
 * Assumes gain value is for a single antenna (used for transmit and receive).
 */
export function convertGainToLinear(value: number, unit: "dBi" | "linear"): number {
  switch (unit) {
    case "linear":
      return value;
    case "dBi":
      return Math.pow(10, value / 10);
    default:
      throw new Error(`Invalid gain unit: ${unit}`);
  }
}

/**
 * Converts frequency value from selected unit to Hertz (Hz).
 */
export function convertFrequencyToHz(value: number, unit: "MHz" | "GHz"): number {
  switch (unit) {
    case "MHz":
      return value * 1e6;
    case "GHz":
      return value * 1e9;
    default:
      throw new Error(`Invalid frequency unit: ${unit}`);
  }
}

/**
 * Converts Radar Cross Section (RCS) value from selected unit to square meters (m²).
 */
export function convertRcsToM2(value: number, unit: "m²" | "dBsm"): number {
  switch (unit) {
    case "m²":
      return value;
    case "dBsm":
      return Math.pow(10, value / 10); // dBsm = 10 * log10(m²)
    default:
      throw new Error(`Invalid RCS unit: ${unit}`);
  }
}

/**
 * Converts minimum detectable signal value from selected unit to Watts (W).
 */
export function convertSignalToW(value: number, unit: "W" | "mW" | "dBm"): number {
  switch (unit) {
    case "W":
      return value;
    case "mW":
      return value * 1e-3;
    case "dBm":
      return Math.pow(10, (value - 30) / 10); // dBm = 10 * log10(mW)
    default:
      throw new Error(`Invalid signal unit: ${unit}`);
  }
}

/**
 * Calculates the maximum theoretical radar range using the standard radar range equation.
 *
 * R_max = [ (P_t * G^2 * λ^2 * σ) / ( (4π)^3 * S_min ) ]^(1/4)
 *
 * @param powerW Transmit power in Watts (P_t)
 * @param gainLinear Antenna gain (linear scale, G) - assumed same for Tx/Rx
 * @param frequencyHz Frequency in Hertz (f)
 * @param rcsM2 Target Radar Cross Section in square meters (σ)
 * @param minSignalW Minimum detectable signal power in Watts (S_min)
 * @returns RadarRangeResult object containing max range and intermediate values.
 * @throws Error if inputs are invalid (e.g., non-positive).
 */
export function calculateRadarRange(
  powerW: number,
  gainLinear: number,
  frequencyHz: number,
  rcsM2: number,
  minSignalW: number,
): RadarRangeResult {
  // Input validation
  if (powerW <= 0) throw new Error("Transmit power must be positive.");
  if (gainLinear <= 0) throw new Error("Antenna gain must be positive.");
  if (frequencyHz <= 0) throw new Error("Frequency must be positive.");
  if (rcsM2 <= 0) throw new Error("Target RCS must be positive.");
  if (minSignalW <= 0) throw new Error("Minimum detectable signal must be positive.");

  // Calculate wavelength (λ = c / f)
  const wavelengthM = C / frequencyHz;

  // Calculate the numerator term
  const numerator = powerW * Math.pow(gainLinear, 2) * Math.pow(wavelengthM, 2) * rcsM2;

  // Calculate the denominator term
  const denominator = Math.pow(4 * Math.PI, 3) * minSignalW;

  if (denominator === 0) {
    throw new Error("Calculation resulted in division by zero (check inputs).");
  }

  const rangeTerm = numerator / denominator;

  if (rangeTerm < 0) {
    // This shouldn't happen with positive inputs, but check anyway
    throw new Error("Intermediate calculation resulted in a negative value before root.");
  }

  // Calculate maximum range (R_max = [ rangeTerm ]^(1/4))
  const maxRangeM = Math.pow(rangeTerm, 1 / 4);

  return {
    maxRangeM,
    wavelengthM,
    powerW,
    gainLinear,
    frequencyHz,
    rcsM2,
    minSignalW,
  };
}
