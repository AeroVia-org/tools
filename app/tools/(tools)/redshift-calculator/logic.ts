import { SPEED_OF_LIGHT_MPS } from "@/lib/constants";

export function frequencyToWavelength(frequencyHz: number): number {
  return SPEED_OF_LIGHT_MPS / frequencyHz;
}

export function wavelengthToFrequency(wavelengthM: number): number {
  return SPEED_OF_LIGHT_MPS / wavelengthM;
}

export function calculateRedshiftFromFrequency(frequencyObservedHz: number, frequencyRestHz: number): number {
  const wavelengthObservedM = frequencyToWavelength(frequencyObservedHz);
  const wavelengthRestM = frequencyToWavelength(frequencyRestHz);
  return calculateRedshiftFromWavelength(wavelengthObservedM, wavelengthRestM);
}

export function calculateRedshiftFromWavelength(wavelengthObservedM: number, wavelengthRestM: number): number {
  return (wavelengthObservedM - wavelengthRestM) / wavelengthRestM;
}
