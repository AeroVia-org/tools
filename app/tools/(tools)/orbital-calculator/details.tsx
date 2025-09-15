"use client";

import { FaSatellite, FaGlobeAmericas } from "react-icons/fa";
import { OrbitalDetailPoint } from "./visualization";
import { MtoMi, KmtoM } from "@/lib/conversions";

interface OrbitalDetailsProps {
  detailPoint: OrbitalDetailPoint | null;
}

export default function OrbitalDetails({ detailPoint }: OrbitalDetailsProps) {
  if (!detailPoint || !detailPoint.isHovering) {
    return (
      <div className="border-border bg-card flex min-h-[200px] items-center justify-center rounded-lg border p-4">
        <p className="text-muted-foreground text-center">
          Hover over the visualization
          <br />
          to see orbit details.
        </p>
      </div>
    );
  }

  // Format numbers nicely
  const formatNumber = (num: number, decimals = 1) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const altitudeMi = MtoMi(KmtoM(detailPoint.altitudeKm));
  const velocityMiS = MtoMi(detailPoint.velocityKms * 1000) / 1000; // km/s -> m/s -> mi/s

  return (
    <div className="border-border bg-card min-h-[200px] rounded-lg border p-4">
      {detailPoint.type === "orbit" ? (
        // Orbit Details
        <>
          <div className="mb-3 flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#9D6EC1]/20">
              <FaSatellite className="h-4 w-4 text-[#9D6EC1]" />
            </div>
            <h3 className="text-foreground font-medium">Orbit Point Details</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {/* Altitude */}
            <div className="flex justify-between rounded-md bg-[#9D6EC1]/10 p-2">
              <span className="text-muted-foreground">Altitude:</span>
              <span className="text-foreground font-semibold">
                {formatNumber(detailPoint.altitudeKm)} km / {formatNumber(altitudeMi)} mi
              </span>
            </div>
            {/* Velocity */}
            <div className="flex justify-between rounded-md bg-[#9D6EC1]/10 p-2">
              <span className="text-muted-foreground">Velocity:</span>
              <span className="text-foreground font-semibold">
                {formatNumber(detailPoint.velocityKms, 3)} km/s / {formatNumber(velocityMiS, 3)} mi/s
              </span>
            </div>
            {/* Period */}
            <div className="flex justify-between rounded-md bg-[#9D6EC1]/10 p-2">
              <span className="text-muted-foreground">Period:</span>
              <span className="text-foreground font-semibold">{detailPoint.periodFormatted}</span>
            </div>
          </div>
        </>
      ) : (
        // Earth Details
        <>
          <div className="mb-3 flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6]/20">
              <FaGlobeAmericas className="h-4 w-4 text-[#3b82f6]" />
            </div>
            <h3 className="text-foreground font-medium">Earth Details</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between rounded-md bg-[#3b82f6]/10 p-2">
              <span className="text-muted-foreground">Body:</span>
              <span className="text-foreground font-semibold">Earth (Surface)</span>
            </div>
            <div className="flex justify-between rounded-md bg-[#3b82f6]/10 p-2">
              <span className="text-muted-foreground">Avg. Radius:</span>
              <span className="text-foreground font-semibold">
                {formatNumber(detailPoint.distanceKm)} km / {formatNumber(MtoMi(KmtoM(detailPoint.distanceKm)))} mi
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
