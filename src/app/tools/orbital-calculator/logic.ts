// Constants
const G = 6.6743e-11; // Gravitational constant (m^3 kg^-1 s^-2)
const M_EARTH = 5.972e24; // Mass of Earth (kg)
const R_EARTH_KM = 6371; // Average radius of Earth (km)
const R_EARTH_M = R_EARTH_KM * 1000; // Average radius of Earth (m)

export interface OrbitalResult {
  altitudeKm: number; // km
  orbitalRadiusM: number; // m
  velocityMs: number; // m/s
  periodS: number; // seconds
}

/**
 * Calculates orbital velocity and period for a circular orbit around Earth.
 * @param altitudeKm Altitude above Earth's surface in kilometers.
 * @returns Orbital properties object.
 * @throws Error if altitude results in an invalid orbital radius.
 */
export function calculateOrbitalProperties(altitudeKm: number): OrbitalResult {
  if (altitudeKm < 0) {
    // Technically orbits below the surface are impossible,
    // but low negative numbers might be useful for near-surface calcs if needed.
    // For now, let's treat significant negative altitude as an error.
    // A small tolerance might be acceptable depending on use case.
    if (altitudeKm < -R_EARTH_KM) {
      throw new Error("Altitude cannot be below the center of the Earth.");
    }
    // Allow very small negative altitudes, treating them as surface level
    // to avoid floating point issues near zero.
    if (altitudeKm < -1e-6) {
      console.warn("Altitude is negative, treating as near surface level.");
      altitudeKm = 0;
    }
  }

  const altitudeM = altitudeKm * 1000;
  const orbitalRadiusM = R_EARTH_M + altitudeM;

  if (orbitalRadiusM <= 0) {
    throw new Error("Orbital radius must be positive.");
  }

  // Standard gravitational parameter (μ) for Earth
  const mu = G * M_EARTH; // m^3 s^-2

  // Velocity for circular orbit: v = sqrt(μ / r)
  const velocityMs = Math.sqrt(mu / orbitalRadiusM);

  // Period for circular orbit: T = 2 * π * sqrt(r^3 / μ)
  const periodS = 2 * Math.PI * Math.sqrt(Math.pow(orbitalRadiusM, 3) / mu);

  return {
    altitudeKm,
    orbitalRadiusM,
    velocityMs,
    periodS,
  };
}
