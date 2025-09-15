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
      <div className="border-border bg-muted flex h-48 items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">Enter valid mass values to see visualization.</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow">
      <h3 className="text-foreground mb-4 text-center text-lg font-semibold">Mass Breakdown</h3>

      {/* Stacked Bar */}
      <div className="bg-muted relative mb-2 h-8 w-full overflow-hidden rounded">
        {/* Propellant Mass Section */}
        <div
          className="absolute top-0 left-0 flex h-full items-center justify-center bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
          style={{ width: `${propellantPercent}%` }}
        >
          {propellantPercent > 10 && <span className="text-xs font-medium text-white">Propellant</span>}
        </div>
        {/* Structural Mass Section */}
        <div
          className="absolute top-0 right-0 flex h-full items-center justify-center bg-gradient-to-l from-gray-400 to-gray-600 transition-all duration-500 ease-out"
          style={{ width: `${structuralPercent}%` }}
        >
          {structuralPercent > 10 && <span className="text-xs font-medium text-white">Structure</span>}
        </div>
      </div>

      {/* Percentage Labels */}
      <div className="relative mb-4 h-6 w-full">
        {/* Propellant Percentage */}
        <div
          className="text-muted-foreground absolute top-0 text-center text-sm"
          style={{
            left: `${propellantPercent / 2}%`,
            transform: "translateX(-50%)",
            width: "max-content",
          }}
        >
          {formatDisplayNumber(propellantPercent)}%
        </div>
        {/* Structural Percentage */}
        <div
          className="text-muted-foreground absolute top-0 text-center text-sm"
          style={{
            left: `${propellantPercent + structuralPercent / 2}%`,
            transform: "translateX(-50%)",
            width: "max-content",
          }}
        >
          {formatDisplayNumber(structuralPercent)}%
        </div>
      </div>

      {/* Legend and Details */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Propellant Details */}
        <div className="border-border bg-muted flex items-start gap-3 rounded-md border p-3">
          <FaGasPump className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <div className="text-muted-foreground text-sm">Propellant Mass</div>
            <div className="text-foreground text-lg font-semibold">
              {formatDisplayNumber(propellantMass)} {massUnit}
            </div>
          </div>
        </div>

        {/* Structural Details */}
        <div className="border-border bg-muted flex items-start gap-3 rounded-md border p-3">
          <FaBox className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
          <div>
            <div className="text-muted-foreground text-sm">Structural Mass (Dry)</div>
            <div className="text-foreground text-lg font-semibold">
              {formatDisplayNumber(structuralMass)} {massUnit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassFractionVisualization;
