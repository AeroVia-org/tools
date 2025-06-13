// Constants
const G = 6.6743e-11; // Gravitational constant (m^3 kg^-1 s^-2)
const M_EARTH = 5.972e24; // Mass of Earth (kg)
const R_EARTH_KM = 6371; // Average radius of Earth (km)
const R_EARTH_M = R_EARTH_KM * 1000; // Average radius of Earth (m)
const mu = G * M_EARTH; // Standard gravitational parameter (μ) for Earth (m^3 s^-2)

export interface HohmannResult {
  initialAltitudeKm: number; // km
  finalAltitudeKm: number; // km
  initialRadiusM: number; // m
  finalRadiusM: number; // m
  transferSemiMajorAxisM: number; // m
  deltaV1Ms: number; // m/s
  deltaV2Ms: number; // m/s
  totalDeltaVMs: number; // m/s
  transferTimeS: number; // seconds
}

/**
 * Calculates the delta-v and transfer time for a Hohmann transfer between two circular orbits around Earth.
 * @param initialAltitudeKm Altitude of the initial circular orbit above Earth's surface (km).
 * @param finalAltitudeKm Altitude of the final circular orbit above Earth's surface (km).
 * @returns Hohmann transfer properties object.
 * @throws Error if altitudes are invalid or equal.
 */
export function calculateHohmannTransfer(initialAltitudeKm: number, finalAltitudeKm: number): HohmannResult {
  if (initialAltitudeKm < 0 || finalAltitudeKm < 0) {
    // Allow very small negative altitudes, treating them as surface level
    if (initialAltitudeKm < -R_EARTH_KM || finalAltitudeKm < -R_EARTH_KM) {
      throw new Error("Altitude cannot be below the center of the Earth.");
    }
    if (initialAltitudeKm < -1e-6) {
      console.warn("Initial altitude is negative, treating as near surface level.");
      initialAltitudeKm = 0;
    }
    if (finalAltitudeKm < -1e-6) {
      console.warn("Final altitude is negative, treating as near surface level.");
      finalAltitudeKm = 0;
    }
  }

  const initialRadiusM = R_EARTH_M + initialAltitudeKm * 1000;
  const finalRadiusM = R_EARTH_M + finalAltitudeKm * 1000;

  if (initialRadiusM <= 0 || finalRadiusM <= 0) {
    throw new Error("Orbital radii must be positive.");
  }

  if (Math.abs(initialRadiusM - finalRadiusM) < 1e-6) {
    // Use tolerance for floating point comparison
    throw new Error("Initial and final altitudes cannot be the same for a Hohmann transfer.");
  }

  // Velocities in the initial and final circular orbits
  const v1 = Math.sqrt(mu / initialRadiusM); // Initial circular velocity
  const v2 = Math.sqrt(mu / finalRadiusM); // Final circular velocity

  // Semi-major axis of the transfer ellipse
  const transferSemiMajorAxisM = (initialRadiusM + finalRadiusM) / 2;

  // Velocities at the periapsis and apoapsis of the transfer ellipse
  // Ensure we use the correct radius (initial or final) depending on transfer direction
  const vTransfer1 = Math.sqrt(mu * (2 / initialRadiusM - 1 / transferSemiMajorAxisM)); // Velocity at transfer ellipse point touching initial orbit
  const vTransfer2 = Math.sqrt(mu * (2 / finalRadiusM - 1 / transferSemiMajorAxisM)); // Velocity at transfer ellipse point touching final orbit

  // Delta-V maneuvers
  // Note: The burns are impulsive (instantaneous change in velocity)
  const deltaV1Ms = Math.abs(vTransfer1 - v1); // First burn (enter transfer orbit)
  const deltaV2Ms = Math.abs(v2 - vTransfer2); // Second burn (circularize at final orbit)
  const totalDeltaVMs = deltaV1Ms + deltaV2Ms;

  // Time of flight for the transfer (half the period of the transfer ellipse)
  const transferTimeS = Math.PI * Math.sqrt(Math.pow(transferSemiMajorAxisM, 3) / mu);

  return {
    initialAltitudeKm,
    finalAltitudeKm,
    initialRadiusM,
    finalRadiusM,
    transferSemiMajorAxisM,
    deltaV1Ms,
    deltaV2Ms,
    totalDeltaVMs,
    transferTimeS,
  };
}
