// Coordinate conversions between Geodetic (WGS84) and ECEF

export type LLA = {
  latDeg: number; // latitude in degrees
  lonDeg: number; // longitude in degrees
  alt: number; // altitude above ellipsoid in meters
};

export type ECEF = {
  x: number; // meters
  y: number; // meters
  z: number; // meters
};

// WGS84 ellipsoid constants
const WGS84_A = 6378137.0; // semi-major axis (m)
const WGS84_F = 1 / 298.257223563; // flattening
const WGS84_E2 = WGS84_F * (2 - WGS84_F); // first eccentricity squared
const WGS84_B = WGS84_A * (1 - WGS84_F); // semi-minor axis (m)
const WGS84_E2_PRIME = (WGS84_A * WGS84_A - WGS84_B * WGS84_B) / (WGS84_B * WGS84_B);

const degToRad = (deg: number): number => (deg * Math.PI) / 180;
const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

// Convert geodetic LLA to ECEF XYZ (meters)
// ECEF coordinate system:
// - X-axis: Points toward intersection of equator and prime meridian (0° lat, 0° lon)
// - Y-axis: Points toward intersection of equator and 90° East longitude (0° lat, 90° lon)
// - Z-axis: Points toward North Pole (90° lat, any lon)
export function llaToEcef(lla: LLA): ECEF {
  const lat = degToRad(lla.latDeg);
  const lon = degToRad(lla.lonDeg);
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const cosLon = Math.cos(lon);
  const sinLon = Math.sin(lon);

  // Prime vertical radius of curvature
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);

  const x = (N + lla.alt) * cosLat * cosLon;
  const y = (N + lla.alt) * cosLat * sinLon;
  const z = (N * (1 - WGS84_E2) + lla.alt) * sinLat;

  return { x, y, z };
}

// Convert ECEF XYZ (meters) to geodetic LLA
export function ecefToLla(ecef: ECEF): LLA {
  const { x, y, z } = ecef;
  const p = Math.sqrt(x * x + y * y);

  // Handle pole singularity
  if (p < 1e-9) {
    const lat = z >= 0 ? 90 : -90;
    const lon = 0;
    const N = WGS84_A / Math.sqrt(1 - WGS84_E2);
    const alt = Math.abs(z) - N * (1 - WGS84_E2);
    return { latDeg: lat, lonDeg: lon, alt };
  }

  const theta = Math.atan2(z * WGS84_A, p * WGS84_B);
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  const lon = Math.atan2(y, x); // [-pi, pi]
  const lat = Math.atan2(
    z + WGS84_E2_PRIME * WGS84_B * sinTheta * sinTheta * sinTheta,
    p - WGS84_E2 * WGS84_A * cosTheta * cosTheta * cosTheta,
  );

  const sinLat = Math.sin(lat);
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);
  const alt = p / Math.cos(lat) - N;

  return { latDeg: radToDeg(lat), lonDeg: radToDeg(lon), alt };
}

export function metersToFeet(m: number): number {
  return m * 3.28084;
}

export function feetToMeters(ft: number): number {
  return ft / 3.28084;
}

export function metersToNauticalMiles(m: number): number {
  return m / 1852;
}

export function nauticalMilesToMeters(nmi: number): number {
  return nmi * 1852;
}

export function metersToKilometers(m: number): number {
  return m / 1000;
}

export function kilometersToMeters(km: number): number {
  return km * 1000;
}

// DMS (Degrees, Minutes, Seconds) conversion functions
export function degreesToDMS(deg: number): { degrees: number; minutes: number; seconds: number } {
  const absDeg = Math.abs(deg);
  const degrees = Math.floor(absDeg);
  const minutesFloat = (absDeg - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  return {
    degrees: deg < 0 ? -degrees : degrees,
    minutes,
    seconds,
  };
}

export function dmsToDegrees(dms: { degrees: number; minutes: number; seconds: number }): number {
  const absDeg = Math.abs(dms.degrees);
  const sign = dms.degrees < 0 ? -1 : 1;
  return sign * (absDeg + dms.minutes / 60 + dms.seconds / 3600);
}

export function formatNumber(num: number, digits = 6): string {
  if (!Number.isFinite(num)) return "N/A";
  // Prefer concise format without trailing zeros
  const str = num.toPrecision(digits);
  return str.replace(/\.0+($|e)/, "$1").replace(/(\.\d*?)0+($|e)/, "$1$2");
}

// Test function to verify coordinate system directions
export function testCoordinateDirections(): void {
  console.log("Testing coordinate system directions:");

  // Test 1: 0° lat, 10° lon (should go East)
  const test1 = llaToEcef({ latDeg: 0, lonDeg: 10, alt: 0 });
  console.log("0° lat, 10° lon -> X:", test1.x.toFixed(0), "Y:", test1.y.toFixed(0), "Z:", test1.z.toFixed(0));

  // Test 2: 10° lat, 0° lon (should go North)
  const test2 = llaToEcef({ latDeg: 10, lonDeg: 0, alt: 0 });
  console.log("10° lat, 0° lon -> X:", test2.x.toFixed(0), "Y:", test2.y.toFixed(0), "Z:", test2.z.toFixed(0));

  // Test 3: 0° lat, -10° lon (should go West)
  const test3 = llaToEcef({ latDeg: 0, lonDeg: -10, alt: 0 });
  console.log("0° lat, -10° lon -> X:", test3.x.toFixed(0), "Y:", test3.y.toFixed(0), "Z:", test3.z.toFixed(0));

  // Test 4: -10° lat, 0° lon (should go South)
  const test4 = llaToEcef({ latDeg: -10, lonDeg: 0, alt: 0 });
  console.log("-10° lat, 0° lon -> X:", test4.x.toFixed(0), "Y:", test4.y.toFixed(0), "Z:", test4.z.toFixed(0));
}
