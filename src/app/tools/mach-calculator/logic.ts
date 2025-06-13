// Constants
const GAMMA = 1.4; // Ratio of specific heats for air
const R = 287.05; // Specific gas constant for air (J/kg·K)

export interface MachCalculatorResult {
  machNumber: number; // Mach number (dimensionless)
  speedOfSound: number; // Local speed of sound (m/s)
  airspeed: number; // True airspeed (m/s)
  temperature: number; // Local air temperature (K)
  temperatureC: number; // Local air temperature (°C)
  temperatureF: number; // Local air temperature (°F)
  isSubsonic: boolean; // True if M < 1
  isSupersonic: boolean; // True if M > 1
  isHypersonic: boolean; // True if M > 5
  regimeDescription: string; // Text description of flight regime
}

/**
 * International Standard Atmosphere (ISA) temperature at a given altitude
 * @param altitudeM Altitude in meters
 * @returns Temperature in Kelvin
 */
export function calculateTemperature(altitudeM: number): number {
  const h = altitudeM; // For readability

  // Sea level to 11,000 m (troposphere)
  if (h <= 11000) {
    return 288.15 - 0.00649 * h;
  }
  // 11,000 m to 20,000 m (lower stratosphere)
  else if (h <= 20000) {
    return 216.65;
  }
  // 20,000 m to 32,000 m (middle stratosphere)
  else if (h <= 32000) {
    return 216.65 + 0.00114 * (h - 20000);
  }
  // 32,000 m to 47,000 m (upper stratosphere)
  else if (h <= 47000) {
    return 228.65 + 0.00287 * (h - 32000);
  }
  // 47,000 m to 51,000 m (lower mesosphere)
  else if (h <= 51000) {
    return 270.65 + 0.00284 * (h - 47000);
  }
  // 51,000 m to 71,000 m (middle mesosphere)
  else if (h <= 71000) {
    return 270.65 + 0.00284 * (h - 47000) - 0.0028 * (h - 51000);
  }
  // 71,000 m to 100,000 m (upper mesosphere)
  else if (h <= 100000) {
    return 214.65 - 0.002 * (h - 71000);
  }
  // Above mesopause (simplified extension)
  else {
    return 214.65 - 0.002 * (100000 - 71000) - 0.004 * (h - 100000);
  }
}

/**
 * Calculate the speed of sound using the ideal gas equation
 * @param temperatureK Temperature in Kelvin
 * @returns Speed of sound in m/s
 */
export function calculateSpeedOfSound(temperatureK: number): number {
  return Math.sqrt(GAMMA * R * temperatureK);
}

/**
 * Calculate the Mach number from airspeed and altitude
 * @param airspeedMS Airspeed in meters per second
 * @param altitudeM Altitude in meters
 * @returns Mach calculator result object
 * @throws Error if parameters are invalid
 */
export function calculateMachNumber(airspeedMS: number, altitudeM: number): MachCalculatorResult {
  if (airspeedMS < 0) {
    throw new Error("Airspeed cannot be negative.");
  }

  // Calculate local temperature
  const temperature = calculateTemperature(altitudeM);
  const temperatureC = temperature - 273.15;
  const temperatureF = (temperatureC * 9) / 5 + 32;

  // Calculate speed of sound
  const speedOfSound = calculateSpeedOfSound(temperature);

  // Calculate Mach number
  const machNumber = airspeedMS / speedOfSound;

  // Determine flight regime
  const isSubsonic = machNumber < 1;
  const isSupersonic = machNumber >= 1;
  const isHypersonic = machNumber >= 5;

  let regimeDescription = "";
  if (machNumber < 0.8) {
    regimeDescription = "Subsonic";
  } else if (machNumber < 1.0) {
    regimeDescription = "Transonic";
  } else if (machNumber < 3.0) {
    regimeDescription = "Supersonic";
  } else if (machNumber < 5.0) {
    regimeDescription = "High Supersonic";
  } else if (machNumber < 10.0) {
    regimeDescription = "Hypersonic";
  } else {
    regimeDescription = "High Hypersonic";
  }

  return {
    machNumber,
    speedOfSound,
    airspeed: airspeedMS,
    temperature,
    temperatureC,
    temperatureF,
    isSubsonic,
    isSupersonic,
    isHypersonic,
    regimeDescription,
  };
}

/**
 * Calculate airspeed from Mach number and altitude
 * @param machNumber The Mach number (dimensionless)
 * @param altitudeM Altitude in meters
 * @returns Mach calculator result object
 * @throws Error if parameters are invalid
 */
export function calculateAirspeed(machNumber: number, altitudeM: number): MachCalculatorResult {
  if (machNumber < 0) {
    throw new Error("Mach number cannot be negative.");
  }

  // Calculate local temperature
  const temperature = calculateTemperature(altitudeM);
  const temperatureC = temperature - 273.15;
  const temperatureF = (temperatureC * 9) / 5 + 32;

  // Calculate speed of sound
  const speedOfSound = calculateSpeedOfSound(temperature);

  // Calculate true airspeed
  const airspeedMS = machNumber * speedOfSound;

  // Determine flight regime
  const isSubsonic = machNumber < 1;
  const isSupersonic = machNumber >= 1;
  const isHypersonic = machNumber >= 5;

  let regimeDescription = "";
  if (machNumber < 0.8) {
    regimeDescription = "Subsonic";
  } else if (machNumber < 1.0) {
    regimeDescription = "Transonic";
  } else if (machNumber < 3.0) {
    regimeDescription = "Supersonic";
  } else if (machNumber < 5.0) {
    regimeDescription = "High Supersonic";
  } else if (machNumber < 10.0) {
    regimeDescription = "Hypersonic";
  } else {
    regimeDescription = "High Hypersonic";
  }

  return {
    machNumber,
    speedOfSound,
    airspeed: airspeedMS,
    temperature,
    temperatureC,
    temperatureF,
    isSubsonic,
    isSupersonic,
    isHypersonic,
    regimeDescription,
  };
}
