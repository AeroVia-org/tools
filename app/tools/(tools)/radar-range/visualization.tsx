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

export default function RadarRangeVisualization({
  results,
  height = 350,
  displayRangeValue,
  displayUnit,
}: VisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: height });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: containerWidth } = containerRef.current.getBoundingClientRect();
        const size = Math.min(containerWidth, height);
        setDimensions({ width: containerWidth, height: size });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  // Drawing function
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height: canvasHeight } = dimensions;
      const centerX = width / 2;
      const centerY = canvasHeight / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.85;

      // Clear canvas - background adapts to theme naturally
      ctx.clearRect(0, 0, width, canvasHeight);

      // If no results, just display placeholder text centrally
      if (!results) {
        ctx.fillStyle = "#6b7280"; // text-muted-foreground equivalent
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "14px sans-serif";
        ctx.fillText("Enter parameters above to see visualization", centerX, centerY);
        return;
      }

      // --- Draw Radar ---
      const radarSize = Math.max(16, Math.min(width, canvasHeight) * 0.08);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#3B82F6"; // blue-500
      ctx.fill();
      ctx.strokeStyle = "#1E40AF"; // blue-700
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = "#3b82f6"; // primary color
      ctx.textAlign = "center";
      ctx.font = `bold ${Math.max(10, radarSize * 0.2)}px sans-serif`;
      ctx.fillText("Radar", centerX, centerY + radarSize * 1.0);

      // --- Draw Max Range Circle ---
      const minVisualRadius = maxRadius * 0.05;
      const rangeRadiusPx = Math.max(minVisualRadius, maxRadius);

      ctx.beginPath();
      ctx.arc(centerX, centerY, rangeRadiusPx, 0, Math.PI * 2);
      ctx.strokeStyle = "#60A5FA"; // blue-400
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Draw Target ---
      const targetAngle = -Math.PI / 4;
      const targetDistPx = rangeRadiusPx * 0.7;
      const targetX = centerX + targetDistPx * Math.cos(targetAngle);
      const targetY = centerY + targetDistPx * Math.sin(targetAngle);
      const targetSize = Math.max(15, Math.min(width, canvasHeight) * 0.06);

      ctx.beginPath();
      ctx.moveTo(targetX, targetY - targetSize / 2);
      ctx.lineTo(targetX - targetSize / 2, targetY + targetSize / 2);
      ctx.lineTo(targetX + targetSize / 2, targetY + targetSize / 2);
      ctx.closePath();
      ctx.fillStyle = "#EF4444"; // red-500
      ctx.fill();

      // Label
      ctx.fillStyle = "#ef4444"; // destructive color
      ctx.textAlign = "center";
      ctx.font = `bold ${Math.max(10, targetSize * 0.2)}px sans-serif`;
      ctx.fillText("Target", targetX, targetY + targetSize * 1.1);

      // --- Draw Range Label ---
      const labelAngle = -Math.PI / 6;
      const labelRadius = rangeRadiusPx + 15;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      ctx.fillStyle = "#3b82f6"; // primary color (same as radar)
      ctx.textAlign = labelX < centerX + 10 && labelX > centerX - 10 ? "center" : labelX > centerX ? "left" : "right";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${Math.max(11, Math.min(width, canvasHeight) * 0.035)}px sans-serif`;

      if (displayRangeValue !== undefined && displayUnit !== undefined) {
        ctx.fillText(`Rmax: ${displayRangeValue} ${displayUnit}`, labelX, labelY);
      } else {
        ctx.fillText(`Rmax: N/A`, labelX, labelY);
      }

      // Draw line to label
      if (rangeRadiusPx > minVisualRadius * 2) {
        ctx.beginPath();
        ctx.moveTo(centerX + rangeRadiusPx * Math.cos(labelAngle), centerY + rangeRadiusPx * Math.sin(labelAngle));
        let lineEndX = labelX;
        if (ctx.textAlign === "left") lineEndX -= 5;
        if (ctx.textAlign === "right") lineEndX += 5;
        ctx.lineTo(lineEndX, labelY);
        ctx.strokeStyle = "#60A5FA"; // blue-400
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    [dimensions, results, displayUnit, displayRangeValue],
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

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    draw(ctx);
  }, [dimensions, draw, results]);

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="border-border rounded-lg border" />
    </div>
  );
}
