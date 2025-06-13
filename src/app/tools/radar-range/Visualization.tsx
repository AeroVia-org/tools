"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { RadarRangeResult } from "./logic";
import type { InputUnits } from "./page";

interface VisualizationProps {
  results: RadarRangeResult | null;
  width?: number;
  height?: number;
  displayRangeValue: string | undefined;
  displayUnit: InputUnits["range"] | undefined;
}

// Constants for drawing
const RADAR_COLOR = "#3B82F6"; // blue-500
const TARGET_COLOR = "#EF4444"; // red-500
const TEXT_COLOR_LIGHT = "#374151"; // gray-700
const TEXT_COLOR_DARK = "#D1D5DB"; // gray-300
const BACKGROUND_COLOR_LIGHT = "#FFFFFF";
const BACKGROUND_COLOR_DARK = "#1F2937"; // gray-800

export default function RadarRangeVisualization({
  results,
  height = 350,
  displayRangeValue,
  displayUnit,
}: VisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: height }); // Default width, height from prop
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Define updateDimensions with useCallback
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width: containerWidth } = containerRef.current.getBoundingClientRect();
      // Make it square-ish, constrained by height and container width
      const size = Math.min(containerWidth, height);
      setDimensions({ width: containerWidth, height: size }); // Use container width, but height capped
    }
  }, [height]); // Depends on the height prop

  // Handle resize
  useEffect(() => {
    updateDimensions(); // Initial size calculation

    // Use ResizeObserver for more reliable container resize detection
    let resizeObserver: ResizeObserver | null = null;
    const currentContainer = containerRef.current; // Capture ref value

    if (currentContainer) {
      resizeObserver = new ResizeObserver(updateDimensions); // Use the memoized callback
      resizeObserver.observe(currentContainer);
    }

    // Fallback for older browsers
    window.addEventListener("resize", updateDimensions); // Use the memoized callback

    return () => {
      window.removeEventListener("resize", updateDimensions);
      // Use the captured ref value in the cleanup
      if (resizeObserver && currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, [height, updateDimensions]);

  // Drawing function
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height: canvasHeight } = dimensions; // Use state dimensions
      const centerX = width / 2;
      const centerY = canvasHeight / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.85; // Use 85% of the smallest dimension for drawing area

      // Determine colors based on dark mode
      const textColor = isDarkMode ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT;
      const bgColor = isDarkMode ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR_LIGHT;

      // Clear canvas
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, canvasHeight);

      // If no results, just display placeholder text centrally
      if (!results) {
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Center text vertically too
        ctx.font = "14px sans-serif";
        ctx.fillText("Enter parameters above to see visualization", centerX, centerY);
        return; // Stop drawing here
      }

      // --- Draw Radar (only if results exist) ---
      const radarSize = Math.max(16, Math.min(width, canvasHeight) * 0.08);
      // Simple circle representation
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = RADAR_COLOR;
      ctx.fill();
      ctx.strokeStyle = isDarkMode ? "#93C5FD" : "#1E40AF"; // Lighter/darker blue border
      ctx.lineWidth = 2;
      ctx.stroke();
      // Label
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.font = `bold ${Math.max(10, radarSize * 0.2)}px sans-serif`;
      // Increased vertical offset for Radar label further
      ctx.fillText("Radar", centerX, centerY + radarSize * 1.0); // Position the label slightly below the radar icon.

      // Make the calculated Rmax correspond to the full available visual radius.
      // Add a minimum size to prevent the circle from being too small/invisible.
      const minVisualRadius = maxRadius * 0.05; // e.g., 5% of maxRadius as minimum
      const rangeRadiusPx = Math.max(minVisualRadius, maxRadius); // Use maxRadius, but ensure minimum

      // --- Draw Max Range Circle ---
      ctx.beginPath();
      // Draw the circle using the calculated radius
      ctx.arc(centerX, centerY, rangeRadiusPx, 0, Math.PI * 2);
      // Use a different color for the range circle
      const rangeStrokeColor = isDarkMode ? "#3B82F6" : "#60A5FA"; // Different blue for range
      ctx.strokeStyle = rangeStrokeColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]); // Dashed line
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // --- Draw Target ---
      // Place target visually within the range, e.g., at 70% of Rmax distance at an angle
      const targetAngle = -Math.PI / 4; // ~45 degrees top-right
      // Scale target distance based on the now dynamic range radius
      const targetDistPx = rangeRadiusPx * 0.7;
      const targetX = centerX + targetDistPx * Math.cos(targetAngle);
      const targetY = centerY + targetDistPx * Math.sin(targetAngle); // Canvas Y is inverted
      const targetSize = Math.max(15, Math.min(width, canvasHeight) * 0.06);

      // Simple triangle for target
      ctx.beginPath();
      ctx.moveTo(targetX, targetY - targetSize / 2);
      ctx.lineTo(targetX - targetSize / 2, targetY + targetSize / 2);
      ctx.lineTo(targetX + targetSize / 2, targetY + targetSize / 2);
      ctx.closePath();
      ctx.fillStyle = TARGET_COLOR;
      ctx.fill();
      // Label
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.font = `bold ${Math.max(10, targetSize * 0.2)}px sans-serif`;
      // Increased vertical offset for Target label
      ctx.fillText("Target", targetX, targetY + targetSize * 1.1); // Position the label slightly below the target icon.

      // --- Draw Range Label ---
      // Position label near the edge of the range circle
      const labelAngle = -Math.PI / 6; // Angle for label position
      const labelRadius = rangeRadiusPx + 15; // Slightly outside the circle
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      ctx.fillStyle = textColor;
      // Adjust text alignment slightly based on position relative to center
      ctx.textAlign = labelX < centerX + 10 && labelX > centerX - 10 ? "center" : labelX > centerX ? "left" : "right";
      ctx.textBaseline = "middle";
      // Increase font size for Rmax label, make bold
      ctx.font = `bold ${Math.max(11, Math.min(width, canvasHeight) * 0.035)}px sans-serif`; // Set a dynamic, responsive font size for the Rmax label, with a minimum size.
      // Display the actual calculated range value using props
      // Only display if value and unit are provided
      if (displayRangeValue !== undefined && displayUnit !== undefined) {
        ctx.fillText(`Rmax: ${displayRangeValue} ${displayUnit}`, labelX, labelY);
      } else {
        // Optionally draw a placeholder or nothing if no results/unit selected
        ctx.fillText(`Rmax: N/A`, labelX, labelY);
      }

      // Optional: Draw line to label only if range is not tiny
      if (rangeRadiusPx > minVisualRadius * 2) {
        // Only draw line if circle isn't minimal size
        ctx.beginPath();
        ctx.moveTo(centerX + rangeRadiusPx * Math.cos(labelAngle), centerY + rangeRadiusPx * Math.sin(labelAngle));
        // Adjust line endpoint based on text alignment
        let lineEndX = labelX;
        if (ctx.textAlign === "left") lineEndX -= 5;
        if (ctx.textAlign === "right") lineEndX += 5;
        ctx.lineTo(lineEndX, labelY);
        // Use the same color for the line as the range circle
        ctx.strokeStyle = rangeStrokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    [dimensions, results, isDarkMode, displayUnit, displayRangeValue], // Dependencies for redraw
  );

  // Effect to handle drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Optimize for high-res displays
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = dimensions;

    // Set the display size (css pixels)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set the actual size in memory (scaled by dpr)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr, dpr);

    // Draw the visualization
    draw(ctx);
  }, [dimensions, draw, results]); // Redraw when dimensions or results change

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        // Width/height attributes are set dynamically in useEffect for DPR scaling
        className="rounded-lg border border-gray-200 dark:border-gray-700"
      />
      {/* Add Icons using absolute positioning if needed, similar to original, but maybe simpler */}
      {/* Example: Add simple icons if desired
      <div className="absolute bottom-4 left-4 text-center text-xs">
        <FaSatelliteDish className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Radar</p>
      </div>
      <div className="absolute top-10 right-10 text-center text-xs">
          <FaPlane className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Target</p>
      </div>
      */}
    </div>
  );
}
