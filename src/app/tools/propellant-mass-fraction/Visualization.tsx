"use client";

import { FaGasPump, FaBox } from "react-icons/fa";

interface MassFractionVisualizationProps {
  initialMass: number; // In the selected unit (kg or lb)
  propellantMass: number; // In the selected unit
  structuralMass: number; // In the selected unit
  propellantMassFraction: number; // 0 to 1
  structuralMassFraction: number; // 0 to 1
  massUnit: "kg" | "lb";
}

// Helper to format numbers for display
const formatDisplayNumber = (num: number, decimals = 1) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const MassFractionVisualization = ({
  initialMass,
  propellantMass,
  structuralMass,
  propellantMassFraction,
  structuralMassFraction,
  massUnit,
}: MassFractionVisualizationProps) => {
  const propellantPercent = propellantMassFraction * 100;
  const structuralPercent = structuralMassFraction * 100;

  // Prevent rendering if data is invalid (e.g., initialMass is 0)
  if (initialMass <= 0 || isNaN(propellantPercent) || isNaN(structuralPercent)) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-gray-500 dark:text-gray-400">Enter valid mass values to see visualization.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">Mass Breakdown</h3>

      {/* Stacked Bar */}
      <div className="relative mb-2 h-8 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-600">
        {/* Propellant Mass Section */}
        <div
          className="absolute top-0 left-0 flex h-full items-center justify-center bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out dark:from-green-500 dark:to-green-700"
          style={{ width: `${propellantPercent}%` }}
        >
          {propellantPercent > 10 && <span className="text-xs font-medium text-white">Propellant</span>}
        </div>
        {/* Structural Mass Section */}
        <div
          className="absolute top-0 right-0 flex h-full items-center justify-center bg-gradient-to-l from-gray-400 to-gray-600 transition-all duration-500 ease-out dark:from-gray-500 dark:to-gray-700"
          style={{ width: `${structuralPercent}%` }}
        >
          {structuralPercent > 10 && <span className="text-xs font-medium text-white">Structure</span>}
        </div>
      </div>

      {/* Legend and Details */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Propellant Details */}
        <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/30">
          <FaGasPump className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-100">Propellant Mass</div>
            <div className="text-sm font-semibold text-green-700 dark:text-green-300">
              {formatDisplayNumber(propellantMass)} {massUnit}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              ({formatDisplayNumber(propellantPercent)}% of total)
            </div>
          </div>
        </div>

        {/* Structural Details */}
        <div className="flex items-start gap-3 rounded-md border border-gray-300 bg-gray-100 p-3 dark:border-gray-600 dark:bg-gray-700/50">
          <FaBox className="mt-0.5 h-5 w-5 shrink-0 text-gray-600 dark:text-gray-400" />
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-100">Structural Mass (Dry)</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {formatDisplayNumber(structuralMass)} {massUnit}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              ({formatDisplayNumber(structuralPercent)}% of total)
            </div>
          </div>
        </div>
      </div>

      {/* Total Mass Display */}
      <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
        <strong>Total Initial Mass:</strong> {formatDisplayNumber(initialMass)} {massUnit}
      </div>
    </div>
  );
};

export default MassFractionVisualization;
