"use client";

// TODO: Add comprehensive math equation explanations in the Theory section
// All mathematical formulas and conversion factors used in this tool must be clearly
// explained with proper derivations so users understand the underlying calculations.

// TODO: Add UTM/MGRS Converter tool
// This current tool should be combined with the UTM/MGRS Converter to create a comprehensive
// coordinate system converter that handles all coordinate transformations in one place.
// This would provide better user experience and reduce maintenance overhead.

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaGlobe, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { Input } from "@packages/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Label } from "@packages/ui/components/ui/label";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";
import Theory from "./theory";
import Visualization from "./visualization";
import {
  feetToMeters,
  formatNumber,
  llaToEcef,
  metersToFeet,
  ecefToLla,
  ECEF,
  LLA,
  metersToNauticalMiles,
  nauticalMilesToMeters,
  metersToKilometers,
  kilometersToMeters,
  degreesToDMS,
  dmsToDegrees,
} from "./logic";

type LlaUnit = "m" | "ft" | "nmi" | "km";
type CoordinateFormat = "decimal" | "dms";

type DMS = {
  degrees: number;
  minutes: number;
  seconds: number;
};

export default function CoordinateSystemConverterPage() {
  const [mode, setMode] = useState<"lla2ecef" | "ecef2lla">("lla2ecef");

  // LLA inputs
  const [coordinateFormat, setCoordinateFormat] = useState<CoordinateFormat>("decimal");
  // Default values
  const [latDeg, setLatDeg] = useState("22.5");
  const [lonDeg, setLonDeg] = useState("47.3");
  const [altInput, setAltInput] = useState("100");
  const [altUnit, setAltUnit] = useState<LlaUnit>("km");

  // DMS inputs
  const [latDMS, setLatDMS] = useState<DMS>({ degrees: 22, minutes: 30, seconds: 0 });
  const [lonDMS, setLonDMS] = useState<DMS>({ degrees: 47, minutes: 18, seconds: 0 });

  // ECEF inputs - calculated from default LLA values (22.5° lat, 47.3° lon, 100 km alt)
  const [x, setX] = useState("4060758.2");
  const [y, setY] = useState("4400601.6");
  const [z, setZ] = useState("2463925.3");

  // Results & errors
  const [error, setError] = useState<string | null>(null);
  const [resultEcef, setResultEcef] = useState<ECEF | null>(null);
  const [resultLla, setResultLla] = useState<LLA | null>(null);

  const altMeters = useMemo(() => {
    const a = parseFloat(altInput || "0");
    switch (altUnit) {
      case "ft":
        return feetToMeters(a);
      case "nmi":
        return nauticalMilesToMeters(a);
      case "km":
        return kilometersToMeters(a);
      default:
        return a;
    }
  }, [altInput, altUnit]);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResultEcef(null);
    setResultLla(null);

    try {
      if (mode === "lla2ecef") {
        let lat: number, lon: number;

        if (coordinateFormat === "decimal") {
          lat = parseFloat(latDeg);
          lon = parseFloat(lonDeg);
        } else {
          lat = dmsToDegrees(latDMS);
          lon = dmsToDegrees(lonDMS);
        }

        if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(altMeters)) {
          throw new Error("Please enter valid numeric values for latitude, longitude, and altitude.");
        }
        if (lat < -90 || lat > 90) throw new Error("Latitude must be between -90 and 90 degrees.");
        if (lon < -180 || lon > 180) throw new Error("Longitude must be between -180 and 180 degrees.");
        const ecef = llaToEcef({ latDeg: lat, lonDeg: lon, alt: altMeters });
        setResultEcef(ecef);
      } else {
        const xi = parseFloat(x);
        const yi = parseFloat(y);
        const zi = parseFloat(z);
        if (!Number.isFinite(xi) || !Number.isFinite(yi) || !Number.isFinite(zi)) {
          throw new Error("Please enter valid numeric values for X, Y, and Z.");
        }
        const lla = ecefToLla({ x: xi, y: yi, z: zi });
        setResultLla(lla);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  }, [mode, coordinateFormat, latDeg, lonDeg, latDMS, lonDMS, altMeters, x, y, z]);

  // Sync decimal and DMS values
  useEffect(() => {
    if (coordinateFormat === "decimal") {
      const lat = parseFloat(latDeg);
      const lon = parseFloat(lonDeg);
      if (Number.isFinite(lat)) {
        setLatDMS(degreesToDMS(lat));
      }
      if (Number.isFinite(lon)) {
        setLonDMS(degreesToDMS(lon));
      }
    }
  }, [latDeg, lonDeg, coordinateFormat]);

  useEffect(() => {
    if (coordinateFormat === "dms") {
      const lat = dmsToDegrees(latDMS);
      const lon = dmsToDegrees(lonDMS);
      setLatDeg(lat.toString());
      setLonDeg(lon.toString());
    }
  }, [latDMS, lonDMS, coordinateFormat]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="mx-auto py-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="coordinate-system-converter" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Enter coordinates to convert between geodetic and ECEF systems. Uses the WGS84 reference ellipsoid.
          </p>

          {/* Mode toggle */}
          <div className="mb-6">
            <Label className="mb-1">Conversion Mode</Label>
            <div className="bg-muted flex space-x-4 rounded-md p-1">
              {(["lla2ecef", "ecef2lla"] as Array<"lla2ecef" | "ecef2lla">).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    mode === m ? "bg-card text-primary shadow" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {m === "lla2ecef" ? "LLA → ECEF" : "ECEF → LLA"}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinate format toggle (only for LLA mode) */}
          {mode === "lla2ecef" && (
            <div className="mb-6">
              <Label className="mb-1">Coordinate Format</Label>
              <div className="bg-muted flex space-x-4 rounded-md p-1">
                {(["decimal", "dms"] as Array<CoordinateFormat>).map((format) => (
                  <button
                    key={format}
                    onClick={() => setCoordinateFormat(format)}
                    className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                      coordinateFormat === format
                        ? "bg-card text-primary shadow"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {format === "decimal" ? "Decimal Degrees" : "DMS"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input fields - only show required fields based on mode */}
          <div className="space-y-6">
            {mode === "lla2ecef" ? (
              /* LLA inputs for LLA → ECEF conversion */
              <div className="space-y-4">
                {coordinateFormat === "decimal" ? (
                  /* Decimal degrees inputs */
                  <>
                    <div>
                      <Label>Latitude (°)</Label>
                      <Input
                        type="number"
                        value={latDeg}
                        onChange={(e) => setLatDeg(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Longitude (°)</Label>
                      <Input
                        type="number"
                        value={lonDeg}
                        onChange={(e) => setLonDeg(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  /* DMS inputs */
                  <>
                    <div>
                      <Label>Latitude (DMS)</Label>
                      <div className="mt-1 grid grid-cols-3 gap-2">
                        <div>
                          <Label>Degrees</Label>
                          <Input
                            type="number"
                            value={latDMS.degrees}
                            onChange={(e) =>
                              setLatDMS((prev) => ({ ...prev, degrees: parseFloat(e.target.value) || 0 }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Minutes</Label>
                          <Input
                            type="number"
                            value={latDMS.minutes}
                            onChange={(e) =>
                              setLatDMS((prev) => ({ ...prev, minutes: parseFloat(e.target.value) || 0 }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Seconds</Label>
                          <Input
                            type="number"
                            value={latDMS.seconds}
                            onChange={(e) =>
                              setLatDMS((prev) => ({ ...prev, seconds: parseFloat(e.target.value) || 0 }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Longitude (DMS)</Label>
                      <div className="mt-1 grid grid-cols-3 gap-2">
                        <div>
                          <Label>Degrees</Label>
                          <Input
                            type="number"
                            value={lonDMS.degrees}
                            onChange={(e) =>
                              setLonDMS((prev) => ({ ...prev, degrees: parseFloat(e.target.value) || 0 }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Minutes</Label>
                          <Input
                            type="number"
                            value={lonDMS.minutes}
                            onChange={(e) =>
                              setLonDMS((prev) => ({ ...prev, minutes: parseFloat(e.target.value) || 0 }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Seconds</Label>
                          <Input
                            type="number"
                            value={lonDMS.seconds}
                            onChange={(e) =>
                              setLonDMS((prev) => ({ ...prev, seconds: parseFloat(e.target.value) || 0 }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <Label>Altitude</Label>
                    <Input
                      type="number"
                      value={altInput}
                      onChange={(e) => setAltInput(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Unit</Label>
                    <Select value={altUnit} onValueChange={(v) => setAltUnit(v as LlaUnit)}>
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m">meters (m)</SelectItem>
                        <SelectItem value="ft">feet (ft)</SelectItem>
                        <SelectItem value="km">kilometers (km)</SelectItem>
                        <SelectItem value="nmi">nautical miles (nmi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              /* ECEF inputs for ECEF → LLA conversion */
              <div className="space-y-4">
                <div>
                  <Label>X</Label>
                  <Input type="number" value={x} onChange={(e) => setX(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Y</Label>
                  <Input type="number" value={y} onChange={(e) => setY(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Z</Label>
                  <Input type="number" value={z} onChange={(e) => setZ(e.target.value)} className="mt-1" />
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 mt-6 rounded-md p-4">
              <p className="text-destructive text-sm font-medium">
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Visualization + Results (merged) */}
        <div className="border-border bg-card overflow-hidden rounded-lg border p-0 shadow-lg">
          <div className="p-0">
            <Visualization
              llaData={
                mode === "lla2ecef"
                  ? coordinateFormat === "decimal"
                    ? { latDeg: parseFloat(latDeg), lonDeg: parseFloat(lonDeg), alt: altMeters }
                    : { latDeg: dmsToDegrees(latDMS), lonDeg: dmsToDegrees(lonDMS), alt: altMeters }
                  : resultLla
              }
              ecefData={mode === "ecef2lla" ? { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) } : resultEcef}
            />
          </div>

          <div className="border-border border-t p-6">
            <h2 className="text-foreground mb-4 text-lg font-semibold">Conversion Results</h2>
            {mode === "lla2ecef" ? (
              resultEcef ? (
                <div className="border-border rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FaGlobe className="h-5 w-5 text-blue-600" />
                      <span className="text-foreground font-medium">X:</span>
                      <span className="text-foreground font-semibold">{formatNumber(resultEcef.x, 8)} m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="h-5 w-5 text-purple-600" />
                      <span className="text-foreground font-medium">Y:</span>
                      <span className="text-foreground font-semibold">{formatNumber(resultEcef.y, 8)} m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="h-5 w-5 text-green-600" />
                      <span className="text-foreground font-medium">Z:</span>
                      <span className="text-foreground font-semibold">{formatNumber(resultEcef.z, 8)} m</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground flex h-24 items-center justify-center">
                  <p>Enter LLA values to see ECEF results</p>
                </div>
              )
            ) : resultLla ? (
              <div className="border-border rounded-lg border p-4">
                <div className="space-y-4">
                  {/* Latitude */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
                      <span className="text-foreground font-medium">Latitude:</span>
                      <span className="text-foreground font-semibold">{formatNumber(resultLla.latDeg, 8)}°</span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      (
                      {(() => {
                        const dms = degreesToDMS(resultLla.latDeg);
                        return `${dms.degrees}° ${dms.minutes}' ${formatNumber(dms.seconds, 2)}"`;
                      })()}
                      )
                    </div>
                  </div>

                  {/* Longitude */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="h-5 w-5 text-purple-600" />
                      <span className="text-foreground font-medium">Longitude:</span>
                      <span className="text-foreground font-semibold">{formatNumber(resultLla.lonDeg, 8)}°</span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      (
                      {(() => {
                        const dms = degreesToDMS(resultLla.lonDeg);
                        return `${dms.degrees}° ${dms.minutes}' ${formatNumber(dms.seconds, 2)}"`;
                      })()}
                      )
                    </div>
                  </div>

                  {/* Altitude */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FaArrowRight className="h-5 w-5 text-green-600" />
                      <span className="text-foreground font-medium">Altitude:</span>
                      <span className="text-foreground font-semibold">{formatNumber(resultLla.alt, 6)} m</span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formatNumber(metersToFeet(resultLla.alt), 6)} ft /{" "}
                      {formatNumber(metersToKilometers(resultLla.alt), 6)} km /{" "}
                      {formatNumber(metersToNauticalMiles(resultLla.alt), 6)} nmi
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-24 items-center justify-center">
                <p>Enter ECEF values to see LLA results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Theory Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
