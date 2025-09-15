"use client";

import { NormalShockResult } from "./logic";
import { FaArrowRight, FaBolt } from "react-icons/fa";

interface ShockDetailsProps {
  results: NormalShockResult | null;
  hoverPosition: "upstream" | "downstream" | "shock" | null;
  className?: string;
}

// Helper to format number with proper precision
const formatNumber = (num: number, decimals: number = 3): string => {
  if (num === 0) return "0";
  if (Math.abs(num) < 0.001) {
    return num.toExponential(decimals);
  }
  return num.toFixed(decimals);
};

export default function ShockDetails({ results, hoverPosition, className = "" }: ShockDetailsProps) {
  if (!results) {
    return (
      <div
        className={`border-border bg-card flex min-h-[180px] items-center justify-center rounded-lg border p-4 ${className}`}
      >
        <p className="text-muted-foreground">Enter a Mach number to see shock details</p>
      </div>
    );
  }

  // Content based on hover position
  const getContent = () => {
    switch (hoverPosition) {
      case "upstream":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FaArrowRight className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="text-foreground font-medium">Upstream Flow Properties (State 1)</h3>
                <p className="text-muted-foreground text-sm">Supersonic flow before the shock wave</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                <div className="text-muted-foreground text-xs font-medium">Mach Number (M₁)</div>
                <div className="text-foreground mt-1 text-lg font-semibold">{formatNumber(results.mach1)}</div>
                <div className="text-muted-foreground mt-1 text-xs">Supersonic flow (M &gt; 1)</div>
              </div>

              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                <div className="text-muted-foreground text-xs font-medium">Flow Velocity</div>
                <div className="text-foreground mt-1 text-lg font-semibold">High</div>
                <div className="text-muted-foreground mt-1 text-xs">Relative to downstream</div>
              </div>

              <div className="col-span-2 rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                <div className="text-muted-foreground mb-1 text-xs font-medium">Relative Properties</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-muted-foreground text-xs">Pressure</div>
                    <div className="text-foreground font-medium">p₁ (reference)</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Temperature</div>
                    <div className="text-foreground font-medium">T₁ (reference)</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Density</div>
                    <div className="text-foreground font-medium">ρ₁ (reference)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "downstream":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <FaArrowRight className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <h3 className="text-foreground font-medium">Downstream Flow Properties (State 2)</h3>
                <p className="text-muted-foreground text-sm">Subsonic flow after the shock wave</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                <div className="text-muted-foreground text-xs font-medium">Mach Number (M₂)</div>
                <div className="text-foreground mt-1 text-lg font-semibold">{formatNumber(results.mach2)}</div>
                <div className="text-muted-foreground mt-1 text-xs">Subsonic flow (M &lt; 1)</div>
              </div>

              <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                <div className="text-muted-foreground text-xs font-medium">Flow Velocity</div>
                <div className="text-foreground mt-1 text-lg font-semibold">Lower</div>
                <div className="text-muted-foreground mt-1 text-xs">Slowed by the shock</div>
              </div>

              <div className="col-span-2 rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                <div className="text-muted-foreground mb-1 text-xs font-medium">Properties Relative to Upstream</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-muted-foreground text-xs">Pressure Ratio</div>
                    <div className="text-foreground font-medium">{formatNumber(results.pressureRatio)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Temperature Ratio</div>
                    <div className="text-foreground font-medium">{formatNumber(results.temperatureRatio)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Density Ratio</div>
                    <div className="text-foreground font-medium">{formatNumber(results.densityRatio)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "shock":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <FaBolt className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-foreground font-medium">Shock Wave Properties</h3>
                <p className="text-muted-foreground text-sm">Key changes across the normal shock</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-red-100 p-2 dark:bg-red-900/30">
                <div className="text-muted-foreground text-xs font-medium">Total Pressure Ratio</div>
                <div className="text-foreground mt-1 text-lg font-semibold">
                  {formatNumber(results.totalPressureRatio, 4)}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Loss: {formatNumber((1 - results.totalPressureRatio) * 100, 2)}%
                </div>
              </div>

              <div className="rounded-md bg-red-100 p-2 dark:bg-red-900/30">
                <div className="text-muted-foreground text-xs font-medium">Entropy Change</div>
                <div className="text-foreground mt-1 text-lg font-semibold">{formatNumber(results.entropy, 4)}</div>
                <div className="text-muted-foreground mt-1 text-xs">Positive (irreversible)</div>
              </div>

              <div className="col-span-2 rounded-md bg-red-100 p-2 dark:bg-red-900/30">
                <div className="text-muted-foreground mb-1 text-xs font-medium">Shock Characteristics</div>
                <div className="mt-1">
                  <ul className="text-foreground ml-4 list-disc space-y-1 text-xs">
                    <li>Supersonic to subsonic transition</li>
                    <li>Pressure, temperature, and density increase</li>
                    <li>Velocity decreases</li>
                    <li>Total pressure decreases (loss)</li>
                    <li>Entropy increases (irreversible)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex h-full flex-col items-center justify-center py-4 text-center">
            <FaBolt className="text-muted-foreground mb-2 h-6 w-6" />
            <p className="text-foreground mb-1 text-sm font-medium">Normal Shock Details</p>
            <p className="text-muted-foreground text-xs">Hover over the visualization to explore shock properties</p>
          </div>
        );
    }
  };

  return <div className={`border-border bg-card min-h-[180px] rounded-lg border p-4 ${className}`}>{getContent()}</div>;
}
