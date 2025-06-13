"use client";

interface VisualizationProps {
  upstreamMach: number;
  deflectionAngle: number; // degrees
  waveAngle: number; // degrees
}

const DEG_TO_RAD = Math.PI / 180;

export default function ObliqueShockVisualization({ upstreamMach, deflectionAngle, waveAngle }: VisualizationProps) {
  // Define a viewBox for SVG scaling
  const viewBoxWidth = 400;
  const viewBoxHeight = 250;

  if (isNaN(deflectionAngle) || isNaN(waveAngle) || isNaN(upstreamMach)) {
    return (
      <div
        style={{ width: "100%", height: "250px" }} // Default height if no data
        className="flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700"
      >
        <p className="text-gray-500 dark:text-gray-400">Invalid input for visualization.</p>
      </div>
    );
  }

  const thetaRad = deflectionAngle * DEG_TO_RAD;
  const betaRad = waveAngle * DEG_TO_RAD;

  // Ensure angles are within a reasonable range for drawing, e.g. beta > theta
  // This basic check prevents weird drawings if inputs are somehow extreme before logic.ts catches them
  if (betaRad <= thetaRad && thetaRad > 0.001) {
    // only if theta is non-zero
    // Beta should typically be greater than theta for physical solutions
    // You might want to display a specific message or a simplified diagram here
  }

  const originX = viewBoxWidth * 0.2;
  const originY = viewBoxHeight * 0.65;
  let lineLength = viewBoxWidth * 0.65;

  // Adjust lineLength if wave angle is very shallow to prevent text overlap
  if (betaRad < 25 * DEG_TO_RAD) lineLength = viewBoxWidth * 0.5;

  // Wedge points
  const wedgeTipX = originX;
  const wedgeTipY = originY;
  // Horizontal bottom surface of the wedge
  const wedgeBottomEndX = originX + lineLength;
  const wedgeBottomEndY = originY;
  // Inclined top surface of the wedge
  const wedgeTopEndX = originX + lineLength * Math.cos(thetaRad);
  const wedgeTopEndY = originY - lineLength * Math.sin(thetaRad);

  // Shock wave points
  const shockStartX = originX;
  const shockStartY = originY;
  // Extend shock line further for better visual
  const shockLineExtensionFactor = 1.3;
  const shockEndX = originX + lineLength * shockLineExtensionFactor * Math.cos(betaRad);
  const shockEndY = originY - lineLength * shockLineExtensionFactor * Math.sin(betaRad);

  // Streamlines
  const streamlineYOffset = viewBoxHeight * 0.18;
  const streamlineStartX = viewBoxWidth * 0.02;

  const incomingStreamline = {
    x1: streamlineStartX,
    y1: originY - streamlineYOffset,
    x2: wedgeTipX,
    y2: originY - streamlineYOffset,
  };
  const deflectedStreamline = {
    x1: wedgeTipX,
    y1: originY - streamlineYOffset,
    x2: wedgeTipX + lineLength * Math.cos(thetaRad),
    y2: originY - streamlineYOffset - lineLength * Math.sin(thetaRad),
  };

  // Colors
  const flowColor = "#3b82f6"; // blue-500
  const wedgeColor = "#4b5563"; // gray-600 dark:gray-500
  const shockColor = "#ef4444"; // red-500
  const angleArcColor = "currentColor"; // Use text color for arcs
  const labelColor = "fill-gray-700 dark:fill-gray-300";
  const importantLabelColor = "fill-red-600 dark:fill-red-400 font-medium";

  // Arc radii
  const thetaArcRadius = Math.min(lineLength * 0.25, 30);
  const betaArcRadius = Math.min(lineLength * 0.35, 50);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      className="max-h-[300px] min-h-[200px] rounded-md border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/30"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={flowColor} />
        </marker>
      </defs>

      {/* Wedge */}
      {/* Bottom surface of the wedge */}
      <line
        x1={wedgeTipX}
        y1={wedgeTipY}
        x2={wedgeBottomEndX}
        y2={wedgeBottomEndY}
        stroke={wedgeColor}
        strokeWidth="2.5"
      />
      {/* Top surface of the wedge */}
      <line x1={wedgeTipX} y1={wedgeTipY} x2={wedgeTopEndX} y2={wedgeTopEndY} stroke={wedgeColor} strokeWidth="2.5" />

      {/* Shock Wave */}
      <line
        x1={shockStartX}
        y1={shockStartY}
        x2={shockEndX}
        y2={shockEndY}
        stroke={shockColor}
        strokeWidth="2.5"
        strokeDasharray="5 3"
      />

      {/* Incoming Streamline */}
      <line
        x1={incomingStreamline.x1}
        y1={incomingStreamline.y1}
        x2={incomingStreamline.x2}
        y2={incomingStreamline.y2}
        stroke={flowColor}
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />

      {/* Deflected Streamline */}
      <line
        x1={deflectedStreamline.x1}
        y1={deflectedStreamline.y1}
        x2={deflectedStreamline.x2}
        y2={deflectedStreamline.y2}
        stroke={flowColor}
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />

      {/* Deflection Angle Arc (θ) */}
      {thetaRad > 0.01 && (
        <path
          d={`M ${wedgeTipX + thetaArcRadius} ${wedgeTipY} A ${thetaArcRadius} ${thetaArcRadius} 0 0 0 ${wedgeTipX + thetaArcRadius * Math.cos(thetaRad)} ${wedgeTipY - thetaArcRadius * Math.sin(thetaRad)}`}
          fill="none"
          stroke={angleArcColor}
          strokeWidth="1"
          className="opacity-70"
        />
      )}

      {/* Wave Angle Arc (β) */}
      {betaRad > 0.01 && (
        <path
          d={`M ${wedgeTipX + betaArcRadius} ${wedgeTipY} A ${betaArcRadius} ${betaArcRadius} 0 0 0 ${wedgeTipX + betaArcRadius * Math.cos(betaRad)} ${wedgeTipY - betaArcRadius * Math.sin(betaRad)}`}
          fill="none"
          stroke={angleArcColor}
          strokeWidth="1"
          className="opacity-70"
        />
      )}

      {/* Labels */}
      {/* M₁ Label */}
      <text
        x={incomingStreamline.x1 + (incomingStreamline.x2 - incomingStreamline.x1) * 0.5}
        y={incomingStreamline.y1 - 8}
        fontSize="12"
        textAnchor="middle"
        className={labelColor}
      >
        M₁ = {upstreamMach.toFixed(2)}
      </text>

      {/* M₂ Label */}
      <text
        x={deflectedStreamline.x2 - 20} // Position towards the end of the deflected streamline
        y={deflectedStreamline.y2 - 8}
        fontSize="12"
        textAnchor="end"
        className={labelColor}
      >
        M₂
      </text>

      {/* θ Label */}
      {thetaRad > 0.01 && (
        <text
          x={wedgeTipX + (thetaArcRadius + 10) * Math.cos(thetaRad / 2)}
          y={wedgeTipY - (thetaArcRadius + 10) * Math.sin(thetaRad / 2)}
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="central"
          className={labelColor}
        >
          θ={deflectionAngle.toFixed(1)}°
        </text>
      )}

      {/* β Label */}
      {betaRad > 0.01 && (
        <text
          x={wedgeTipX + (betaArcRadius + 12) * Math.cos(betaRad / 2)}
          y={wedgeTipY - (betaArcRadius + 12) * Math.sin(betaRad / 2) + (betaRad < thetaRad + 0.1 ? 12 : 0)} // Adjust if beta is close to theta to avoid overlap
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="central"
          className={importantLabelColor}
        >
          β={waveAngle.toFixed(1)}°
        </text>
      )}

      {/* Wedge Surface labels (optional, can be cluttered) */}
      {/* 
      <text x={wedgeBottomEndX - 30} y={wedgeBottomEndY + 15} fontSize="10" className={labelColor}>Wedge</text>
       */}
    </svg>
  );
}
