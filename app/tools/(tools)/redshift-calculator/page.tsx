"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import OpenSourceCard from "../../components/OpenSourceCard";
import ToolTitle from "../../components/ToolTitle";
import {
  frequencyToWavelength,
  wavelengthToFrequency,
  calculateRedshiftFromFrequency,
  calculateRedshiftFromWavelength,
} from "./logic";
import {
  NmtoM,
  UmtoM,
  AngstromtoM,
  MmtoM,
  CmtoM,
  MtoNm,
  MtoUm,
  MtoAngstrom,
  MtoMm,
  MtoCm,
  KHztoHz,
  MHztoHz,
  GHztoHz,
  THztoHz,
  HztoKHz,
  HztoMHz,
  HztoGHz,
  HztoTHz,
} from "@/lib/conversions";
import RedshiftVisualization from "./visualization";
import Theory from "../../components/Theory";

type WavelengthUnit = "m" | "nm" | "μm" | "Å" | "mm" | "cm";
type FrequencyUnit = "Hz" | "kHz" | "MHz" | "GHz" | "THz";
type ChangedValue = "wavelength" | "frequency" | "none";

export default function RedshiftCalculatorPage() {
  const [emittedWavelength, setEmittedWavelength] = useState<string>("");
  const [emittedFrequency, setEmittedFrequency] = useState<string>("");
  const [observedWavelength, setObservedWavelength] = useState<string>("");
  const [observedFrequency, setObservedFrequency] = useState<string>("");
  const [changedValueEmitted, setChangedValueEmitted] = useState<ChangedValue>("none");
  const [changedValueObserved, setChangedValueObserved] = useState<ChangedValue>("none");

  const [emittedWavelengthUnit, setEmittedWavelengthUnit] = useState<WavelengthUnit>("nm");
  const [emittedFrequencyUnit, setEmittedFrequencyUnit] = useState<FrequencyUnit>("THz");
  const [observedWavelengthUnit, setObservedWavelengthUnit] = useState<WavelengthUnit>("nm");
  const [observedFrequencyUnit, setObservedFrequencyUnit] = useState<FrequencyUnit>("THz");

  const [error, setError] = useState<string | null>(null);

  const wavelengthToMeters = useCallback((value: number, unit: WavelengthUnit): number => {
    switch (unit) {
      case "m":
        return value;
      case "nm":
        return NmtoM(value);
      case "μm":
        return UmtoM(value);
      case "Å":
        return AngstromtoM(value);
      case "mm":
        return MmtoM(value);
      case "cm":
        return CmtoM(value);
      default:
        return value;
    }
  }, []);

  const frequencyToHz = useCallback((value: number, unit: FrequencyUnit): number => {
    switch (unit) {
      case "Hz":
        return value;
      case "kHz":
        return KHztoHz(value);
      case "MHz":
        return MHztoHz(value);
      case "GHz":
        return GHztoHz(value);
      case "THz":
        return THztoHz(value);
      default:
        return value;
    }
  }, []);

  const metersToWavelength = useCallback((valueM: number, unit: WavelengthUnit): number => {
    switch (unit) {
      case "m":
        return valueM;
      case "nm":
        return MtoNm(valueM);
      case "μm":
        return MtoUm(valueM);
      case "Å":
        return MtoAngstrom(valueM);
      case "mm":
        return MtoMm(valueM);
      case "cm":
        return MtoCm(valueM);
      default:
        return valueM;
    }
  }, []);

  const hzToFrequency = useCallback((valueHz: number, unit: FrequencyUnit): number => {
    switch (unit) {
      case "Hz":
        return valueHz;
      case "kHz":
        return HztoKHz(valueHz);
      case "MHz":
        return HztoMHz(valueHz);
      case "GHz":
        return HztoGHz(valueHz);
      case "THz":
        return HztoTHz(valueHz);
      default:
        return valueHz;
    }
  }, []);

  const redshift = useMemo(() => {
    if (observedWavelength === "" || emittedWavelength === "") {
      setError(null);
      return null;
    }

    const observed = wavelengthToMeters(parseFloat(observedWavelength), observedWavelengthUnit);
    const emitted = wavelengthToMeters(parseFloat(emittedWavelength), emittedWavelengthUnit);

    if (isNaN(observed)) {
      setError("Observed wavelength must be a number");
      return null;
    }
    if (observed <= 0) {
      setError("Observed wavelength must be positive");
      return null;
    }
    if (isNaN(emitted)) {
      setError("Emitted wavelength must be a number");
      return null;
    }
    if (emitted <= 0) {
      setError("Emitted wavelength must be positive");
      return null;
    }

    const z = calculateRedshiftFromWavelength(
      wavelengthToMeters(parseFloat(emittedWavelength), emittedWavelengthUnit),
      wavelengthToMeters(parseFloat(observedWavelength), observedWavelengthUnit),
    );
    if (isNaN(z)) {
      setError("Invalid redshift");
      return null;
    }
    setError(null);
    return z;
  }, [emittedWavelength, emittedWavelengthUnit, observedWavelength, observedWavelengthUnit, wavelengthToMeters]);

  useEffect(() => {
    if (changedValueObserved === "wavelength") {
      setObservedFrequency(
        hzToFrequency(
          wavelengthToFrequency(wavelengthToMeters(parseFloat(observedWavelength), observedWavelengthUnit)),
          observedFrequencyUnit,
        ).toString(),
      );
    }
  }, [
    observedWavelength,
    changedValueObserved,
    observedWavelengthUnit,
    wavelengthToFrequency,
    wavelengthToMeters,
    hzToFrequency,
  ]);

  useEffect(() => {
    if (changedValueObserved === "frequency") {
      setObservedWavelength(
        metersToWavelength(
          frequencyToWavelength(frequencyToHz(parseFloat(observedFrequency), observedFrequencyUnit)),
          observedWavelengthUnit,
        ).toString(),
      );
    }
  }, [
    observedFrequency,
    changedValueObserved,
    observedFrequencyUnit,
    frequencyToWavelength,
    hzToFrequency,
    metersToWavelength,
  ]);

  useEffect(() => {
    if (changedValueEmitted === "wavelength") {
      setEmittedFrequency(
        hzToFrequency(
          wavelengthToFrequency(wavelengthToMeters(parseFloat(emittedWavelength), emittedWavelengthUnit)),
          emittedFrequencyUnit,
        ).toString(),
      );
    }
  }, [
    emittedWavelength,
    changedValueEmitted,
    emittedWavelengthUnit,
    wavelengthToMeters,
    hzToFrequency,
    wavelengthToFrequency,
  ]);

  useEffect(() => {
    if (changedValueEmitted === "frequency") {
      setEmittedWavelength(
        metersToWavelength(
          frequencyToWavelength(frequencyToHz(parseFloat(emittedFrequency), emittedFrequencyUnit)),
          emittedWavelengthUnit,
        ).toString(),
      );
    }
  }, [
    emittedFrequency,
    changedValueEmitted,
    emittedFrequencyUnit,
    frequencyToWavelength,
    hzToFrequency,
    metersToWavelength,
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <ToolTitle toolKey="redshift-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Enter emitted and observed wavelengths or frequencies to calculate the redshift. When you enter a
            wavelength, the corresponding frequency is automatically calculated, and vice versa.
          </p>

          {/* Emitted Wavelength */}
          <div className="mb-6">
            <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <Label htmlFor="emitted-wavelength" className="mb-2">
                  Emitted Wavelength
                </Label>
                <Input
                  type="number"
                  id="emitted-wavelength"
                  value={emittedWavelength}
                  onChange={(e) => {
                    setEmittedWavelength(e.target.value);
                    setChangedValueEmitted("wavelength");
                  }}
                  placeholder="e.g., 656.3"
                  className="block w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="emitted-wavelength-unit" className="mb-2">
                  Unit
                </Label>
                <Select
                  value={emittedWavelengthUnit}
                  onValueChange={(value) => {
                    setEmittedWavelengthUnit(value as WavelengthUnit);
                    setChangedValueEmitted("wavelength");
                  }}
                >
                  <SelectTrigger id="emitted-wavelength-unit" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nm">Nanometers (nm)</SelectItem>
                    <SelectItem value="μm">Micrometers (μm)</SelectItem>
                    <SelectItem value="Å">Angstroms (Å)</SelectItem>
                    <SelectItem value="mm">Millimeters (mm)</SelectItem>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Emitted Frequency */}
          <div className="mb-6">
            <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <Label htmlFor="emitted-frequency" className="mb-2">
                  Emitted Frequency
                </Label>
                <Input
                  type="number"
                  id="emitted-frequency"
                  value={emittedFrequency}
                  onChange={(e) => {
                    setEmittedFrequency(e.target.value);
                    setChangedValueEmitted("frequency");
                  }}
                  placeholder="e.g., 456.8"
                  className="block w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="emitted-frequency-unit" className="mb-2">
                  Unit
                </Label>
                <Select
                  value={emittedFrequencyUnit}
                  onValueChange={(value) => {
                    setEmittedFrequencyUnit(value as FrequencyUnit);
                    setChangedValueEmitted("frequency");
                  }}
                >
                  <SelectTrigger id="emitted-frequency-unit" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THz">Terahertz (THz)</SelectItem>
                    <SelectItem value="GHz">Gigahertz (GHz)</SelectItem>
                    <SelectItem value="MHz">Megahertz (MHz)</SelectItem>
                    <SelectItem value="kHz">Kilohertz (kHz)</SelectItem>
                    <SelectItem value="Hz">Hertz (Hz)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observed Wavelength */}
          <div className="mb-6">
            <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <Label htmlFor="observed-wavelength" className="mb-2">
                  Observed Wavelength
                </Label>
                <Input
                  type="number"
                  id="observed-wavelength"
                  value={observedWavelength}
                  onChange={(e) => {
                    setObservedWavelength(e.target.value);
                    setChangedValueObserved("wavelength");
                  }}
                  placeholder="e.g., 700.0"
                  className="block w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="observed-wavelength-unit" className="mb-2">
                  Unit
                </Label>
                <Select
                  value={observedWavelengthUnit}
                  onValueChange={(value) => {
                    setObservedWavelengthUnit(value as WavelengthUnit);
                    setChangedValueObserved("wavelength");
                  }}
                >
                  <SelectTrigger id="observed-wavelength-unit" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nm">Nanometers (nm)</SelectItem>
                    <SelectItem value="μm">Micrometers (μm)</SelectItem>
                    <SelectItem value="Å">Angstroms (Å)</SelectItem>
                    <SelectItem value="mm">Millimeters (mm)</SelectItem>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observed Frequency */}
          <div className="mb-6">
            <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <Label htmlFor="observed-frequency" className="mb-2">
                  Observed Frequency
                </Label>
                <Input
                  type="number"
                  id="observed-frequency"
                  value={observedFrequency}
                  onChange={(e) => {
                    setObservedFrequency(e.target.value);
                    setChangedValueObserved("frequency");
                  }}
                  placeholder="e.g., 428.3"
                  className="block w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="observed-frequency-unit" className="mb-2">
                  Unit
                </Label>
                <Select
                  value={observedFrequencyUnit}
                  onValueChange={(value) => {
                    setObservedFrequencyUnit(value as FrequencyUnit);
                    setChangedValueObserved("frequency");
                  }}
                >
                  <SelectTrigger id="observed-frequency-unit" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THz">Terahertz (THz)</SelectItem>
                    <SelectItem value="GHz">Gigahertz (GHz)</SelectItem>
                    <SelectItem value="MHz">Megahertz (MHz)</SelectItem>
                    <SelectItem value="kHz">Kilohertz (kHz)</SelectItem>
                    <SelectItem value="Hz">Hertz (Hz)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 mb-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}

          {redshift !== null && (
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Result:</h2>
              <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                <div>
                  <div className="text-foreground font-medium">Redshift (z)</div>
                  <div className="text-muted-foreground text-sm">{redshift}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-border bg-card flex items-center justify-center rounded-lg border p-6 shadow-lg">
          <RedshiftVisualization redshift={redshift} />
        </div>
      </div>

      {/* Theory Section */}
      <Theory toolKey="redshift-calculator" />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
