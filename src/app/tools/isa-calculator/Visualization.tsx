"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { calculateIsaFromAltitude, IsaResult, ISA_LAYERS } from "./logic";
import { KtoC, MtoFt, PatoHpa } from "@/utils/conversions";

interface InteractiveAtmosphereProps {
  maxAltitude?: number; // Max altitude to display (meters), e.g., 100000 for 100km
  height?: number; // Height of the component in pixels
}

const InteractiveAtmosphere = ({
  maxAltitude = 100000, // Default max altitude 100km
  height = 500, // Default height 500px
}: InteractiveAtmosphereProps) => {
  const [hoverData, setHoverData] = useState<IsaResult | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  // Temperature range for the X-axis (Celsius)
  const minTempC = -100;
  const maxTempC = 20;

  // Update container dimensions when mounted or resized
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  // Generate atmospheric layer boundaries for display
  const layerBoundaries = useMemo(() => {
    return ISA_LAYERS.map((layer, index) => {
      // Skip the first layer (starts at 0) and layers above our max altitude
      if (index === 0 || layer.baseAltitude >= maxAltitude) return null;

      // Calculate the percentage position for this boundary
      const positionPercent = (layer.baseAltitude / maxAltitude) * 100;

      return {
        name: layer.name,
        altitude: layer.baseAltitude,
        position: 100 - positionPercent, // Invert because 0% is top in CSS
      };
    }).filter(Boolean);
  }, [maxAltitude]);

  // Calculate temperature profile points
  const temperatureProfilePoints = useMemo(() => {
    if (dimensions.width === 0) return "";

    const points: string[] = [];
    const steps = 200; // Increase resolution for higher altitude range

    for (let i = 0; i <= steps; i++) {
      const altitude = (i / steps) * maxAltitude;

      // Skip points above 86km as they're outside the ISA model
      if (altitude > 86000) continue;

      try {
        const isaData = calculateIsaFromAltitude(altitude);
        const tempC = KtoC(isaData.temperature);

        // Map temperature to x position (left to right = cold to warm)
        const x = ((tempC - minTempC) / (maxTempC - minTempC)) * dimensions.width;

        // Map altitude to y position (bottom to top = low to high altitude)
        const y = dimensions.height - (altitude / maxAltitude) * dimensions.height;

        points.push(`${x},${y}`);
      } catch {
        // Skip this point silently
      }
    }

    return points.join(" ");
  }, [dimensions, maxAltitude, minTempC, maxTempC]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const relativeY = event.clientY - rect.top;

      // Ensure y is within bounds
      const clampedY = Math.max(0, Math.min(relativeY, dimensions.height));

      // Calculate altitude (bottom = 0, top = maxAltitude)
      const altitude = maxAltitude * (1 - clampedY / dimensions.height);

      try {
        // Only try to calculate ISA data up to 86km (ISA model limitation)
        if (altitude <= 86000) {
          const isaData = calculateIsaFromAltitude(altitude);
          setHoverData(isaData);
        } else {
          // For altitudes above 86km, create a stub result with only altitude
          setHoverData({
            altitude: altitude,
            temperature: 0,
            pressure: 0,
            density: 0,
            layer: "Above ISA Model",
          });
        }
        setMouseY(clampedY);
      } catch {
        setHoverData(null);
      }
    },
    [dimensions.height, maxAltitude],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverData(null);
    setMouseY(null);
  }, []);

  // Create background gradient based on all atmospheric layers
  const backgroundGradient = useMemo(() => {
    const gradientStops = ISA_LAYERS.map((layer, index) => {
      // Calculate percentage positions
      const basePercent = (layer.baseAltitude / maxAltitude) * 100;
      const topPercent = index < ISA_LAYERS.length - 1 ? (ISA_LAYERS[index + 1].baseAltitude / maxAltitude) * 100 : 100;

      // Color gradient from light blue (troposphere/bottom) to dark blue/black (top)
      // Higher baseAltitude = higher in atmosphere = darker blue-to-black
      const normalizedAltitude = layer.baseAltitude / maxAltitude; // 0 to 1
      const hue = 220 + normalizedAltitude * 20; // 220 to 240 (firmly in blue spectrum)
      const saturation = 85 - normalizedAltitude * 15; // 85% to 70%
      const lightness = 75 - normalizedAltitude * 65; // 75% to 10% (near black at top)

      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      return `${color} ${basePercent}%, ${color} ${topPercent}%`;
    }).join(", ");

    return `linear-gradient(to top, ${gradientStops})`;
  }, [maxAltitude]);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
        Interactive Standard Atmosphere
      </h3>
      <div
        ref={containerRef}
        className="relative cursor-crosshair overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
        style={{ height: `${height}px`, background: backgroundGradient }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Altitude Markers */}
        <div className="absolute top-0 left-1 text-xs font-semibold text-white/90">100 km</div>
        <div className="absolute bottom-0 left-1 text-xs font-semibold text-white/90">0 km</div>

        {/* Atmospheric Layer Boundaries */}
        {layerBoundaries.map(
          (boundary, index) =>
            boundary && (
              <div
                key={index}
                className="absolute right-0 left-0 z-10 border-t border-dashed border-white/70"
                style={{ top: `${boundary.position}%` }}
              >
                <span className="absolute right-1 -mt-2 text-xs font-medium text-white/90">
                  {boundary.name.includes("Troposphere")
                    ? "Tropopause"
                    : boundary.name.includes("Stratosphere")
                      ? "Stratopause"
                      : boundary.name.includes("Mesosphere")
                        ? "Mesopause"
                        : boundary.name}
                  <span className="ml-1 opacity-75">({(boundary.altitude / 1000).toFixed(0)} km)</span>
                </span>
              </div>
            ),
        )}

        {/* Layer Labels */}
        {ISA_LAYERS.map((layer, index) => {
          // Skip layers completely outside our display range
          if (layer.baseAltitude >= maxAltitude) return null;

          // Calculate the center position of this layer
          const topAltitude =
            index < ISA_LAYERS.length - 1 ? Math.min(ISA_LAYERS[index + 1].baseAltitude, maxAltitude) : maxAltitude;

          const centerAltitude = (layer.baseAltitude + topAltitude) / 2;
          const positionPercent = 100 - (centerAltitude / maxAltitude) * 100;

          // Display layer names with proper formatting
          const displayName = layer.name;

          return (
            <div
              key={`label-${index}`}
              className="absolute right-6 z-10 text-xs font-semibold text-white"
              style={{
                top: `${positionPercent}%`,
                transform: "translateY(-50%)",
              }}
            >
              {displayName}
            </div>
          );
        })}

        {/* Temperature Profile Line */}
        {dimensions.width > 0 && temperatureProfilePoints && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <polyline points={temperatureProfilePoints} fill="none" stroke="rgba(255, 220, 0, 0.9)" strokeWidth="2" />
          </svg>
        )}

        {/* Hover Cursor Line */}
        {mouseY !== null && (
          <div
            className="pointer-events-none absolute right-0 left-0 z-20 h-px bg-red-500"
            style={{ top: `${mouseY}px` }}
          />
        )}

        {/* Data Tooltip */}
        {hoverData && mouseY !== null && (
          <div
            className="absolute right-0 z-50 mr-2 -translate-y-1/2 transform rounded-md border border-gray-300 bg-white p-2 text-xs whitespace-nowrap shadow-lg dark:border-gray-600 dark:bg-gray-800"
            style={{ top: `${mouseY}px` }}
          >
            <p className="mb-1 border-b pb-1 font-medium">{hoverData.layer}</p>
            <p>
              <strong>Alt:</strong> {hoverData.altitude.toFixed(0)} m / {MtoFt(hoverData.altitude).toFixed(0)} ft
            </p>
            {hoverData.altitude <= 86000 ? (
              <>
                <p>
                  <strong>Temp:</strong> {KtoC(hoverData.temperature).toFixed(1)} °C
                </p>
                <p>
                  <strong>Press:</strong> {PatoHpa(hoverData.pressure).toFixed(2)} hPa
                </p>
                <p>
                  <strong>Density:</strong> {hoverData.density.toFixed(6)} kg/m³
                </p>
              </>
            ) : (
              <p className="italic">ISA data not available above 86km</p>
            )}
          </div>
        )}
      </div>

      {/* Temperature Scale */}
      <div className="relative mt-1 flex h-6 w-full justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>{minTempC}°C</span>
        <span className="font-medium">Temperature Profile</span>
        <span>{maxTempC}°C</span>
      </div>

      <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
        Hover over the chart to see ISA values at different altitudes.
      </p>
    </div>
  );
};

export default InteractiveAtmosphere;
