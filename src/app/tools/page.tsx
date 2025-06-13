import Link from "next/link";
import { FaCalculator } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";

import {
  FaPlaneDeparture, // Lift/Drag, Mach, Range
  FaDraftingCompass, // Reynolds, Airfoil
  FaBolt, // Shockwave
  FaSatellite, // Orbital Period, Hohmann
  FaRocket, // Rocket Equation
  FaRulerCombined, // Unit Converter
  FaSatelliteDish, // Radar Range Equation
} from "react-icons/fa";

// Reusable "Coming Soon" Badge Component
const ComingSoonBadge = () => (
  <span className="inline-block rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase dark:bg-gradient-to-r dark:from-blue-900/40 dark:to-purple-900/40 dark:text-blue-300">
    Coming Soon
  </span>
);

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title and Description*/}
      <div className="mb-12 text-center">
        <h1 className="inline-block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text pb-4 text-4xl font-bold text-transparent sm:text-5xl">
          Aerospace Tools
        </h1>
        <p className="mx-4 mt-2 text-lg text-gray-600 dark:text-gray-300">
          Explore a collection of aerospace tools, calculators, and simulators
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* ISA Calculator Card (Active) */}
        <Link
          href="/tools/isa-calculator"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaCalculator className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">ISA Calculator</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Calculate atmospheric properties (altitude, pressure, temp, density) using the ISA model.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Orbital Period/Velocity Calculator Card (Active) */}
        <Link
          href="/tools/orbital-calculator"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaSatellite className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Orbital Period & Velocity</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Calculate orbital period and velocity characteristics for satellites in circular orbits.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Hohmann Transfer Calculator Card (Active) */}
        <Link
          href="/tools/hohmann-transfer"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaSatellite className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Hohmann Transfer Calculator</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Calculate the required delta-v for efficient Hohmann transfer orbital maneuvers.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Unit Converter Card (Active) */}
        <Link
          href="/tools/unit-converter"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaRulerCombined className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Unit Converter</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Convert between common units frequently used in aerospace engineering calculations.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Mach Number Calculator Card (Active) */}
        <Link
          href="/tools/mach-calculator"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaPlaneDeparture className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Mach Number Calculator</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Calculate Mach number and local speed of sound based on airspeed and altitude.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Reynolds Number Calculator Card (Active) */}
        <Link
          href="/tools/reynolds-calculator"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaDraftingCompass className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Reynolds Number Calculator</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Determine the Reynolds number for various fluid flow scenarios and conditions.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Normal Shock Calculator Card (Active) */}
        <Link
          href="/tools/normal-shock"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaBolt className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Normal Shock Calculator</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Calculate property changes across a normal shock wave in supersonic flow conditions.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Rocket Equation Calculator Card (Active now) */}
        <Link
          href="/tools/rocket-equation"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaRocket className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Rocket Equation Calculator</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Estimate rocket delta-v performance using the Tsiolkovsky rocket equation.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Isentropic Flow Calculator Card (Active) */}
        <Link
          href="/tools/isentropic-flow"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaBolt className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Isentropic Flow Calculator</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Calculate pressure, temperature, and density ratios across an isentropic flow.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Radar Range Equation Calculator Card (Active) */}
        <Link
          href="/tools/radar-range"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
              <FaSatelliteDish className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Radar Range Equation</h3>
            <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
              Estimate maximum radar detection range based on system parameters.
            </p>
            <div className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Use Tool
              <FiChevronRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Oblique Shock Calculator Card (NOT YET COMPLETE, TESTED, OR OPTIMIZED - STILL IN DEVELOPMENT) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaBolt className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Oblique Shock Calculator</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Calculate properties across oblique shock waves based on upstream conditions.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Lift and Drag Calculator Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaPlaneDeparture className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Lift & Drag Calculator</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Calculate basic lift and drag forces based on flight conditions and aircraft geometry.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Airfoil Data Tool Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaDraftingCompass className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Airfoil Data Tool</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Explore properties and performance data for standard airfoil shapes (e.g., NACA series).
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Range/Endurance Estimator Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaPlaneDeparture className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Range/Endurance Estimator</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Estimate aircraft flight range and endurance using simplified performance models.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Prandtl-Meyer Expansion Fan Calculator Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaDraftingCompass className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Prandtl-Meyer Expansion</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Determine flow turning and property changes through an expansion fan.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Thrust-to-Weight Ratio (TWR) Calculator Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaRocket className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">TWR Calculator</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Calculate Thrust-to-Weight Ratio for aircraft or rockets.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Wing Loading Calculator Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaPlaneDeparture className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Wing Loading Calculator</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Calculate wing loading based on aircraft weight and wing area.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Specific Impulse (Isp) Converter Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaRocket className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Specific Impulse Converter</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Convert specific impulse values between seconds and velocity units.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Propellant Mass Fraction Calculator Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaRocket className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Propellant Mass Fraction</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Calculate propellant mass fraction based on initial and final masses.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Delta-V Budget Tool Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaSatellite className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Delta-V Budget Tool</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Input delta-v values for mission phases to calculate total requirements.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* Coordinate System Converter Card (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100/50 p-6 opacity-70 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/10">
              <FaRulerCombined className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Coordinate System Converter</h3>
            <p className="mb-4 flex-grow text-gray-500 dark:text-gray-400">
              Convert between Geodetic (Lat/Lon/Alt) and ECEF coordinates.
            </p>
            <div className="mt-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
