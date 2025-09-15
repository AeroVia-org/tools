"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { NormalShockResult } from "./logic";

interface ShockVisualizationProps {
  results: NormalShockResult | null;
  width?: number;
  height?: number;
  onHoverPosition?: (position: "upstream" | "downstream" | "shock" | null) => void;
}

// Helper to format number with proper precision
const formatNumber = (num: number, decimals: number = 2): string => {
  if (Math.abs(num) < 0.001) {
    return num.toExponential(decimals);
  }
  return num.toFixed(decimals);
};

export default function ShockVisualization({
  results,
  width = 600,
  height = 300,
  onHoverPosition,
}: ShockVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(width);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const [hoverPosition, setHoverPosition] = useState<"upstream" | "downstream" | "shock" | null>(null);

  // Shock wave width in pixels
  const SHOCK_WIDTH = 30;

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        // Maintain aspect ratio
        const newHeight = Math.min(300, newWidth / 2);
        setCanvasWidth(newWidth);
        setCanvasHeight(newHeight);
      }
    };

    handleResize(); // Initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define arrow properties based on Mach numbers
  const getArrowProperties = useCallback(
    (mach: number) => {
      // Base size scaled by canvas width
      const baseSize = canvasWidth / 30;

      // Different fixed sizes for upstream and downstream
      // For upstream (M1 > 1)
      if (mach > 1) {
        return {
          arrowSize: baseSize,
          spacing: 35,
        };
      }
      // For downstream (M2 < 1) - smaller arrows to represent slower flow
      else {
        return {
          arrowSize: baseSize * 0.6,
          spacing: 35,
        };
      }
    },
    [canvasWidth], // Depends on canvasWidth for scaling
  );

  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    // Scale all drawing operations
    ctx.scale(dpr, dpr);

    // Set the CSS dimensions
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Constants for drawing
    const shockX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const flowHeight = canvasHeight * 0.5;

    // Draw flow boundaries - use a neutral color that works in both themes
    ctx.strokeStyle = "#6b7280"; // Gray that works in both light and dark
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY - flowHeight / 2);
    ctx.lineTo(canvasWidth, centerY - flowHeight / 2);
    ctx.moveTo(0, centerY + flowHeight / 2);
    ctx.lineTo(canvasWidth, centerY + flowHeight / 2);
    ctx.stroke();

    // Draw the shock wave
    ctx.strokeStyle = "#ef4444"; // Red for shock
    ctx.lineWidth = 4; // Make the shock line thicker
    ctx.beginPath();
    ctx.moveTo(shockX, centerY - flowHeight / 2 - 15); // Extended above
    ctx.lineTo(shockX, centerY + flowHeight / 2 + 15); // Extended below
    ctx.stroke();

    // Add shock wave label
    ctx.fillStyle = "#ef4444";
    ctx.font = `bold ${Math.max(12, canvasWidth / 40)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Shock Wave", shockX, centerY - flowHeight / 2 - 25);

    // Draw flow properties if results are available
    if (results) {
      // Draw upstream Mach number and flow direction
      const upstreamProps = getArrowProperties(results.mach1);
      const downstreamProps = getArrowProperties(results.mach2);

      // Calculate flow tube dimensions for arrow placement
      const tubeTop = centerY - flowHeight / 2;
      const tubeBottom = centerY + flowHeight / 2;
      const tubeHeight = tubeBottom - tubeTop;

      // Calculate rows for arrows - aim for 3 rows
      const numRows = 3;
      const rowHeight = tubeHeight / (numRows + 1);

      // Upstream flow arrows (blue)
      ctx.fillStyle = "#3b82f6"; // Blue for upstream
      // Use fixed rows instead of a loop with increments
      for (let rowIndex = 1; rowIndex <= numRows; rowIndex++) {
        // Calculate y position for this row, centering within the tube
        const y = tubeTop + rowHeight * rowIndex;

        // Center the arrows by calculating the range and distributing them evenly
        const upstreamWidth = shockX - SHOCK_WIDTH / 2 - 50;
        // Aim for 4-5 arrows per row
        const numArrows = 4;
        const arrowSpacing = upstreamWidth / (numArrows + 1);

        for (let i = 1; i <= numArrows; i++) {
          const x = 50 + i * arrowSpacing;
          drawArrow(ctx, x, y, upstreamProps.arrowSize, 0, "#3b82f6");
        }
      }

      // Downstream flow arrows (green)
      ctx.fillStyle = "#10b981"; // Green for downstream
      // Use fixed rows instead of a loop with increments
      for (let rowIndex = 1; rowIndex <= numRows; rowIndex++) {
        // Calculate y position for this row, centering within the tube
        const y = tubeTop + rowHeight * rowIndex;

        // Center the arrows by calculating the range and distributing them evenly
        const downstreamWidth = canvasWidth - (shockX + SHOCK_WIDTH / 2) - 50;
        // Aim for 4-5 arrows per row
        const numArrows = 4;
        const arrowSpacing = downstreamWidth / (numArrows + 1);

        for (let i = 1; i <= numArrows; i++) {
          const x = shockX + SHOCK_WIDTH / 2 + i * arrowSpacing;
          drawArrow(ctx, x, y, downstreamProps.arrowSize, 0, "#10b981");
        }
      }

      // Labels for the regions - now moved below the flow tube
      const fontSize = Math.max(12, canvasWidth / 45);
      const valueFontSize = Math.max(16, canvasWidth / 35);
      ctx.textAlign = "center";

      // Upstream label and value (move below the flow tube)
      ctx.fillStyle = "#3b82f6";
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillText("Upstream Flow", shockX / 2, centerY + flowHeight / 2 + 20);

      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.fillText(`M₁ = ${formatNumber(results.mach1)}`, shockX / 2, centerY + flowHeight / 2 + 45);

      // Downstream label and value (move below the flow tube)
      ctx.fillStyle = "#10b981";
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillText("Downstream Flow", shockX + (canvasWidth - shockX) / 2, centerY + flowHeight / 2 + 20);

      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.fillText(
        `M₂ = ${formatNumber(results.mach2)}`,
        shockX + (canvasWidth - shockX) / 2,
        centerY + flowHeight / 2 + 45,
      );
    }

    // Draw hover indicators if needed
    if (hoverPosition) {
      ctx.globalAlpha = 0.2;
      if (hoverPosition === "upstream") {
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(0, 0, shockX - SHOCK_WIDTH / 2, canvasHeight);
      } else if (hoverPosition === "downstream") {
        ctx.fillStyle = "#10b981";
        ctx.fillRect(shockX + SHOCK_WIDTH / 2, 0, canvasWidth - shockX - SHOCK_WIDTH / 2, canvasHeight);
      } else if (hoverPosition === "shock") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(shockX - SHOCK_WIDTH / 2, 0, SHOCK_WIDTH, canvasHeight);
      }
      ctx.globalAlpha = 1.0;
    }
  }, [results, canvasWidth, canvasHeight, hoverPosition, getArrowProperties]);

  // Draw an arrow for flow direction
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    angle: number,
    color: string,
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    // Arrow body
    ctx.moveTo(-size, -size / 3);
    ctx.lineTo(size * 0.7, -size / 3);
    ctx.lineTo(size * 0.7, -size / 1.5);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.7, size / 1.5);
    ctx.lineTo(size * 0.7, size / 3);
    ctx.lineTo(-size, size / 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // Handle mouse events for interactive highlighting
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const midX = canvasWidth / 2;

    let newPosition: "upstream" | "downstream" | "shock" | null = null;

    if (x < midX - SHOCK_WIDTH / 2) {
      newPosition = "upstream";
    } else if (x > midX + SHOCK_WIDTH / 2) {
      newPosition = "downstream";
    } else {
      newPosition = "shock";
    }

    if (newPosition !== hoverPosition) {
      setHoverPosition(newPosition);
      if (onHoverPosition) onHoverPosition(newPosition);
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    if (onHoverPosition) onHoverPosition(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="border-border w-full rounded-lg border"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
