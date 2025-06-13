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
        className={`flex min-h-[180px] items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800 ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Enter a Mach number to see shock details</p>
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
                <h3 className="font-medium text-gray-800 dark:text-white">Upstream Flow Properties (State 1)</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Supersonic flow before the shock wave</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Mach Number (M₁)</div>
                <div className="mt-1 text-lg font-semibold text-blue-700 dark:text-blue-300">
                  {formatNumber(results.mach1)}
                </div>
                <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Supersonic flow (M &gt; 1)</div>
              </div>

              <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Flow Velocity</div>
                <div className="mt-1 text-lg font-semibold text-blue-700 dark:text-blue-300">High</div>
                <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Relative to downstream</div>
              </div>

              <div className="col-span-2 rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Relative Properties</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pressure</div>
                    <div className="font-medium text-blue-700 dark:text-blue-300">p₁ (reference)</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
                    <div className="font-medium text-blue-700 dark:text-blue-300">T₁ (reference)</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Density</div>
                    <div className="font-medium text-blue-700 dark:text-blue-300">ρ₁ (reference)</div>
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
                <h3 className="font-medium text-gray-800 dark:text-white">Downstream Flow Properties (State 2)</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Subsonic flow after the shock wave</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Mach Number (M₂)</div>
                <div className="mt-1 text-lg font-semibold text-green-700 dark:text-green-300">
                  {formatNumber(results.mach2)}
                </div>
                <div className="mt-1 text-xs text-green-600 dark:text-green-400">Subsonic flow (M &lt; 1)</div>
              </div>

              <div className="rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Flow Velocity</div>
                <div className="mt-1 text-lg font-semibold text-green-700 dark:text-green-300">Lower</div>
                <div className="mt-1 text-xs text-green-600 dark:text-green-400">Slowed by the shock</div>
              </div>

              <div className="col-span-2 rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Properties Relative to Upstream
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pressure Ratio</div>
                    <div className="font-medium text-green-700 dark:text-green-300">
                      {formatNumber(results.pressureRatio)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Temperature Ratio</div>
                    <div className="font-medium text-green-700 dark:text-green-300">
                      {formatNumber(results.temperatureRatio)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Density Ratio</div>
                    <div className="font-medium text-green-700 dark:text-green-300">
                      {formatNumber(results.densityRatio)}
                    </div>
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
                <h3 className="font-medium text-gray-800 dark:text-white">Shock Wave Properties</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Key changes across the normal shock</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-red-50 p-2 dark:bg-red-900/20">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pressure Ratio</div>
                <div className="mt-1 text-lg font-semibold text-red-700 dark:text-red-300">
                  {formatNumber(results.totalPressureRatio, 4)}
                </div>
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Loss: {formatNumber((1 - results.totalPressureRatio) * 100, 2)}%
                </div>
              </div>

              <div className="rounded-md bg-red-50 p-2 dark:bg-red-900/20">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Entropy Change</div>
                <div className="mt-1 text-lg font-semibold text-red-700 dark:text-red-300">
                  {formatNumber(results.entropy, 4)}
                </div>
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">Positive (irreversible)</div>
              </div>

              <div className="col-span-2 rounded-md bg-red-50 p-2 dark:bg-red-900/20">
                <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Shock Characteristics</div>
                <div className="mt-1">
                  <ul className="ml-4 list-disc space-y-1 text-xs text-red-700 dark:text-red-300">
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
            <FaBolt className="mb-2 h-6 w-6 text-gray-300 dark:text-gray-600" />
            <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Normal Shock Details</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Hover over the visualization to explore shock properties
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-[180px] rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {getContent()}
    </div>
  );
}
