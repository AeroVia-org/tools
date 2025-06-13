// ISA Constants
export const T0 = 288.15; // Sea level standard temperature (K)
export const P0 = 101325; // Sea level standard pressure (Pa)
export const R = 287.05; // Specific gas constant for dry air (J/(kg·K))
export const g0 = 9.80665; // Standard gravity (m/s²)

// Layer structure of the ISA (based on ICAO Standard Atmosphere)
// Each layer has a base altitude and a lapse rate (temperature gradient)
export interface AtmosphericLayer {
  name: string;
  baseAltitude: number; // meters
  lapsRate: number; // K/m (positive means temperature decreases with height)
  baseTemperature?: number; // K (calculated based on previous layers)
  basePressure?: number; // Pa (calculated based on previous layers)
  baseDensity?: number; // kg/m³ (calculated based on previous layers)
}

// Define the layers of the atmosphere (pre-calculated base values provided for reference)
export const ISA_LAYERS: AtmosphericLayer[] = [
  {
    name: "Troposphere",
    baseAltitude: 0,
    lapsRate: 0.0065, // 6.5 K/km
    baseTemperature: 288.15, // 15°C
    basePressure: 101325, // 1013.25 hPa
    baseDensity: 1.225,
  },
  {
    name: "Tropopause",
    baseAltitude: 11000,
    lapsRate: 0, // isothermal
    baseTemperature: 216.65, // -56.5°C
    basePressure: 22632, // 226.32 hPa
    baseDensity: 0.3639,
  },
  {
    name: "Stratosphere I",
    baseAltitude: 20000,
    lapsRate: -0.001, // -1.0 K/km (temperature increases with height)
    baseTemperature: 216.65, // -56.5°C
    basePressure: 5474.9, // 54.749 hPa
    baseDensity: 0.088,
  },
  {
    name: "Stratosphere II",
    baseAltitude: 32000,
    lapsRate: -0.0028, // -2.8 K/km (temperature increases with height)
    baseTemperature: 228.65, // -44.5°C
    basePressure: 868.02, // 8.6802 hPa
    baseDensity: 0.0132,
  },
  {
    name: "Stratopause",
    baseAltitude: 47000,
    lapsRate: 0, // isothermal
    baseTemperature: 270.65, // -2.5°C
    basePressure: 110.91, // 1.1091 hPa
    baseDensity: 0.0014,
  },
  {
    name: "Mesosphere I",
    baseAltitude: 51000,
    lapsRate: 0.0028, // 2.8 K/km
    baseTemperature: 270.65, // -2.5°C
    basePressure: 66.939, // 0.66939 hPa
    baseDensity: 0.0009,
  },
  {
    name: "Mesosphere II",
    baseAltitude: 71000,
    lapsRate: 0.002, // 2.0 K/km
    baseTemperature: 214.65, // -58.5°C
    basePressure: 3.9564, // 0.039564 hPa
    baseDensity: 0.0001,
  },
  {
    name: "Mesopause",
    baseAltitude: 84852,
    lapsRate: 0, // For calculation upper limit
    baseTemperature: 186.95, // -86.2°C
    basePressure: 0.3734, // 0.003734 hPa
    baseDensity: 0.00001,
  },
];

// For backward compatibility with existing code
export const a = -0.0065; // Standard temperature lapse rate (K/m) in troposphere
export const H_TROPOPAUSE = 11000; // Altitude of tropopause (m)
export const T_TROPOPAUSE = T0 + a * H_TROPOPAUSE; // Temperature at tropopause (K)
export const P_TROPOPAUSE = P0 * Math.pow(T_TROPOPAUSE / T0, -g0 / (a * R)); // Pressure at tropopause (Pa)

export interface IsaResult {
  altitude: number; // meters
  temperature: number; // Kelvin
  pressure: number; // Pascal
  density: number; // kg/m³
  layer?: string; // Atmospheric layer name
}

/**
 * Find the atmospheric layer for a given altitude
 * @param altitudeMeters Geometric altitude in meters.
 * @returns The atmospheric layer containing the given altitude
 */
function findAtmosphericLayer(altitudeMeters: number): AtmosphericLayer {
  // Find the layer corresponding to the input altitude
  for (let i = ISA_LAYERS.length - 1; i >= 0; i--) {
    if (altitudeMeters >= ISA_LAYERS[i].baseAltitude) {
      return ISA_LAYERS[i];
    }
  }

  // Default to troposphere if below 0m (should not happen in normal use)
  return ISA_LAYERS[0];
}

/**
 * Calculates ISA properties based on altitude.
 * @param altitudeMeters Geometric altitude in meters.
 * @returns ISA properties object.
 * @throws Error if altitude is invalid or calculations fail.
 */
export function calculateIsaFromAltitude(altitudeMeters: number): IsaResult {
  if (altitudeMeters < 0) {
    throw new Error("Altitude cannot be negative.");
  }
  // Add a reasonable upper limit check
  if (altitudeMeters > 86000) {
    throw new Error("Calculations are valid up to 86,000 meters based on standard ISA tables.");
  }

  // Find the applicable atmospheric layer
  const layer = findAtmosphericLayer(altitudeMeters);

  // Calculate temperature at the specified altitude
  const deltaAltitude = altitudeMeters - layer.baseAltitude;
  const temperature = layer.baseTemperature! - layer.lapsRate * deltaAltitude;

  let pressure: number;

  // Calculate pressure based on layer type
  if (Math.abs(layer.lapsRate) < 1e-10) {
    // Isothermal layer - use exponential formula
    pressure = layer.basePressure! * Math.exp((-g0 * deltaAltitude) / (R * layer.baseTemperature!));
  } else {
    // Layer with temperature gradient - use power formula
    pressure = layer.basePressure! * Math.pow(temperature / layer.baseTemperature!, g0 / (R * layer.lapsRate));
  }

  if (pressure <= 0) throw new Error("Calculated pressure is non-positive.");

  // Calculate density using the ideal gas law
  const density = pressure / (R * temperature);

  if (density <= 0) throw new Error("Calculated density is non-positive.");

  return {
    altitude: altitudeMeters,
    temperature,
    pressure,
    density,
    layer: layer.name,
  };
}

/**
 * Calculates altitude and other ISA properties from pressure.
 * @param pressurePa Pressure in Pascals.
 * @returns ISA properties object.
 * @throws Error if pressure is invalid or outside standard range.
 */
export function calculateIsaFromPressure(pressurePa: number): IsaResult {
  if (pressurePa <= 0) {
    throw new Error("Pressure must be positive.");
  }
  if (pressurePa > P0) {
    throw new Error("Pressure cannot be greater than sea level standard pressure (P0).");
  }

  // Find the layer where this pressure exists
  let targetLayer: AtmosphericLayer | null = null;

  // Start from sea level and go up until we find a layer with lower base pressure
  for (let i = 1; i < ISA_LAYERS.length; i++) {
    if (pressurePa > ISA_LAYERS[i].basePressure!) {
      targetLayer = ISA_LAYERS[i - 1];
      break;
    }
  }

  // If we didn't find it, it must be in the highest layer
  if (!targetLayer) {
    targetLayer = ISA_LAYERS[ISA_LAYERS.length - 2]; // Use second-to-last layer
  }

  let altitude: number;
  let temperature: number;

  // Calculate altitude based on layer type
  if (Math.abs(targetLayer.lapsRate) < 1e-10) {
    // Isothermal layer
    temperature = targetLayer.baseTemperature!;
    altitude = targetLayer.baseAltitude - ((R * temperature) / g0) * Math.log(pressurePa / targetLayer.basePressure!);
  } else {
    // Layer with temperature gradient
    const exponent = (R * targetLayer.lapsRate) / g0;
    const ratio = Math.pow(pressurePa / targetLayer.basePressure!, exponent);
    temperature = targetLayer.baseTemperature! * ratio;
    altitude = targetLayer.baseAltitude + (targetLayer.baseTemperature! - temperature) / targetLayer.lapsRate;
  }

  if (altitude < 0) {
    throw new Error("Calculated altitude is negative.");
  }

  // Recalculate density based on the derived altitude and temperature
  const density = pressurePa / (R * temperature);
  if (density <= 0) throw new Error("Calculated density is non-positive.");

  return {
    altitude,
    temperature,
    pressure: pressurePa,
    density,
    layer: targetLayer.name,
  };
}

/**
 * Calculates altitude and other ISA properties from temperature.
 * Note: Only valid for layers with a non-zero lapse rate.
 * @param temperatureK Temperature in Kelvin.
 * @returns ISA properties object.
 * @throws Error if temperature is invalid or in an isothermal layer.
 */
export function calculateIsaFromTemperature(temperatureK: number): IsaResult {
  if (temperatureK <= 0) {
    throw new Error("Temperature must be positive (in Kelvin).");
  }

  // Find the layer where this temperature could exist
  const possibleLayers: AtmosphericLayer[] = [];

  for (let i = 0; i < ISA_LAYERS.length - 1; i++) {
    const layer = ISA_LAYERS[i];
    const nextLayer = ISA_LAYERS[i + 1];

    // Skip isothermal layers
    if (Math.abs(layer.lapsRate) < 1e-10) continue;

    // Calculate temperature at top of this layer
    const topTemperature = layer.baseTemperature! - layer.lapsRate * (nextLayer.baseAltitude - layer.baseAltitude);

    // Check if temperature is in this layer's range
    if (
      (layer.lapsRate > 0 && temperatureK <= layer.baseTemperature! && temperatureK >= topTemperature) ||
      (layer.lapsRate < 0 && temperatureK >= layer.baseTemperature! && temperatureK <= topTemperature)
    ) {
      possibleLayers.push(layer);
    }
  }

  if (possibleLayers.length === 0) {
    throw new Error(`Temperature ${temperatureK.toFixed(2)} K is not in a layer with variable temperature.`);
  }

  // If found in multiple layers, use the lowest altitude layer for simplicity
  const layer = possibleLayers[0];

  // Calculate altitude from temperature
  const altitude = layer.baseAltitude + (layer.baseTemperature! - temperatureK) / layer.lapsRate;

  // Ensure altitude is within valid bounds
  if (altitude < 0 || altitude > 86000) {
    throw new Error("Calculated altitude is outside valid range (0-86,000m).");
  }

  // Calculate pressure at this altitude
  let pressure;
  if (Math.abs(layer.lapsRate) < 1e-10) {
    // Should not happen based on layer selection
    throw new Error("Cannot calculate pressure in an isothermal layer from temperature.");
  } else {
    pressure = layer.basePressure! * Math.pow(temperatureK / layer.baseTemperature!, g0 / (R * layer.lapsRate));
  }

  if (pressure <= 0) throw new Error("Calculated pressure is non-positive.");

  // Calculate density using the ideal gas law
  const density = pressure / (R * temperatureK);
  if (density <= 0) throw new Error("Calculated density is non-positive.");

  return {
    altitude,
    temperature: temperatureK,
    pressure,
    density,
    layer: layer.name,
  };
}
