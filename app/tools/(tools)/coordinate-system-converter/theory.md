This tool converts between geodetic coordinates (latitude, longitude, altitude) and Earth-Centered, Earth-Fixed (ECEF) Cartesian coordinates using the WGS84 reference ellipsoid. Latitude and longitude are specified in degrees, altitude is above the ellipsoid in meters or feet.

The WGS84 ellipsoid has semi-major axis a = 6378137 m and flattening f = 1/298.257223563. The first eccentricity squared is e² = f(2 - f). The prime vertical radius of curvature is N = a / √(1 - e² sin²φ).

## Forward Equations (LLA → ECEF)

- x = (N + h) cosφ cosλ
- y = (N + h) cosφ sinλ
- z = (N(1 - e²) + h) sinφ

## Inverse Equations (ECEF → LLA)

The inverse uses Bowring's method with an auxiliary angle θ and yields accurate results for all valid inputs, including near the poles.
