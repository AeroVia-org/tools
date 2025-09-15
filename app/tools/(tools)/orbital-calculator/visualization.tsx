"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { OrbitalResult } from "./logic";

// Constants
const EARTH_RADIUS_KM = 6371;
const DETECTION_RADIUS_PX = 50; // Radius for hover detection

export interface OrbitalDetailPoint {
  type: "orbit" | "earth";
  altitudeKm: number;
  velocityKms: number;
  periodFormatted: string;
  distanceKm: number; // From center
  isHovering: boolean;
}

interface OrbitalVisualizationProps {
  orbitalResult: OrbitalResult | null;
  width?: number;
  height?: number;
  onHoverPoint: (data: OrbitalDetailPoint | null) => void;
}

const OrbitalVisualization = ({
  orbitalResult,
  width = 500,
  height = 500,
  onHoverPoint,
}: OrbitalVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [hoverAngle, setHoverAngle] = useState<number | null>(null);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: containerWidth } = containerRef.current.getBoundingClientRect();
        // Make height potentially smaller than width if container is wide
        const newWidth = Math.min(containerWidth, width);
        const newHeight = Math.min(newWidth, height); // Keep aspect ratio square or fit height
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [width, height]);

  // Convert actual distance to canvas coordinates
  const scaleDistance = useCallback(
    (distanceKm: number, maxDistanceKm: number): number => {
      // Use 85% of the canvas radius for the maximum orbit visualization extent
      const canvasRadius = (Math.min(dimensions.width, dimensions.height) / 2) * 0.85;
      // Ensure scaling is relative to the visible area (max orbit or at least slightly larger than Earth)
      const effectiveMaxDistance = Math.max(maxDistanceKm, EARTH_RADIUS_KM * 1.2);
      return (distanceKm / effectiveMaxDistance) * canvasRadius;
    },
    [dimensions],
  );

  // Convert polar coordinates to Cartesian
  const polarToCartesian = useCallback(
    (scaledRadius: number, angle: number): { x: number; y: number } => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      return {
        x: centerX + scaledRadius * Math.cos(angle),
        y: centerY - scaledRadius * Math.sin(angle), // Invert y for canvas coordinates
      };
    },
    [dimensions],
  );

  // Draw function
  useEffect(() => {
    if (!canvasRef.current || !orbitalResult) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const orbitalRadiusKm = orbitalResult.orbitalRadiusM / 1000;
    const maxDisplayRadiusKm = orbitalRadiusKm; // Max distance is the orbit itself

    // --- Draw Earth ---
    const earthRadiusScaled = scaleDistance(EARTH_RADIUS_KM, maxDisplayRadiusKm);
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadiusScaled, 0, Math.PI * 2);
    const earthGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      earthRadiusScaled * 0.5, // Inner radius for gradient start
      centerX,
      centerY,
      earthRadiusScaled, // Outer radius for gradient end
    );
    earthGradient.addColorStop(0, "#3b82f6"); // Lighter blue center
    earthGradient.addColorStop(1, "#1e40af"); // Darker blue edge
    ctx.fillStyle = earthGradient;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowColor = "transparent"; // Reset shadow
    ctx.shadowBlur = 0;

    // --- Draw Orbit Path ---
    const orbitRadiusScaled = scaleDistance(orbitalRadiusKm, maxDisplayRadiusKm);
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadiusScaled, 0, Math.PI * 2);
    ctx.strokeStyle = "#9D6EC1"; // Purple color for orbit
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]); // Dashed line for orbit
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // --- Draw Hover Point on Orbit ---
    if (hoverAngle !== null) {
      const hoverPos = polarToCartesian(orbitRadiusScaled, hoverAngle);
      // Draw a subtle indicator
      ctx.beginPath();
      ctx.arc(hoverPos.x, hoverPos.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hoverPos.x, hoverPos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#9D6EC1"; // Match orbit color
      ctx.fill();

      // Draw line from center to hover point
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(hoverPos.x, hoverPos.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [dimensions, orbitalResult, hoverAngle, scaleDistance, polarToCartesian]);

  // Handle Mouse Move for Hover Effects
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !orbitalResult) {
      onHoverPoint(null);
      setHoverAngle(null);
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distanceFromCenterPx = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(-dy, dx); // Angle calculation (y inverted for canvas)

    const orbitalRadiusKm = orbitalResult.orbitalRadiusM / 1000;
    const maxDisplayRadiusKm = orbitalRadiusKm;
    const orbitRadiusScaled = scaleDistance(orbitalRadiusKm, maxDisplayRadiusKm);
    const earthRadiusScaled = scaleDistance(EARTH_RADIUS_KM, maxDisplayRadiusKm);

    // Check if hovering near the orbit path
    if (Math.abs(distanceFromCenterPx - orbitRadiusScaled) < DETECTION_RADIUS_PX) {
      setHoverAngle(angle);
      const velocityKms = orbitalResult.velocityMs / 1000;
      const periodSeconds = orbitalResult.periodS;

      // Formatting Period (simplified version from page.tsx)
      const formatPeriod = (seconds: number): string => {
        if (isNaN(seconds) || seconds < 0) return "N/A";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.round(seconds % 60);
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      };

      onHoverPoint({
        type: "orbit",
        altitudeKm: orbitalResult.altitudeKm,
        velocityKms: velocityKms,
        periodFormatted: formatPeriod(periodSeconds),
        distanceKm: orbitalRadiusKm,
        isHovering: true,
      });
    } else if (distanceFromCenterPx < earthRadiusScaled) {
      // Hovering over Earth
      setHoverAngle(null);
      onHoverPoint({
        type: "earth",
        altitudeKm: 0, // Surface level
        velocityKms: 0,
        periodFormatted: "N/A",
        distanceKm: EARTH_RADIUS_KM,
        isHovering: true,
      });
    } else {
      // Not hovering over anything specific
      setHoverAngle(null);
      onHoverPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverAngle(null);
    onHoverPoint(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <h3 className="text-foreground mb-2 text-center text-lg font-semibold">Orbit Visualization</h3>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border-border mx-auto block rounded-lg border" // Background adapts to theme
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: "crosshair" }}
      />
      <div className="text-muted-foreground mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#9D6EC1]"></div>
          <span>Calculated Orbit</span>
        </div>
      </div>
      <div className="text-muted-foreground mt-1 text-center text-xs">Hover over the orbit or Earth for details.</div>
    </div>
  );
};

export default OrbitalVisualization;
