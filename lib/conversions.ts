// Conversions

// Altitude
export const MtoFt = (m: number): number => m * 3.28084;
export const FttoM = (ft: number): number => ft / 3.28084;
export const MtoKm = (m: number): number => m / 1000;
export const KmtoM = (km: number): number => km * 1000;
export const MtoMi = (m: number): number => m / 1609.34;
export const MitoM = (mi: number): number => mi * 1609.34;

// Temperature
export const KtoC = (k: number): number => k - 273.15;
export const CtoK = (c: number): number => c + 273.15;
export const KtoF = (k: number): number => KtoC(k) * (9 / 5) + 32;
export const FtoK = (f: number): number => CtoK((f - 32) * (5 / 9));

// Pressure
export const PatoHpa = (pa: number): number => pa / 100;
export const HpatoPa = (hpa: number): number => hpa * 100;
export const PatoAtm = (pa: number): number => pa / 101325;
export const AtmtoPa = (atm: number): number => atm * 101325;
export const PatoBar = (pa: number): number => pa / 100000;
export const BartoPa = (bar: number): number => bar * 100000;

// Velocity
export const MStoKMH = (ms: number): number => ms * 3.6;
export const KMHtoMS = (kmh: number): number => kmh / 3.6;
export const MStoKMS = (ms: number): number => ms / 1000;
export const KMStoMS = (kms: number): number => kms * 1000;
export const MStoKnots = (ms: number): number => ms * 1.94384;
export const KnotsToMS = (knots: number): number => knots / 1.94384;

// Area
export const M2toFt2 = (m2: number): number => m2 * 10.7639;
export const Ft2toM2 = (ft2: number): number => ft2 / 10.7639;
