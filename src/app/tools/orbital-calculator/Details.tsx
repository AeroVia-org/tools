"use client";

import { FaSatellite, FaGlobeAmericas } from "react-icons/fa";
import { OrbitalDetailPoint } from "./Visualization";
import { MtoMi, KmtoM } from "@/utils/conversions";

interface OrbitalDetailsProps {
  detailPoint: OrbitalDetailPoint | null;
}

export default function OrbitalDetails({ detailPoint }: OrbitalDetailsProps) {
  if (!detailPoint || !detailPoint.isHovering) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">
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
    <div className="min-h-[200px] rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
      {detailPoint.type === "orbit" ? (
        // Orbit Details
        <>
          <div className="mb-3 flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <FaSatellite className="h-4 w-4 text-[#9D6EC1]" />
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Orbit Point Details</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {/* Altitude */}
            <div className="flex justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
              <span className="text-gray-600 dark:text-gray-400">Altitude:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {formatNumber(detailPoint.altitudeKm)} km / {formatNumber(altitudeMi)} mi
              </span>
            </div>
            {/* Velocity */}
            <div className="flex justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
              <span className="text-gray-600 dark:text-gray-400">Velocity:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {formatNumber(detailPoint.velocityKms, 3)} km/s / {formatNumber(velocityMiS, 3)} mi/s
              </span>
            </div>
            {/* Period */}
            <div className="flex justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
              <span className="text-gray-600 dark:text-gray-400">Period:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{detailPoint.periodFormatted}</span>
            </div>
          </div>
        </>
      ) : (
        // Earth Details
        <>
          <div className="mb-3 flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FaGlobeAmericas className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Earth Details</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
              <span className="text-gray-600 dark:text-gray-400">Body:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Earth (Surface)</span>
            </div>
            <div className="flex justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
              <span className="text-gray-600 dark:text-gray-400">Avg. Radius:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {formatNumber(detailPoint.distanceKm)} km / {formatNumber(MtoMi(KmtoM(detailPoint.distanceKm)))} mi
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
