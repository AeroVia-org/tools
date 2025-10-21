import {
  FaPlaneDeparture,
  FaDraftingCompass,
  FaBolt,
  FaSatellite,
  FaRocket,
  FaRulerCombined,
  FaSatelliteDish,
  FaGlobe,
  FaEye,
  FaStar,
  FaMoon,
  FaGasPump,
  FaCalculator,
  FaTachometerAlt,
  FaTools,
  FaCogs,
  FaRoute,
  FaCompass,
  FaExchangeAlt,
  FaProjectDiagram,
  FaBatteryFull,
  FaBroadcastTower,
  FaRadiation,
  FaCamera,
  FaCloudSun,
  FaClock,
  FaArrowsAlt,
  FaSun,
  FaBalanceScale,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

export const categories = [
  "General Utilities",
  "Atmospheric & Flight",
  "Aerodynamics",
  "Propulsion",
  "Orbital Mechanics",
  "Structures",
  "Communications",
  "Mission Planning",
  "Astronomy",
  "Navigation",
  "UAV Operations",
  "Photography / Imaging",
] as const;

type Tool = {
  type: "active" | "coming-soon" | "hidden";
  key: string; // Unique key for the tool
  title: string;
  icon: IconType;
  description: string;
  category: (typeof categories)[number];
  authors: string[]; // Array of author IDs
};

// Define all tools data for filtering
export const allTools: Tool[] = [
  // General Utilities
  {
    type: "active",
    key: "unit-converter",
    title: "Unit Converter",
    icon: FaRulerCombined,
    description:
      "Convert between common units frequently used in aerospace engineering calculations.",
    category: "General Utilities",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "astronomical-unit-converter",
    title: "Astronomical Unit Converter",
    icon: FaStar,
    description:
      "Convert between AU, km, m, light‑years, parsecs, and lunar distance.",
    category: "General Utilities",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "coordinate-system-converter",
    title: "Coordinate System Converter",
    icon: FaRulerCombined,
    description:
      "Convert between Geodetic (Lat/Lon/Alt), ECEF, UTM, and MGRS coordinates.",
    category: "General Utilities",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "scientific-calculator",
    title: "Scientific Calculator",
    icon: FaCalculator,
    description: "Advanced scientific calculator powered by Desmos.",
    category: "General Utilities",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "coming-soon",
    key: "cost-analysis-calculator",
    title: "Cost Analysis Calculator",
    icon: FaCalculator,
    description:
      "Calculate costs vs quantities, tool costs vs production amounts, and economic analysis for aerospace projects.",
    category: "General Utilities",
    authors: [],
  },

  // Atmospheric & Flight
  {
    type: "active",
    key: "isa-calculator",
    title: "ISA Calculator",
    icon: FaCalculator,
    description:
      "Calculate atmospheric properties (altitude, pressure, temp, density) using the ISA model.",
    category: "Atmospheric & Flight",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "coming-soon", // Work in progress, should be active soon
    key: "aircraft-weight-calculator",
    title: "Aircraft Weight Calculator",
    icon: FaBalanceScale,
    description:
      "Calculate aircraft weight breakdown, fuel fractions, payload capacity, weight fraction relationships, and wing loading (W/S).",
    category: "Atmospheric & Flight",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "coming-soon",
    key: "aircraft-performance-basics",
    title: "Aircraft Performance Basics",
    icon: FaPlaneDeparture,
    description:
      "Calculate maximum lift-to-drag ratio, optimal velocities for range and endurance, and basic aerodynamic performance characteristics.",
    category: "Atmospheric & Flight",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "climb-descent-performance",
    title: "Climb & Descent Performance",
    icon: FaTachometerAlt,
    description:
      "Analyze climb rates, angles, time to climb, service ceiling, descent planning, and glide performance characteristics.",
    category: "Atmospheric & Flight",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "performance-envelopes",
    title: "Performance Envelopes",
    icon: FaProjectDiagram,
    description:
      "Generate V-n diagrams, flight envelopes, gust load factors, maneuver limits, and performance boundary analysis.",
    category: "Atmospheric & Flight",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "range-endurance-analysis",
    title: "Range & Endurance Analysis",
    icon: FaRoute,
    description:
      "Calculate aircraft range and endurance using Breguet equations, optimal cruise conditions, and fuel flow analysis.",
    category: "Atmospheric & Flight",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "takeoff-landing-distance",
    title: "Takeoff & Landing Distance",
    icon: FaTachometerAlt,
    description:
      "Compute balanced field length and runway distance requirements.",
    category: "Atmospheric & Flight",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "coordinated-turn-calculator",
    title: "Coordinated Turn Calculator",
    icon: FaCompass,
    description:
      "Turn radius, bank angle, and load factor for specified speed and rate.",
    category: "Atmospheric & Flight",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "e6b-flight-computer",
    title: "E6B Flight Computer",
    icon: FaCalculator,
    description:
      "Digital E6B: wind correction, TAS, density altitude, and more.",
    category: "Atmospheric & Flight",
    authors: [],
  },

  // Aerodynamics
  {
    type: "active",
    key: "mach-calculator",
    title: "Mach Number Calculator",
    icon: FaPlaneDeparture,
    description:
      "Calculate Mach number and local speed of sound based on airspeed and altitude.",
    category: "Aerodynamics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "reynolds-calculator",
    title: "Reynolds Number Calculator",
    icon: FaDraftingCompass,
    description:
      "Determine the Reynolds number for various fluid flow scenarios and conditions.",
    category: "Aerodynamics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "normal-shock",
    title: "Normal Shock Calculator",
    icon: FaBolt,
    description:
      "Calculate property changes across a normal shock wave in supersonic flow conditions.",
    category: "Aerodynamics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "isentropic-flow",
    title: "Isentropic Flow Calculator",
    icon: FaBolt,
    description:
      "Calculate pressure, temperature, and density ratios across an isentropic flow.",
    category: "Aerodynamics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "lift-drag-calculator",
    title: "Lift & Drag Calculator",
    icon: FaPlaneDeparture,
    description:
      "Calculate lift and drag forces, coefficients, stall speed estimation, and basic aerodynamic performance.",
    category: "Aerodynamics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "coming-soon", // Work in progress, should be active soon
    key: "oblique-shock",
    title: "Oblique Shock Calculator",
    icon: FaBolt,
    description:
      "Calculate properties across oblique shock waves based on upstream conditions.",
    category: "Aerodynamics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "airfoil-data-tool",
    title: "Airfoil Data Tool",
    icon: FaDraftingCompass,
    description:
      "Explore properties and performance data for standard airfoil shapes (e.g., NACA series).",
    category: "Aerodynamics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "prandtl-meyer-expansion",
    title: "Prandtl-Meyer Expansion",
    icon: FaDraftingCompass,
    description:
      "Determine flow turning and property changes through an expansion fan.",
    category: "Aerodynamics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "drag-polar-estimator",
    title: "Drag Polar Estimator",
    icon: FaExchangeAlt,
    description:
      "Estimate CD vs CL curve from geometry and flight test points.",
    category: "Aerodynamics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "airfoil-generator-naca",
    title: "Airfoil Generator (NACA)",
    icon: FaDraftingCompass,
    description:
      "Generate NACA 4/5-digit coordinates and basic aerodynamic metrics.",
    category: "Aerodynamics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "sphere-flow-calculator",
    title: "Sphere Flow Calculator",
    icon: FaGlobe,
    description:
      "Calculate drag coefficient, pressure distribution, and flow characteristics around a sphere for various Reynolds numbers.",
    category: "Aerodynamics",
    authors: [],
  },

  // Propulsion
  {
    type: "active",
    key: "rocket-equation",
    title: "Rocket Equation Calculator",
    icon: FaRocket,
    description:
      "Estimate rocket delta-v performance using the Tsiolkovsky rocket equation.",
    category: "Propulsion",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "propellant-mass-fraction",
    title: "Propellant Mass Fraction",
    icon: FaGasPump,
    description:
      "Calculate propellant mass fraction based on initial and final masses.",
    category: "Propulsion",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "twr-calculator",
    title: "TWR Calculator",
    icon: FaRocket,
    description: "Calculate Thrust-to-Weight Ratio for aircraft or rockets.",
    category: "Propulsion",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "specific-impulse-converter",
    title: "Specific Impulse Converter",
    icon: FaRocket,
    description:
      "Convert specific impulse values between seconds and velocity units.",
    category: "Propulsion",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "coming-soon",
    key: "propeller-performance-estimator",
    title: "Propeller Performance Estimator",
    icon: FaCogs,
    description: "Thrust, power, and efficiency vs advance ratio and RPM.",
    category: "Propulsion",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "nozzle-design-cd",
    title: "Nozzle Design (C–D)",
    icon: FaRocket,
    description:
      "Area ratios, expansion, and performance for converging–diverging nozzles.",
    category: "Propulsion",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "brayton-cycle-analyzer",
    title: "Brayton Cycle Analyzer",
    icon: FaCogs,
    description:
      "Ideal/real cycle performance for gas turbines with component maps.",
    category: "Propulsion",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "rocket-engine-performance-cea",
    title: "Rocket Engine Performance (CEA)",
    icon: FaRocket,
    description:
      "Estimate chamber/exit conditions and Isp via propellant thermochemistry.",
    category: "Propulsion",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "electric-propulsion-sizing",
    title: "Electric Propulsion Sizing",
    icon: FaRocket,
    description:
      "Hall/Ion thruster power, thrust, Isp, and propellant mass estimates.",
    category: "Propulsion",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "mixture-ratio-optimizer",
    title: "Mixture Ratio Optimizer",
    icon: FaExchangeAlt,
    description: "Optimize O/F for target performance or constraints.",
    category: "Propulsion",
    authors: [],
  },

  // Orbital Mechanics
  {
    type: "active",
    key: "orbital-calculator",
    title: "Orbital Period & Velocity",
    icon: FaSatellite,
    description:
      "Calculate orbital period and velocity characteristics for satellites in circular orbits.",
    category: "Orbital Mechanics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "hohmann-transfer",
    title: "Hohmann Transfer Calculator",
    icon: FaSatellite,
    description:
      "Calculate the required delta-v for efficient Hohmann transfer orbital maneuvers.",
    category: "Orbital Mechanics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "active",
    key: "delta-v-budget-tool",
    title: "Delta-V Budget Tool",
    icon: FaSatellite,
    description:
      "Input delta-v values for mission phases to calculate total requirements.",
    category: "Orbital Mechanics",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "coming-soon",
    key: "satellite-pass-planner",
    title: "Satellite Pass Planner",
    icon: FaEye,
    description:
      "Calculate satellite pass times, visibility windows, and ground tracks for any location.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "launch-window-planner",
    title: "Launch Window Planner",
    icon: FaSun,
    description:
      "Phase angle, lighting, and geometry constraints for mission departure windows.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "porkchop-plotter",
    title: "Porkchop Plotter",
    icon: FaProjectDiagram,
    description:
      "Visualize launch/arrival date trade-offs and delta‑v for interplanetary transfers.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "lambert-solver",
    title: "Lambert Solver",
    icon: FaArrowsAlt,
    description: "Two-point boundary value transfer solution between orbits.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "ground-track-visualizer",
    title: "Ground Track Visualizer",
    icon: FaGlobe,
    description: "Plot sub-satellite tracks and repeat cycles on maps.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "sun-synchronous-orbit-designer",
    title: "Sun-Synchronous Orbit Designer",
    icon: FaCompass,
    description:
      "Design SSO altitude and inclination for desired local time of ascending node.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "raan-drift-calculator",
    title: "RAAN Drift Calculator",
    icon: FaExchangeAlt,
    description:
      "Compute nodal precession due to J2 for sun-synchronous and other LEO orbits.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "plane-change-optimizer",
    title: "Plane Change Optimizer",
    icon: FaArrowsAlt,
    description:
      "Minimize delta‑v for inclination/RAAN changes and combined maneuvers.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "reentry-heating-corridor",
    title: "Reentry Heating & Corridor",
    icon: FaRadiation,
    description:
      "Estimate peak heating, g-loads, and corridor constraints for entry profiles.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "aerobraking-planner",
    title: "Aerobraking Planner",
    icon: FaExchangeAlt,
    description:
      "Periapsis targeting and pass-by-pass delta‑v savings for aerobraking campaigns.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "orbital-elements-calculator",
    title: "Orbital Elements Calculator",
    icon: FaSatellite,
    description:
      "Convert between different orbital element representations (Keplerian, Cartesian) and classify orbit types.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "keplers-equation-solver",
    title: "Kepler's Equation Solver",
    icon: FaCalculator,
    description:
      "Solve Kepler's equation for elliptical orbits and convert between mean, eccentric, and true anomaly.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "hyperbolic-trajectory-calculator",
    title: "Hyperbolic Trajectory Calculator",
    icon: FaRocket,
    description:
      "Analyze hyperbolic orbits, escape trajectories, and flyby missions with hyperbolic excess velocity.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "orbital-maneuver-planner",
    title: "Orbital Maneuver Planner",
    icon: FaArrowsAlt,
    description:
      "Plan complex orbital maneuvers including bi-elliptic transfers, plane changes, and multi-burn optimization.",
    category: "Orbital Mechanics",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "orbit-propagation-tool",
    title: "Orbit Propagation Tool",
    icon: FaClock,
    description:
      "Predict orbital position over time using Keplerian and SGP4 propagation methods.",
    category: "Orbital Mechanics",
    authors: [],
  },

  // Structures
  {
    type: "coming-soon",
    key: "structural-analysis-tool",
    title: "Structural Analysis Tool",
    icon: FaTools,
    description:
      "Comprehensive structural analysis for beams, plates, cylinders, and rods with material properties and stress calculations.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "beam-bending-deflection",
    title: "Beam Bending & Deflection",
    icon: FaTools,
    description:
      "Deflection, slope, shear, and moment for common beam load cases.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "column-buckling-calculator",
    title: "Column Buckling Calculator",
    icon: FaTools,
    description:
      "Euler buckling and effective length factors for structural members.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "fastener-shear-bearing",
    title: "Fastener Shear/Bearing",
    icon: FaTools,
    description:
      "Allowables and margins for rivets/bolts in single- and double-shear.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "composite-laminate-analyzer",
    title: "Composite Laminate Analyzer",
    icon: FaCogs,
    description:
      "Classical laminate theory (ABD matrices), ply strains, and failure indices.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "pressure-vessel-stress",
    title: "Pressure Vessel Stress",
    icon: FaTools,
    description:
      "Hoop and longitudinal stresses for thin/thick-walled cylinders and spheres.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "stress-concentration-factor",
    title: "Stress Concentration Factor",
    icon: FaBalanceScale,
    description:
      "Kt values for common geometric features like holes, fillets, and notches.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "fatigue-life-estimator",
    title: "Fatigue Life Estimator",
    icon: FaTools,
    description:
      "S-N curves and fatigue life calculations for cyclic loading conditions.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "torsion-calculator",
    title: "Torsion Calculator",
    icon: FaCogs,
    description:
      "Shear stress and angle of twist for circular and non-circular cross-sections.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "plate-bending-calculator",
    title: "Plate Bending Calculator",
    icon: FaTools,
    description:
      "Deflection and stress in thin plates under various loading conditions.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "safety-factor-calculator",
    title: "Safety Factor Calculator",
    icon: FaBalanceScale,
    description:
      "Calculate safety factors and margins of safety for structural designs.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "weld-strength-calculator",
    title: "Weld Strength Calculator",
    icon: FaTools,
    description: "Allowable loads and stress concentrations for welded joints.",
    category: "Structures",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "natural-frequency-calculator",
    title: "Natural Frequency Calculator",
    icon: FaCogs,
    description:
      "First mode natural frequency for beams, plates, and simple structures.",
    category: "Structures",
    authors: [],
  },

  // Communications
  {
    type: "active",
    key: "radar-range",
    title: "Radar Range Equation",
    icon: FaSatelliteDish,
    description:
      "Estimate maximum radar detection range based on system parameters.",
    category: "Communications",
    authors: ["ss7akccnt3fr227zrvk5vae5ks7kqrah"],
  },
  {
    type: "coming-soon",
    key: "rf-link-budget",
    title: "RF Link Budget",
    icon: FaBroadcastTower,
    description:
      "Uplink/downlink SNR, data rate, and margin for ground–space links.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "antenna-gain-calculator",
    title: "Antenna Gain Calculator",
    icon: FaSatelliteDish,
    description:
      "Calculate antenna gain, beamwidth, and directivity for parabolic and horn antennas.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "free-space-path-loss",
    title: "Free Space Path Loss",
    icon: FaBroadcastTower,
    description:
      "Calculate signal attenuation in free space for various frequencies and distances.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "doppler-shift-calculator",
    title: "Doppler Shift Calculator",
    icon: FaSatelliteDish,
    description:
      "Calculate frequency shifts due to relative motion between transmitter and receiver.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "noise-figure-calculator",
    title: "Noise Figure Calculator",
    icon: FaBroadcastTower,
    description:
      "Calculate system noise figure and noise temperature for cascaded amplifiers.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "modulation-index-calculator",
    title: "Modulation Index Calculator",
    icon: FaSatelliteDish,
    description:
      "Calculate modulation index and bandwidth for AM, FM, and PM signals.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "bit-error-rate-calculator",
    title: "Bit Error Rate (BER) Calculator",
    icon: FaBroadcastTower,
    description:
      "Calculate BER for various modulation schemes and signal-to-noise ratios.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "polarization-loss-calculator",
    title: "Polarization Loss Calculator",
    icon: FaSatelliteDish,
    description:
      "Calculate signal loss due to polarization mismatch between antennas.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "atmospheric-attenuation",
    title: "Atmospheric Attenuation",
    icon: FaBroadcastTower,
    description:
      "Calculate signal attenuation due to atmospheric gases and precipitation.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "antenna-array-calculator",
    title: "Antenna Array Calculator",
    icon: FaSatelliteDish,
    description:
      "Calculate gain, beamwidth, and sidelobes for linear and planar antenna arrays.",
    category: "Communications",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "shannon-capacity-calculator",
    title: "Shannon Capacity Calculator",
    icon: FaBroadcastTower,
    description:
      "Calculate theoretical channel capacity using Shannon's theorem.",
    category: "Communications",
    authors: [],
  },

  // Mission Planning
  {
    type: "coming-soon",
    key: "delta-v-tree-builder",
    title: "Delta‑V Tree Builder",
    icon: FaProjectDiagram,
    description:
      "Build staged mission delta‑v trees with margins and staging losses.",
    category: "Mission Planning",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "payload-mass-budget",
    title: "Payload Mass Budget",
    icon: FaBalanceScale,
    description:
      "Budget payload, structures, tanks, and margins across mission phases.",
    category: "Mission Planning",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "power-energy-budget",
    title: "Power & Energy Budget",
    icon: FaBatteryFull,
    description:
      "Generate orbital power profiles with eclipse margins and battery sizing.",
    category: "Mission Planning",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "eclipse-duration-calculator",
    title: "Eclipse Duration Calculator",
    icon: FaClock,
    description:
      "Predict eclipse entry/exit and durations for LEO/GEO and interplanetary arcs.",
    category: "Mission Planning",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "radiation-exposure-estimator",
    title: "Radiation Exposure Estimator",
    icon: FaRadiation,
    description:
      "Dose estimates through belts and deep space with shielding assumptions.",
    category: "Mission Planning",
    authors: [],
  },

  // Astronomy
  {
    type: "coming-soon",
    key: "sunrise-sunset-calculator",
    title: "Sunrise/Sunset & Moonrise/Moonset Calculator",
    icon: FaSun,
    description:
      "Calculate sunrise, sunset, moonrise, and moonset times for any specific location and date.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "moon-phases-calculator",
    title: "Moon Phases Calculator",
    icon: FaMoon,
    description:
      "Calculate lunar phases, illumination percentage, and phase dates for any specific location.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "eclipse-calculator",
    title: "Eclipse Calculator",
    icon: FaStar,
    description:
      "Calculate solar and lunar eclipses visible from any specific location with timing and visibility details.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "redshift-calculator",
    title: "Redshift Calculator",
    icon: FaGlobe,
    description:
      "Calculate cosmological distances, lookback times, and redshift relationships for astronomical objects.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "field-of-view-calculator",
    title: "Field of View Calculator",
    icon: FaCamera,
    description:
      "Compute FOV for any camera + telescope/lens combination and object framing.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "pixel-scale-sampling",
    title: "Pixel Scale & Sampling",
    icon: FaCamera,
    description:
      "Arcsec/pixel, Nyquist sampling, and seeing-limited resolution guidance.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "milky-way-core-planner",
    title: "Milky Way Core Planner",
    icon: FaSun,
    description:
      "Best dates/times and azimuth/elevation for core visibility at your location.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "meteor-shower-tracker",
    title: "Meteor Shower Tracker",
    icon: FaStar,
    description:
      "Peak rates, radiant altitude, and timing for major meteor showers.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "planetary-visibility-planner",
    title: "Planetary Visibility Planner",
    icon: FaMoon,
    description:
      "Apparitions, elongations, and altitude windows for planets and bright asteroids.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "conjunction-occultation-finder",
    title: "Conjunction & Occultation Finder",
    icon: FaStar,
    description:
      "Predict close approaches and occultations for selected targets.",
    category: "Astronomy",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "polar-alignment-helper",
    title: "Polar Alignment Helper",
    icon: FaCompass,
    description:
      "Altitude/azimuth offsets and reticle overlays for quick polar alignment.",
    category: "Astronomy",
    authors: [],
  },

  // Navigation
  {
    type: "coming-soon",
    key: "great-circle-route-planner",
    title: "Great-Circle Route Planner",
    icon: FaRoute,
    description:
      "Plan and visualize shortest air routes with ETAs and waypoints.",
    category: "Navigation",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "geodesic-distance-bearings",
    title: "Geodesic Distance & Bearings",
    icon: FaCompass,
    description:
      "Compute distance, initial/final bearings, and intermediate points on ellipsoid.",
    category: "Navigation",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "geoid-height-estimator",
    title: "Geoid Height (EGM96) Estimator",
    icon: FaGlobe,
    description: "Approximate geoid undulation to refine altitude conversions.",
    category: "Navigation",
    authors: [],
  },

  // UAV Operations
  {
    type: "coming-soon",
    key: "drone-flight-time-estimator",
    title: "Drone Flight Time Estimator",
    icon: FaBatteryFull,
    description:
      "Estimate endurance from battery capacity, payload, and environment.",
    category: "UAV Operations",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "survey-grid-mapping-planner",
    title: "Survey Grid/Mapping Planner",
    icon: FaRoute,
    description:
      "Generate lawnmower patterns and overlaps for area mapping missions.",
    category: "UAV Operations",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "battery-sizing-uav",
    title: "Battery Sizing for UAV",
    icon: FaBatteryFull,
    description:
      "Estimate pack voltage, capacity, and C‑rating for mission profiles.",
    category: "UAV Operations",
    authors: [],
  },

  // Photography / Imaging
  {
    type: "coming-soon",
    key: "golden-hour-sun-moon-planner",
    title: "Golden Hour & Sun/Moon Planner",
    icon: FaCloudSun,
    description:
      "Sunrise/sunset, blue hour, moonrise/set, and illumination guidance.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "sun-moon-az-el-shadows",
    title: "Sun/Moon Az-El & Shadows",
    icon: FaCompass,
    description:
      "Azimuth/elevation, shadow lengths, and subject alignment planning.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "ground-sample-distance-calculator",
    title: "Ground Sample Distance Calculator",
    icon: FaCamera,
    description:
      "Calculate pixel resolution, coverage area, and footprint for aerial/satellite photography missions.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "aircraft-tracking-calculator",
    title: "Aircraft Tracking Calculator",
    icon: FaPlaneDeparture,
    description:
      "Calculate panning speed and exposure time for photographing moving aircraft.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "satellite-streak-calculator",
    title: "Satellite Streak Calculator",
    icon: FaSatellite,
    description:
      "Calculate exposure time and ISO for capturing satellite trails and streaks.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "telescope-focal-length-calculator",
    title: "Telescope Focal Length Calculator",
    icon: FaEye,
    description:
      "Calculate effective focal length, magnification, and field of view for telescope photography.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "rocket-exhaust-exposure-calculator",
    title: "Rocket Exhaust Exposure Calculator",
    icon: FaRocket,
    description:
      "Calculate exposure settings for capturing rocket exhaust plumes and ignition sequences.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "aurora-exposure-calculator",
    title: "Aurora Exposure Calculator",
    icon: FaBroadcastTower,
    description:
      "Calculate optimal shutter speed and ISO for capturing aurora based on intensity and movement.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "orbital-photography-planner",
    title: "Orbital Photography Planner",
    icon: FaGlobe,
    description:
      "Calculate optimal imaging times and sun angles for Earth observation photography.",
    category: "Photography / Imaging",
    authors: [],
  },
  {
    type: "coming-soon",
    key: "meteor-trail-calculator",
    title: "Meteor Trail Calculator",
    icon: FaSatelliteDish,
    description:
      "Calculate exposure settings and field of view for capturing meteor trails and fireballs.",
    category: "Photography / Imaging",
    authors: [],
  },
];

// Helper function to tool by key
export function getToolByKey(key: string): Tool {
  return allTools.find((tool) => tool.key === key)!;
}

// Helper function to get the author by id
export function getAuthorById(id: string) {
  // Temporary hardcoded author
  const author = {
    name: "Eliot Gevers",
    profilePictureUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ5ZTlyTXpsODRud2VnM3ladTdCUEtQRHRzRSJ9",
  };

  if (id === "ss7akccnt3fr227zrvk5vae5ks7kqrah") {
    return author;
  }

  return null;
}
