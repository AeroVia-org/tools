// Base units for each category
const baseUnits = {
  Length: "m",
  Mass: "kg",
  Temperature: "K",
  Velocity: "m/s",
  Pressure: "Pa",
  Force: "N",
  Area: "m2",
  Volume: "m3",
};

// Conversion factors relative to the base unit
const factors: Record<string, Record<string, number>> = {
  Length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
    nmi: 1852, // Nautical mile
  },
  Mass: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    tonne: 1000,
    lb: 0.453592,
    oz: 0.0283495,
    slug: 14.5939,
  },
  Temperature: {
    // Temperature requires special handling (offset)
    // Factors here represent the scale factor, offset handled in convertUnit
    K: 1,
    C: 1,
    F: 5 / 9,
  },
  Velocity: {
    "m/s": 1,
    "km/h": 1 / 3.6,
    mph: 0.44704,
    kn: 0.514444, // knots
    fps: 0.3048,
  },
  Pressure: {
    Pa: 1,
    hPa: 100,
    kPa: 1000,
    MPa: 1000000,
    bar: 100000,
    mbar: 100,
    psi: 6894.76,
    atm: 101325,
    mmHg: 133.322,
  },
  Force: {
    N: 1,
    kN: 1000,
    lbf: 4.44822, // Pound-force
  },
  Area: {
    m2: 1,
    km2: 1000000,
    cm2: 0.0001,
    mm2: 0.000001,
    ha: 10000, // hectare
    acre: 4046.86,
    ft2: 0.092903,
    in2: 0.00064516,
  },
  Volume: {
    m3: 1,
    L: 0.001,
    mL: 0.000001,
    gal: 0.00378541, // US Gallon
    qt: 0.000946353, // US Quart
    ft3: 0.0283168,
    in3: 0.0000163871,
  },
};

// Type definition for categories based on the keys of baseUnits
export type UnitCategory = keyof typeof baseUnits;

// Function to get available units for a category
export function getUnitsForCategory(category: UnitCategory): string[] {
  if (!factors[category]) {
    throw new Error(`Unknown category: ${category}`);
  }
  return Object.keys(factors[category]);
}

// All categories and their units
export const allCategories: Record<UnitCategory, string[]> = Object.keys(baseUnits).reduce(
  (acc, category) => {
    acc[category as UnitCategory] = getUnitsForCategory(category as UnitCategory);
    return acc;
  },
  {} as Record<UnitCategory, string[]>,
);

/**
 * Converts a value from one unit to another within the same category.
 * @param value The numerical value to convert.
 * @param fromUnit The unit to convert from.
 * @param toUnit The unit to convert to.
 * @param category The measurement category (e.g., Length, Mass).
 * @returns The converted value.
 * @throws Error if units are incompatible, unknown, or belong to different categories.
 */
export function convertUnit(value: number, fromUnit: string, toUnit: string, category: UnitCategory): number {
  if (fromUnit === toUnit) {
    return value;
  }

  const categoryFactors = factors[category];
  if (!categoryFactors) {
    throw new Error(`Unknown or unsupported category: ${category}`);
  }

  const fromFactor = categoryFactors[fromUnit];
  const toFactor = categoryFactors[toUnit];

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error(`Unknown unit in category ${category}: ${fromFactor === undefined ? fromUnit : toUnit}`);
  }

  // Special handling for Temperature
  if (category === "Temperature") {
    let valueKelvin: number;
    // Convert input value to Kelvin (base unit)
    if (fromUnit === "C") {
      valueKelvin = value + 273.15;
    } else if (fromUnit === "F") {
      valueKelvin = (value - 32) * (5 / 9) + 273.15;
    } else {
      // fromUnit === 'K'
      valueKelvin = value;
    }

    // Check if Kelvin temperature is physically valid
    if (valueKelvin < 0) {
      throw new Error("Temperature cannot be below absolute zero (0 K).");
    }

    // Convert from Kelvin to the target unit
    if (toUnit === "C") {
      return valueKelvin - 273.15;
    } else if (toUnit === "F") {
      return (valueKelvin - 273.15) * (9 / 5) + 32;
    } else {
      // toUnit === 'K'
      return valueKelvin;
    }
  }

  // Standard conversion for other categories
  const valueInBaseUnit = value * fromFactor;
  const valueInTargetUnit = valueInBaseUnit / toFactor;

  return valueInTargetUnit;
}
