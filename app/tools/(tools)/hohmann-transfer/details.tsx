"use client";

import { FaSatellite, FaRocket } from "react-icons/fa";

interface HohmannDetailPoint {
  type: "initial" | "transfer" | "final" | "burn1" | "burn2";
  position: "periapsis" | "apoapsis" | "orbit";
  distance: number; // km from center
  velocity: number; // km/s
  angle?: number; // radians
  deltaV?: number; // m/s (for burns)
  burnDescription?: string; // description of the burn
}

interface InteractiveTransferDetailsProps {
  detailPoint: HohmannDetailPoint | null;
  earthRadiusKm?: number;
}

export default function InteractiveTransferDetails({
  detailPoint,
  earthRadiusKm = 6371,
}: InteractiveTransferDetailsProps) {
  if (!detailPoint) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Hover over the orbit visualization to see details</p>
      </div>
    );
  }

  // Calculate altitude from surface
  const altitudeKm = detailPoint.distance - earthRadiusKm;

  // Get color based on orbit type
  const getTypeColor = () => {
    switch (detailPoint.type) {
      case "initial":
        return "text-[#9D6EC1]";
      case "transfer":
        return "text-red-500";
      case "final":
        return "text-green-500";
      case "burn1":
      case "burn2":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  // Get position name
  const getPositionName = () => {
    if (detailPoint.position === "periapsis") return "Periapsis (Closest Point)";
    if (detailPoint.position === "apoapsis") return "Apoapsis (Farthest Point)";
    return "Orbit Point";
  };

  // Format numbers nicely
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Render burn information
  if (detailPoint.type === "burn1" || detailPoint.type === "burn2") {
    return (
      <div className="h-[200px] rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <FaRocket className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-500">
                {detailPoint.type === "burn1" ? "First Burn" : "Second Burn"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{getPositionName()}</p>
            </div>
          </div>

          {/* Burn description badge */}
          <div className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-800 dark:border-yellow-900/30 dark:bg-yellow-900/20 dark:text-yellow-300">
            {detailPoint.burnDescription}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Delta-V Required</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatNumber(detailPoint.deltaV! / 1000, 3)} km/s
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(detailPoint.deltaV!, 1)} m/s</div>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Orbital Velocity</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatNumber(detailPoint.velocity)} km/s
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">After burn</div>
            </div>
          </div>

          <div className="col-span-2 rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Altitude</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatNumber(altitudeKm)} km
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(altitudeKm / 1.60934, 1)} mi</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular orbit point information
  return (
    <div className="h-[200px] rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
      <div className="mb-3 flex items-center">
        <div
          className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
            detailPoint.type === "initial"
              ? "bg-purple-100 dark:bg-purple-900/30"
              : detailPoint.type === "transfer"
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-green-100 dark:bg-green-900/30"
          }`}
        >
          {detailPoint.type === "transfer" ? (
            <FaRocket className={`h-4 w-4 ${getTypeColor()}`} />
          ) : (
            <FaSatellite className={`h-4 w-4 ${getTypeColor()}`} />
          )}
        </div>
        <div>
          <h3 className={`font-medium ${getTypeColor()}`}>
            {detailPoint.type.charAt(0).toUpperCase() + detailPoint.type.slice(1)} Orbit
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{getPositionName()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Distance from Center</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {formatNumber(detailPoint.distance)} km
            </div>
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Altitude</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatNumber(altitudeKm)} km</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(altitudeKm / 1.60934, 1)} mi</div>
          </div>
        </div>

        <div className="col-span-2 rounded-md bg-gray-50 p-2 dark:bg-gray-700/30">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Orbital Velocity</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {formatNumber(detailPoint.velocity)} km/s
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatNumber(detailPoint.velocity * 3600)} km/h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
