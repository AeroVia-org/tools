"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, GizmoHelper, GizmoViewport, Line, Text } from "@react-three/drei";
import type { ECEF, LLA } from "./logic";
import { llaToEcef } from "./logic";

type Mode = "lla2ecef" | "ecef2lla";

interface VisualizationProps {
  mode?: Mode;
  llaData: LLA | null | undefined;
  ecefData: ECEF | null | undefined;
}

const EARTH_RADIUS_M = 6378137.0;
const WORLD_SCALE = 1 / EARTH_RADIUS_M; // Normalize Earth to radius ~1

function Axes() {
  const length = 1.6;
  return (
    <group>
      {/* X-axis: ECEF Y (points toward 90°E on equator). Screen horizontal for longitude. */}
      <Line
        points={[
          [-length, 0, 0],
          [length, 0, 0],
        ]}
        color="#ff3653"
      />
      {/* Y-axis: North (ECEF Z) */}
      <Line
        points={[
          [0, -length, 0],
          [0, length, 0],
        ]}
        color="#0adb50"
      />
      {/* Z-axis: ECEF X (points toward 0° lon on equator) */}
      <Line
        points={[
          [0, 0, -length],
          [0, 0, length],
        ]}
        color="#2c8fdf"
      />
      {/* Axis labels */}
      <Text position={[length + 0.1, 0, 0]} fontSize={0.08} color="#ff3653" anchorX="left" anchorY="middle">
        X (90°E)
      </Text>
      <Text position={[0, length + 0.1, 0]} fontSize={0.08} color="#0adb50" anchorX="center" anchorY="bottom">
        Y (North)
      </Text>
      <Text position={[0, 0, length + 0.1]} fontSize={0.08} color="#2c8fdf" anchorX="center" anchorY="middle">
        Z (0° lon)
      </Text>
    </group>
  );
}

function Earth() {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#2E86C1" roughness={0.6} metalness={0.0} />
    </mesh>
  );
}

function PointMarker({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<{ scale: { setScalar: (scale: number) => void } } | null>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing animation
      const scale = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 3);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position} castShadow>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF4500" emissiveIntensity={0.3} />
      </mesh>
      <Line points={[[0, 0, 0], position]} color="#FF4500" lineWidth={3} />
    </group>
  );
}

export default function Visualization({ llaData, ecefData }: Omit<VisualizationProps, "mode">) {
  const controlsRef = useRef<CameraControls | null>(null);

  const worldPoint = useMemo<[number, number, number]>(() => {
    let ecef: ECEF | null = null;
    if (ecefData && Number.isFinite(ecefData.x) && Number.isFinite(ecefData.y) && Number.isFinite(ecefData.z)) {
      ecef = ecefData;
    } else if (
      llaData &&
      Number.isFinite(llaData.latDeg) &&
      Number.isFinite(llaData.lonDeg) &&
      Number.isFinite(llaData.alt)
    ) {
      ecef = llaToEcef(llaData);
    }
    if (!ecef) return [0, 0, 0];
    // Map ECEF to Three.js coordinate system:
    // - Longitude (increasing East) should move horizontally → map ECEF Y to Three.js X
    // - Latitude (increasing North) should move vertically → map ECEF Z to Three.js Y
    // - Remaining axis → map ECEF X to Three.js Z
    return [ecef.y * WORLD_SCALE, ecef.z * WORLD_SCALE, ecef.x * WORLD_SCALE];
  }, [llaData, ecefData]);

  const surfacePoint = useMemo<[number, number, number]>(() => {
    const len = Math.hypot(worldPoint[0], worldPoint[1], worldPoint[2]);
    if (len < 1e-9) return [0, 0, 0];
    return [worldPoint[0] / len, worldPoint[1] / len, worldPoint[2] / len];
  }, [worldPoint]);

  const equatorPoints = useMemo(() => {
    // Equator: ECEF Z = 0 → world Y = 0, circle in XZ plane
    const pts: Array<[number, number, number]> = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(t), 0, Math.sin(t)]);
    }
    return pts;
  }, []);

  const primeMeridianPoints = useMemo(() => {
    // Prime meridian: ECEF Y = 0 → world X = 0, circle in YZ plane
    const pts: Array<[number, number, number]> = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push([0, Math.cos(t), Math.sin(t)]);
    }
    return pts;
  }, []);

  const ninetyMeridianPoints = useMemo(() => {
    // 90°E meridian: ECEF X = 0 → world Z = 0, circle in XY plane
    const pts: Array<[number, number, number]> = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(t), Math.sin(t), 0]);
    }
    return pts;
  }, []);

  const lat30Points = useMemo(() => {
    // Latitude +30°: horizontal circle offset along Y (north)
    const lat = (30 * Math.PI) / 180;
    const r = Math.cos(lat);
    const y = Math.sin(lat);
    const pts: Array<[number, number, number]> = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push([r * Math.cos(t), y, r * Math.sin(t)]);
    }
    return pts;
  }, []);

  const latMinus30Points = useMemo(() => {
    // Latitude -30°: horizontal circle offset along Y (south)
    const lat = (-30 * Math.PI) / 180;
    const r = Math.cos(lat);
    const y = Math.sin(lat);
    const pts: Array<[number, number, number]> = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push([r * Math.cos(t), y, r * Math.sin(t)]);
    }
    return pts;
  }, []);

  // Label positions on rings (slightly offset to reduce overlap)
  const labelPositions = useMemo(() => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const a = toRad(30);
    const labelScale = 1.06;
    // Equator (XZ plane) - position at 45° longitude
    const equator: [number, number, number] = [Math.cos(toRad(45)) * 1.15, 0, Math.sin(toRad(45)) * 1.15];
    // Prime meridian (YZ plane) - position 15° from equator
    const prime: [number, number, number] = [0, Math.cos(toRad(75)) * labelScale, Math.sin(toRad(75)) * labelScale];
    // 90°E meridian (XY plane)
    const ninetyE: [number, number, number] = [Math.cos(-a) * labelScale, Math.sin(-a) * labelScale, 0];
    // Latitude +30° and -30° (horizontal circles offset on Y)
    const r30 = Math.cos(a);
    const y30 = Math.sin(a);
    const latScale = 1.04; // push slightly outward from circle radius
    const latPosPlus: [number, number, number] = [r30 * latScale, y30, 0];
    const latPosMinus: [number, number, number] = [r30 * latScale, -y30, 0];
    return { equator, prime, ninetyE, latPosPlus, latPosMinus };
  }, []);

  return (
    <div className="relative h-[420px] w-full">
      <Canvas camera={{ position: [2.5, 2.0, 2.5], fov: 50, near: 0.01, far: 100 }} shadows>
        <Suspense fallback={null}>
          {/* Lights */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={2.2} castShadow />
          <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#404040" />

          {/* Scene */}
          <group rotation={[0, 0, 0]}>
            <Earth />
            <Axes />
            {/* Reference rings */}
            <Line points={equatorPoints} color="#ffffff" transparent opacity={0.35} />
            <Text position={labelPositions.equator} fontSize={0.07} color="#ffffff" anchorX="center" anchorY="middle">
              Latitude 0°
            </Text>
            <Line points={primeMeridianPoints} color="#ffd7b5" transparent opacity={0.35} />
            <Text position={labelPositions.prime} fontSize={0.07} color="#ffd7b5" anchorX="center" anchorY="middle">
              Longitude 0°
            </Text>
            <Line points={ninetyMeridianPoints} color="#b5ffd7" transparent opacity={0.25} />
            <Line points={lat30Points} color="#ffffff" transparent opacity={0.2} />
            <Line points={latMinus30Points} color="#ffffff" transparent opacity={0.2} />

            {/* Altitude line */}
            <Line points={[surfacePoint, worldPoint]} color="#FF4500" lineWidth={2} />
            <PointMarker position={worldPoint} />

            {/* Altitude label */}
            {llaData && Number.isFinite(llaData.alt) && llaData.alt > 0 && (
              <Text
                position={[worldPoint[0] + 0.08, worldPoint[1] + 0.08, worldPoint[2] + 0.08]}
                fontSize={0.08}
                color="#FF4500"
                anchorX="left"
                anchorY="middle"
              >
                {`${(llaData.alt / 1000).toFixed(1)} km`}
              </Text>
            )}
          </group>

          {/* Controls */}
          <CameraControls ref={controlsRef} dampingFactor={0.05} minDistance={1.2} maxDistance={8} />
          <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
            <GizmoViewport axisColors={["#ff3653", "#0adb50", "#2c8fdf"]} labelColor="#ffffff" />
          </GizmoHelper>
        </Suspense>
      </Canvas>
    </div>
  );
}
