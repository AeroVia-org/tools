"use client";

import { FaInfoCircle } from "react-icons/fa";

export default function Theory() {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <FaInfoCircle className="text-primary h-5 w-5" />
        <h2 className="text-foreground text-lg font-semibold">Theory</h2>
      </div>
      <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
        <p>
          This tool converts between geodetic coordinates (latitude, longitude, altitude) and Earth-Centered,
          Earth-Fixed (ECEF) Cartesian coordinates using the WGS84 reference ellipsoid. Latitude and longitude are
          specified in degrees, altitude is above the ellipsoid in meters or feet.
        </p>
        <p>
          The WGS84 ellipsoid has semi-major axis a = 6378137 m and flattening f = 1/298.257223563. The first
          eccentricity squared is e² = f(2 - f). The prime vertical radius of curvature is N = a / √(1 - e² sin²φ).
        </p>
        <p>The forward equations (LLA → ECEF) are:</p>
        <ul className="list-disc pl-5">
          <li>x = (N + h) cosφ cosλ</li>
          <li>y = (N + h) cosφ sinλ</li>
          <li>z = (N(1 - e²) + h) sinφ</li>
        </ul>
        <p>
          The inverse (ECEF → LLA) uses Bowring’s method with an auxiliary angle θ and yields accurate results for all
          valid inputs, including near the poles.
        </p>
      </div>
    </div>
  );
}
