"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { calculateHohmannTransfer, HohmannResult } from "./logic";

interface InteractiveTransferProps {
  initialAltitudeKm?: number;
  finalAltitudeKm?: number;
  width?: number;
  height?: number;
  onHoverPoint?: (data: HohmannDetailPoint | null) => void;
}

interface OrbitPoint {
  x: number;
  y: number;
  angle: number; // radians
  distance: number; // km
}

interface HohmannDetailPoint {
  type: "initial" | "transfer" | "final" | "burn1" | "burn2";
  position: "periapsis" | "apoapsis" | "orbit";
  distance: number; // km from center
  velocity: number; // km/s
  angle?: number; // radians
  deltaV?: number; // m/s (for burns)
  burnDescription?: string; // description of the burn
}

// Earth radius in km for scale
const EARTH_RADIUS_KM = 6371;
// Detection radius in pixels for interactive elements
const DETECTION_RADIUS_PX = 25;

const InteractiveTransfer = ({
  initialAltitudeKm = 400,
  finalAltitudeKm = 35786,
  width = 500,
  height = 500,
  onHoverPoint,
}: InteractiveTransferProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [results, setResults] = useState<HohmannResult | null>(null);
  const [dragAngle, setDragAngle] = useState<number | null>(null);
  const [activeOrbit, setActiveOrbit] = useState<"initial" | "transfer" | "final" | null>(null);

  // Calculate Hohmann transfer details
  useEffect(() => {
    try {
      const calculatedResults = calculateHohmannTransfer(initialAltitudeKm, finalAltitudeKm);
      setResults(calculatedResults);
    } catch (err) {
      console.error("Error calculating Hohmann transfer:", err);
      setResults(null);
    }
  }, [initialAltitudeKm, finalAltitudeKm]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: containerWidth } = containerRef.current.getBoundingClientRect();
        const newSize = Math.min(containerWidth, height);
        setDimensions({ width: newSize, height: newSize });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  // Convert actual distance to canvas coordinates
  const scaleDistance = useCallback(
    (distance: number, maxDistance: number): number => {
      // Use 85% of the canvas radius for the maximum orbit
      const canvasRadius = (Math.min(dimensions.width, dimensions.height) / 2) * 0.85;
      return (distance / maxDistance) * canvasRadius;
    },
    [dimensions],
  );

  // Convert polar coordinates to Cartesian
  const polarToCartesian = useCallback(
    (distance: number, angle: number): { x: number; y: number } => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      return {
        x: centerX + distance * Math.cos(angle),
        y: centerY - distance * Math.sin(angle), // Invert y for canvas coordinates
      };
    },
    [dimensions],
  );

  // Generate points for orbits
  const generateOrbitPoints = useCallback(
    (radiusKm: number, maxRadiusKm: number): OrbitPoint[] => {
      const points: OrbitPoint[] = [];
      const steps = 100;
      const scaledRadius = scaleDistance(radiusKm, maxRadiusKm);

      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const { x, y } = polarToCartesian(scaledRadius, angle);
        points.push({ x, y, angle, distance: radiusKm });
      }
      return points;
    },
    [scaleDistance, polarToCartesian],
  );

  // Generate points for elliptical transfer orbit
  const generateTransferPoints = useCallback(
    (initialRadiusKm: number, finalRadiusKm: number, maxRadiusKm: number): OrbitPoint[] => {
      const points: OrbitPoint[] = [];
      const steps = 100;

      // Semi-major axis of the transfer orbit in km
      const semiMajor = (initialRadiusKm + finalRadiusKm) / 2;
      const c = semiMajor - Math.min(initialRadiusKm, finalRadiusKm);
      const e = c / semiMajor; // eccentricity

      // Transfer is half an ellipse
      for (let i = 0; i <= steps; i++) {
        // From 0 to PI (half an orbit)
        const angle = (i / steps) * Math.PI;

        // Polar equation of an ellipse (r = a(1-e²)/(1+e*cos(θ)))
        const distance = (semiMajor * (1 - e * e)) / (1 + e * Math.cos(angle));

        const scaledDistance = scaleDistance(distance, maxRadiusKm);
        // For transfer orbit, we use different angle orientation depending on whether we're going up or down
        const displayAngle = initialRadiusKm < finalRadiusKm ? angle : angle + Math.PI;
        const { x, y } = polarToCartesian(scaledDistance, displayAngle);

        points.push({ x, y, angle: displayAngle, distance });
      }
      return points;
    },
    [scaleDistance, polarToCartesian],
  );

  // Render the orbits
  useEffect(() => {
    if (!canvasRef.current || !results) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Determine the maximum radius for scaling
    const maxRadiusKm = Math.max(results.initialRadiusM / 1000, results.finalRadiusM / 1000);

    // Draw Earth
    const earthRadiusScaled = scaleDistance(EARTH_RADIUS_KM, maxRadiusKm);
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadiusScaled, 0, Math.PI * 2);
    const earthGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, earthRadiusScaled);
    earthGradient.addColorStop(0, "#2E86C1");
    earthGradient.addColorStop(1, "#1A5276");
    ctx.fillStyle = earthGradient;
    ctx.fill();

    // Draw grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const gridRadius = earthRadiusScaled + (maxRadiusKm - EARTH_RADIUS_KM) * (i / 4);
      ctx.beginPath();
      ctx.arc(centerX, centerY, scaleDistance(gridRadius, maxRadiusKm), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Generate orbit points
    const initialOrbitPoints = generateOrbitPoints(results.initialRadiusM / 1000, maxRadiusKm);
    const finalOrbitPoints = generateOrbitPoints(results.finalRadiusM / 1000, maxRadiusKm);
    const transferOrbitPoints = generateTransferPoints(
      results.initialRadiusM / 1000,
      results.finalRadiusM / 1000,
      maxRadiusKm,
    );

    // Draw initial orbit
    ctx.beginPath();
    ctx.strokeStyle = "#9D6EC1";
    ctx.lineWidth = 2;
    initialOrbitPoints.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Draw final orbit
    ctx.beginPath();
    ctx.strokeStyle = "#2ECC71";
    ctx.lineWidth = 2;
    finalOrbitPoints.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Draw transfer orbit
    ctx.beginPath();
    ctx.strokeStyle = "#E74C3C";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    transferOrbitPoints.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw burn points
    // First burn (at initial orbit periapsis)
    const burn1Angle = 0; // Start of transfer
    const burn1Point = polarToCartesian(scaleDistance(results.initialRadiusM / 1000, maxRadiusKm), burn1Angle);

    // Second burn (at final orbit apoapsis)
    const burn2Angle = Math.PI; // End of transfer
    const burn2Point = polarToCartesian(scaleDistance(results.finalRadiusM / 1000, maxRadiusKm), burn2Angle);

    // Draw lines connecting the orbits
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(burn1Point.x, burn1Point.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(burn2Point.x, burn2Point.y);
    ctx.stroke();

    // Enhanced burn points with better visibility
    // First burn
    // Draw glow effect
    const burnGlowRadius = 12;
    const gradient1 = ctx.createRadialGradient(
      burn1Point.x,
      burn1Point.y,
      0,
      burn1Point.x,
      burn1Point.y,
      burnGlowRadius,
    );
    gradient1.addColorStop(0, "rgba(255, 196, 0, 0.8)");
    gradient1.addColorStop(0.7, "rgba(255, 196, 0, 0.3)");
    gradient1.addColorStop(1, "rgba(255, 196, 0, 0)");

    ctx.beginPath();
    ctx.fillStyle = gradient1;
    ctx.arc(burn1Point.x, burn1Point.y, burnGlowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw burn point
    ctx.beginPath();
    ctx.fillStyle = "#FFCC00";
    ctx.arc(burn1Point.x, burn1Point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Add a "1" label to indicate first burn
    ctx.font = "bold 10px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("1", burn1Point.x, burn1Point.y);

    // Second burn
    // Draw glow effect
    const gradient2 = ctx.createRadialGradient(
      burn2Point.x,
      burn2Point.y,
      0,
      burn2Point.x,
      burn2Point.y,
      burnGlowRadius,
    );
    gradient2.addColorStop(0, "rgba(255, 196, 0, 0.8)");
    gradient2.addColorStop(0.7, "rgba(255, 196, 0, 0.3)");
    gradient2.addColorStop(1, "rgba(255, 196, 0, 0)");

    ctx.beginPath();
    ctx.fillStyle = gradient2;
    ctx.arc(burn2Point.x, burn2Point.y, burnGlowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw burn point
    ctx.beginPath();
    ctx.fillStyle = "#FFCC00";
    ctx.arc(burn2Point.x, burn2Point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Add a "2" label to indicate second burn
    ctx.font = "bold 10px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("2", burn2Point.x, burn2Point.y);

    // Draw current position if applicable
    if (dragAngle !== null && activeOrbit !== null) {
      const initialRadius = results.initialRadiusM / 1000;
      const finalRadius = results.finalRadiusM / 1000;

      // Determine which orbit we're showing
      let currentRadius: number;
      const normalizedAngle = ((dragAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const orbitType = activeOrbit;
      let position: "periapsis" | "apoapsis" | "orbit" = "orbit";
      let velocity: number;
      const mu = 3.986e14; // Earth's standard gravitational parameter (m^3/s^2)

      if (activeOrbit === "initial") {
        currentRadius = initialRadius;
        // Initial circular orbit
        if (normalizedAngle === 0) position = "periapsis";
        else if (Math.abs(normalizedAngle - Math.PI) < 0.01) position = "apoapsis";
        velocity = Math.sqrt(mu / (initialRadius * 1000)) / 1000; // km/s
      } else if (activeOrbit === "final") {
        currentRadius = finalRadius;
        // Final circular orbit
        if (normalizedAngle === 0) position = "periapsis";
        else if (Math.abs(normalizedAngle - Math.PI) < 0.01) position = "apoapsis";
        velocity = Math.sqrt(mu / (finalRadius * 1000)) / 1000; // km/s
      } else {
        // Transfer orbit
        // Calculate position on transfer orbit

        // First determine if the angle is valid for the transfer orbit
        // For going up, we use angles 0-180 degrees (0-π radians)
        // For going down, we use angles 180-360 degrees (π-2π radians)
        let angleInTransfer = normalizedAngle;

        if (initialRadius < finalRadius) {
          // Going up - use top half of ellipse
          angleInTransfer = normalizedAngle;
        } else {
          // Going down - use bottom half of ellipse
          // Convert to 0-π range for calculations
          angleInTransfer = normalizedAngle - Math.PI;
        }

        const semiMajor = (initialRadius + finalRadius) / 2;
        const e = 1 - Math.min(initialRadius, finalRadius) / semiMajor;

        // For the radius calculation, we always use angle in 0-π range
        currentRadius = (semiMajor * (1 - e * e)) / (1 + e * Math.cos(angleInTransfer));

        // Calculate position
        if (Math.abs(angleInTransfer) < 0.01 || Math.abs(angleInTransfer - 2 * Math.PI) < 0.01) {
          position = initialRadius < finalRadius ? "periapsis" : "apoapsis";
        } else if (Math.abs(angleInTransfer - Math.PI) < 0.01) {
          position = initialRadius < finalRadius ? "apoapsis" : "periapsis";
        }

        // Calculate velocity on transfer orbit
        velocity = Math.sqrt(mu * (2 / (currentRadius * 1000) - 1 / (semiMajor * 1000))) / 1000;
      }

      // Draw the position - use display angle for correct positioning
      let displayNormalizedAngle = normalizedAngle;

      // For transfer orbit, match the angle used for drawing the orbit
      if (orbitType === "transfer") {
        displayNormalizedAngle = initialRadius < finalRadius ? normalizedAngle : normalizedAngle; // No adjustment needed here because we've already handled the angle conversion
      }

      const pos = polarToCartesian(scaleDistance(currentRadius, maxRadiusKm), displayNormalizedAngle);

      ctx.beginPath();
      ctx.fillStyle = "#F1C40F";
      ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update hover data
      const newPoint: HohmannDetailPoint = {
        type: orbitType,
        position,
        distance: currentRadius,
        velocity,
        angle: normalizedAngle,
      };

      if (onHoverPoint) onHoverPoint(newPoint);
    }
  }, [
    dimensions,
    results,
    dragAngle,
    activeOrbit,
    initialAltitudeKm,
    finalAltitudeKm,
    onHoverPoint,
    generateOrbitPoints,
    generateTransferPoints,
    polarToCartesian,
    scaleDistance,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !results) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate angle from center of canvas
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Calculate normalized angle (0-2π)
    const angle = Math.atan2(-(y - centerY), x - centerX);
    const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Determine the maximum radius for scaling
    const initialRadius = results.initialRadiusM / 1000;
    const finalRadius = results.finalRadiusM / 1000;
    const maxRadiusKm = Math.max(initialRadius, finalRadius);

    // First burn point (at periapsis of initial orbit)
    const burn1Angle = 0;
    const burn1Point = polarToCartesian(scaleDistance(initialRadius, maxRadiusKm), burn1Angle);

    // Second burn point (at apoapsis of transfer orbit)
    const burn2Angle = Math.PI;
    const burn2Point = polarToCartesian(scaleDistance(finalRadius, maxRadiusKm), burn2Angle);

    // Check distances to burn points
    const burnDetectionRadius = DETECTION_RADIUS_PX; // pixels
    const distanceToBurn1 = Math.sqrt(Math.pow(x - burn1Point.x, 2) + Math.pow(y - burn1Point.y, 2));
    const distanceToBurn2 = Math.sqrt(Math.pow(x - burn2Point.x, 2) + Math.pow(y - burn2Point.y, 2));

    // Check if hovering over burn points
    if (distanceToBurn1 <= burnDetectionRadius) {
      // Hovering over the first burn point
      const mu = 3.986e14; // Earth's standard gravitational parameter (m^3/s^2)
      // Calculate transfer orbit velocity at periapsis (km/s)
      const semiMajor = (initialRadius + finalRadius) / 2;
      const vTransfer1 = Math.sqrt(mu * (2 / (initialRadius * 1000) - 1 / (semiMajor * 1000))) / 1000;

      const newPoint: HohmannDetailPoint = {
        type: "burn1",
        position: initialRadius < finalRadius ? "periapsis" : "apoapsis",
        distance: initialRadius,
        velocity: vTransfer1, // Velocity after the burn
        angle: burn1Angle,
        deltaV: results.deltaV1Ms,
        burnDescription:
          initialRadius < finalRadius
            ? "Increase velocity to enter transfer orbit"
            : "Decrease velocity to enter transfer orbit",
      };

      if (onHoverPoint) onHoverPoint(newPoint);
      setDragAngle(null); // Don't show the drag point
      setActiveOrbit(null);
      return;
    }

    if (distanceToBurn2 <= burnDetectionRadius) {
      // Hovering over the second burn point
      const mu = 3.986e14; // Earth's standard gravitational parameter (m^3/s^2)
      const v2 = Math.sqrt(mu / (finalRadius * 1000)) / 1000; // Final orbit velocity (km/s)

      const newPoint: HohmannDetailPoint = {
        type: "burn2",
        position: initialRadius < finalRadius ? "apoapsis" : "periapsis",
        distance: finalRadius,
        velocity: v2, // Velocity after the burn
        angle: burn2Angle,
        deltaV: results.deltaV2Ms,
        burnDescription:
          initialRadius < finalRadius
            ? "Decrease velocity to circularize orbit"
            : "Increase velocity to circularize orbit",
      };

      if (onHoverPoint) onHoverPoint(newPoint);
      setDragAngle(null); // Don't show the drag point
      setActiveOrbit(null);
      return;
    }

    // If not hovering over a burn point, determine which orbit is closest
    // Distance from cursor to center of canvas
    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    // Scaled distances for each orbit
    const initialOrbitRadius = scaleDistance(initialRadius, maxRadiusKm);
    const finalOrbitRadius = scaleDistance(finalRadius, maxRadiusKm);

    // For transfer orbit, calculate the distance based on the angle
    const semiMajor = (initialRadius + finalRadius) / 2;
    const eccentricity = 1 - Math.min(initialRadius, finalRadius) / semiMajor;

    // Use different angle calculation for the elliptical transfer orbit depending on direction
    let transferAngle: number;

    if (initialRadius < finalRadius) {
      // Going up - only consider angles in the top half (0 to π)
      if (normalizedAngle <= Math.PI) {
        transferAngle = normalizedAngle;
      } else {
        // Outside the valid range - use the closest valid point
        transferAngle = Math.PI; // Default to apoapsis
      }
    } else {
      // Going down - only consider angles in the bottom half (π to 2π)
      if (normalizedAngle >= Math.PI && normalizedAngle <= 2 * Math.PI) {
        // We map π-2π to 0-π for orbit calculations
        transferAngle = normalizedAngle - Math.PI;
      } else {
        // Outside the valid range - use the closest valid point
        transferAngle = 0; // Default to periapsis
      }
    }

    // Calculate transfer orbit radius at the given angle
    const transferOrbitEquation = (angleRad: number) => {
      // Make sure we're using the same angle calculation as in generateTransferPoints
      return (semiMajor * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angleRad));
    };

    // Use the adjusted angle that matches our drawing logic
    const effectiveTransferAngle = transferAngle;
    const transferRadius = transferOrbitEquation(effectiveTransferAngle);
    const transferOrbitRadius = scaleDistance(transferRadius, maxRadiusKm);

    // For transfer orbit, use the calculated point - match the display angle calculation from generateTransferPoints
    const displayAngle = initialRadius < finalRadius ? effectiveTransferAngle : effectiveTransferAngle + Math.PI;
    const transferPoint = polarToCartesian(transferOrbitRadius, displayAngle);

    // Calculate distances to each orbit
    const distanceToInitialOrbit = Math.abs(distanceFromCenter - initialOrbitRadius);
    const distanceToFinalOrbit = Math.abs(distanceFromCenter - finalOrbitRadius);

    // For transfer orbit, use the calculated point
    const distanceToTransferOrbit = Math.sqrt(Math.pow(x - transferPoint.x, 2) + Math.pow(y - transferPoint.y, 2));

    // Threshold for considering a point close to an orbit
    const orbitDetectionThreshold = DETECTION_RADIUS_PX; // pixels

    // Find the closest orbit
    const orbitDistances = [
      { type: "initial", distance: distanceToInitialOrbit },
      { type: "final", distance: distanceToFinalOrbit },
      { type: "transfer", distance: distanceToTransferOrbit },
    ];

    // Sort by distance
    orbitDistances.sort((a, b) => a.distance - b.distance);

    // Check if we're close enough to any orbit
    if (orbitDistances[0].distance <= orbitDetectionThreshold) {
      // For transfer orbit, only activate if it's a valid point on the ellipse
      if (orbitDistances[0].type === "transfer") {
        // Only highlight the transfer orbit if the mouse is over a valid part
        // For going up, that's the top half, for going down, that's the bottom half
        const isValidTransferPoint =
          (initialRadius < finalRadius && normalizedAngle <= Math.PI) ||
          (initialRadius >= finalRadius && normalizedAngle >= Math.PI);

        if (isValidTransferPoint) {
          setDragAngle(normalizedAngle);
          setActiveOrbit("transfer");
        } else {
          // Not a valid point on transfer orbit
          setDragAngle(null);
          setActiveOrbit(null);
          if (onHoverPoint) onHoverPoint(null);
        }
      } else {
        // For initial or final orbits, always activate
        setDragAngle(normalizedAngle);
        setActiveOrbit(orbitDistances[0].type as "initial" | "final");
      }
    } else {
      // If not close to any orbit, clear the indicators
      setDragAngle(null);
      setActiveOrbit(null);
      if (onHoverPoint) onHoverPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setDragAngle(null);
    setActiveOrbit(null);
    if (onHoverPoint) onHoverPoint(null);
  };

  return (
    <div ref={containerRef} className="relative w-full flex-1">
      <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
        Interactive Hohmann Transfer
      </h3>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="mx-auto rounded-lg border border-gray-300 dark:border-gray-600"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: "crosshair" }}
      />
      <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#9D6EC1]"></div>
          <span>Initial Orbit</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#E74C3C]"></div>
          <span>Transfer Orbit</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#2ECC71]"></div>
          <span>Final Orbit</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#FFCC00]"></div>
          <span>Burn Points</span>
        </div>
      </div>
      <div className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
        Move your cursor to explore all orbits. Hover near any orbit to see details.
      </div>
    </div>
  );
};

export default InteractiveTransfer;
