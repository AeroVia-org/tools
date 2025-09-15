"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@packages/ui/components/ui/chart";
import { AircraftWeightResult, WeightUnit, DistanceUnit } from "./logic";

interface WeightBreakdownChartProps {
  result: AircraftWeightResult;
}

const WeightBreakdownChart = ({ result }: WeightBreakdownChartProps) => {
  // Prepare data for pie chart
  const chartData = [
    {
      name: "Empty Weight",
      value: result.emptyWeight,
      fraction: result.emptyWeightFraction,
      fill: "var(--chart-1)",
      description: "Structure, systems, engines",
    },
    {
      name: "Fuel Weight",
      value: result.fuelWeight,
      fraction: result.fuelWeightFraction,
      fill: "var(--chart-2)",
      description: "Mission fuel + reserves",
    },
    {
      name: "Payload Weight",
      value: result.payloadWeight,
      fraction: result.payloadWeightFraction,
      fill: "var(--chart-3)",
      description: "Passengers, cargo, equipment",
    },
    {
      name: "Crew Weight",
      value: result.crewWeight,
      fraction: result.crewWeightFraction,
      fill: "var(--chart-4)",
      description: "Pilots, flight attendants",
    },
  ];

  const chartConfig = {
    value: {
      label: "Weight",
    },
    "Empty Weight": {
      label: "Empty Weight",
      color: "var(--chart-1)",
    },
    "Fuel Weight": {
      label: "Fuel Weight",
      color: "var(--chart-2)",
    },
    "Payload Weight": {
      label: "Payload Weight",
      color: "var(--chart-3)",
    },
    "Crew Weight": {
      label: "Crew Weight",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <div className="mx-auto w-full max-w-md">
      <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full max-w-sm">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={40}
            strokeWidth={2}
            label={({ fraction }) => `${(fraction * 100).toFixed(1)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => {
                  const numValue = typeof value === "number" ? value : 0;
                  const percentage = ((numValue / result.takeoffWeight) * 100).toFixed(1);
                  return [
                    <div key="value" className="flex flex-col gap-1">
                      <span className="font-medium">{name}</span>
                      <span className="text-muted-foreground text-xs">
                        {numValue.toFixed(0)} kg ({percentage}%)
                      </span>
                    </div>,
                  ];
                }}
              />
            }
          />
        </PieChart>
      </ChartContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {chartData.map((segment) => (
          <div key={segment.name} className="flex items-center gap-2 rounded-md p-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.fill }} />
            <div className="flex-1">
              <div className="text-foreground text-sm font-medium">{segment.name}</div>
              <div className="text-muted-foreground text-xs">{segment.value.toFixed(0)} kg</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Range-Payload Diagram Component
interface RangePayloadChartProps {
  result: AircraftWeightResult;
  height?: number;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
}

// Unit helpers
const KG_TO_LB = 2.20462;
const KM_TO_NM = 0.539957;
const KM_TO_MI = 0.621371;

function convertWeightForDisplay(valueKg: number, unit: WeightUnit): number {
  return unit === "lb" ? valueKg * KG_TO_LB : valueKg;
}

function convertDistanceForDisplay(valueKm: number, unit: DistanceUnit): number {
  if (unit === "nm") return valueKm * KM_TO_NM;
  if (unit === "mi") return valueKm * KM_TO_MI;
  return valueKm;
}

const RangePayloadChart = ({ result, height = 300, weightUnit, distanceUnit }: RangePayloadChartProps) => {
  // Generate range-payload curve data points (correct format: X=range, Y=payload)
  const generateRangePayloadCurve = () => {
    const points: Array<{ range: number; payload: number }> = [];

    // Derived weights (kg)
    const operatingEmptyWeight = result.emptyWeight + result.crewWeight; // OEW approximation
    const maxTakeoffWeight = result.takeoffWeight; // Treat current takeoff as MTOW reference

    // Helper: fuel consumption scales ~ linearly with TOW in our simplified model
    const consumptionForTow = (towKg: number) =>
      Math.max(1e-6, result.fuelConsumption * (towKg / Math.max(1e-6, result.takeoffWeight)));

    // Helper: compute range (km) for given fuel and takeoff weight
    const computeRangeKm = (fuelKg: number, towKg: number) => {
      const enduranceHours = fuelKg / consumptionForTow(towKg);
      return enduranceHours * result.cruiseSpeed * 3.6; // km
    };

    // Payload max (use current payload as design payload, bounded by MTOW - OEW)
    const payloadMax = Math.max(0, Math.min(result.payloadWeight, maxTakeoffWeight - operatingEmptyWeight));

    // Point B (at MTOW with payloadMax): fuel at B
    const fuelAtB = Math.max(0, maxTakeoffWeight - operatingEmptyWeight - payloadMax);
    const rangeAtB = computeRangeKm(fuelAtB, maxTakeoffWeight);

    // Full tanks fuel capacity approximation (scale from current mission fuel)
    // Ensure it cannot exceed MTOW - OEW
    let fuelMax = Math.min(maxTakeoffWeight - operatingEmptyWeight, Math.max(fuelAtB, result.fuelWeight * 1.3));

    // Point C: full tanks with positive payload (still at MTOW)
    // payloadAtC_raw could be 0 if fuelMax == (MTOW - OEW). Enforce small positive payload by reducing fuel slightly.
    let payloadAtC = maxTakeoffWeight - operatingEmptyWeight - fuelMax;
    if (payloadAtC <= 0) {
      // Keep at least 2% of payloadMax (or 1 kg) as positive payload
      const minPositivePayload = Math.max(1, payloadMax * 0.02);
      payloadAtC = Math.min(payloadMax, minPositivePayload);
      fuelMax = Math.max(0, maxTakeoffWeight - operatingEmptyWeight - payloadAtC);
    }
    const rangeAtC = computeRangeKm(fuelMax, maxTakeoffWeight); // still at MTOW

    // Point D: zero payload, full tanks (ferry). TOW decreases so consumption drops and range increases.
    const towAtD = operatingEmptyWeight + fuelMax;
    const rangeAtD = computeRangeKm(fuelMax, towAtD);

    // Points:
    // A: zero range, max payload (conceptual start of horizontal line)
    points.push({ range: 0, payload: payloadMax });
    // B: MTOW with payloadMax
    points.push({ range: rangeAtB, payload: payloadMax });
    // C: MTOW with full tanks and positive payload
    points.push({ range: rangeAtC, payload: payloadAtC });
    // D: ferry range with zero payload
    points.push({ range: rangeAtD, payload: 0 });

    return points;
  };

  const curveData = generateRangePayloadCurve().map((p) => ({
    range: convertDistanceForDisplay(p.range, distanceUnit),
    payload: convertWeightForDisplay(p.payload, weightUnit),
  }));

  const currentPoint = {
    range: convertDistanceForDisplay(result.range, distanceUnit),
    payload: convertWeightForDisplay(result.payloadWeight, weightUnit),
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <h3 className="text-foreground mb-2 text-center text-lg font-semibold">Range-Payload Diagram</h3>
      <div className="border-border overflow-hidden rounded-md border">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={curveData} margin={{ top: 24, right: 32, bottom: 40, left: 64 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              type="number"
              domain={[0, "dataMax"]}
              stroke="var(--border)"
              tick={{ fill: "var(--muted-foreground)" }}
              tickMargin={8}
              tickFormatter={(v: number) => {
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                return v.toFixed(0);
              }}
              label={{
                value: `Range (${distanceUnit})`,
                position: "insideBottom",
                dy: 20,
                fill: "var(--muted-foreground)",
              }}
            />
            <YAxis
              type="number"
              domain={[0, "dataMax"]}
              stroke="var(--border)"
              tick={{ fill: "var(--muted-foreground)" }}
              tickMargin={8}
              tickFormatter={(v: number) => {
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                return v.toFixed(0);
              }}
              label={{
                value: `Payload (${weightUnit})`,
                angle: -90,
                position: "insideLeft",
                dx: -36,
                fill: "var(--muted-foreground)",
              }}
            />
            <Line
              type="linear"
              dataKey="payload"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                borderRadius: 6,
              }}
              formatter={(value: number) => [
                `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${weightUnit}`,
                "Payload",
              ]}
              labelFormatter={(label: number) =>
                `Range: ${label.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${distanceUnit}`
              }
            />
            <ReferenceLine x={currentPoint.range} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
            <ReferenceLine y={currentPoint.payload} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
            <ReferenceDot
              x={currentPoint.range}
              y={currentPoint.payload}
              r={6}
              fill="var(--chart-2)"
              stroke="var(--card)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Values */}
      <div className="text-muted-foreground mt-2 text-center text-sm">
        Current: {currentPoint.range.toLocaleString(undefined, { maximumFractionDigits: 0 })} {distanceUnit} range,{" "}
        {currentPoint.payload.toLocaleString(undefined, { maximumFractionDigits: 0 })} {weightUnit} payload
      </div>
    </div>
  );
};

// Main Visualization Component
interface AircraftWeightVisualizationProps {
  result: AircraftWeightResult;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
}

export default function Visualization({ result, weightUnit, distanceUnit }: AircraftWeightVisualizationProps) {
  return (
    <div className="space-y-8">
      <WeightBreakdownChart result={result} />
      <RangePayloadChart result={result} weightUnit={weightUnit} distanceUnit={distanceUnit} />
    </div>
  );
}
