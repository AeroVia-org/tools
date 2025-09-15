export const METERS_PER: Record<string, number> = {
  m: 1,
  km: 1_000,
  AU: 149_597_870_700, // IAU 2012 definition
  ly: 9_460_730_472_580_800, // exact by convention in meters
  pc: 3.085_677_581_491_367_3e16, // parsec in meters
  LD: 384_400_000, // mean Earth–Moon distance
};

export type AstronomicalUnit = keyof typeof METERS_PER;

export const astronomicalUnits: Array<AstronomicalUnit> = ["m", "km", "AU", "ly", "pc", "LD"];

export function convertDistance(value: number, fromUnit: AstronomicalUnit, toUnit: AstronomicalUnit): number {
  const from = METERS_PER[fromUnit];
  const to = METERS_PER[toUnit];
  if (from === undefined) throw new Error(`Unknown unit: ${fromUnit}`);
  if (to === undefined) throw new Error(`Unknown unit: ${toUnit}`);
  const inMeters = value * from;
  return inMeters / to;
}
