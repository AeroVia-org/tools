"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@packages/ui/components/ui/card";
import { Badge } from "@packages/ui/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";
import Navigation from "../../components/Navigation";
import Script from "next/script";

const API_KEY = "c2f88fc251d4459699e9e1f526ac3e8b";

declare global {
  interface Window {
    Desmos: {
      GraphingCalculator: (element: HTMLElement | null) => void;
    };
  }
}

function Calculator() {
  return (
    <>
      <div id="calculator" className="h-[600px] w-full" style={{ minHeight: "600px" }} />
      <Script
        src={`https://www.desmos.com/api/v1.11/calculator.js?apiKey=${API_KEY}`}
        strategy="afterInteractive"
        onReady={() => {
          const el = document.getElementById("calculator");
          window.Desmos.GraphingCalculator(el);
        }}
      />
    </>
  );
}

export default function DesmosScientificCalculatorPage() {
  const aerospaceConstants = [
    { name: "Earth Radius", symbol: "R_E", value: "6.371 × 10⁶ m" },
    { name: "Gravitational Parameter", symbol: "μ_E", value: "3.986 × 10¹⁴ m³/s²" },
    { name: "Speed of Light", symbol: "c", value: "2.998 × 10⁸ m/s" },
    { name: "Boltzmann Constant", symbol: "k_B", value: "1.381 × 10⁻²³ J/K" },
    { name: "Avogadro's Number", symbol: "N_A", value: "6.022 × 10²³ mol⁻¹" },
    { name: "Universal Gas Constant", symbol: "R", value: "8.314 J/(mol·K)" },
    { name: "Planck Constant", symbol: "h", value: "6.626 × 10⁻³⁴ J·s" },
    { name: "Stefan-Boltzmann Constant", symbol: "σ", value: "5.670 × 10⁻⁸ W/(m²·K⁴)" },
  ];

  type Formula = {
    name: string;
    formula: string;
    category: string;
  };

  const FORMULAS: ReadonlyArray<Formula> = [
    // Kinematics
    { name: "Velocity (linear)", formula: "v = v₀ + a t", category: "Kinematics" },
    { name: "Displacement (linear)", formula: "s = v₀ t + ½ a t²", category: "Kinematics" },
    { name: "Velocity-squared", formula: "v² = v₀² + 2 a s", category: "Kinematics" },
    { name: "Uniform motion", formula: "x = x₀ + v t", category: "Kinematics" },
    { name: "Angular velocity", formula: "ω = ω₀ + α t", category: "Kinematics" },
    { name: "Angular displacement", formula: "θ = ω₀ t + ½ α t²", category: "Kinematics" },
    { name: "Angular velocity-squared", formula: "ω² = ω₀² + 2 α θ", category: "Kinematics" },
    { name: "Centripetal acceleration", formula: "a_c = v² / r = ω² r", category: "Kinematics" },

    // Dynamics & Energy
    { name: "Newton's 2nd law", formula: "F = m a", category: "Dynamics" },
    { name: "Momentum", formula: "p = m v", category: "Dynamics" },
    { name: "Impulse", formula: "J = ∫ F dt = Δp", category: "Dynamics" },
    { name: "Work (line integral)", formula: "W = ∫ F · ds", category: "Dynamics" },
    { name: "Power", formula: "P = dW/dt = F · v", category: "Dynamics" },
    { name: "Kinetic energy", formula: "E_k = ½ m v²", category: "Dynamics" },
    { name: "Rotational KE", formula: "E_rot = ½ I ω²", category: "Dynamics" },
    { name: "Potential energy (near Earth)", formula: "E_p = m g h", category: "Dynamics" },
    { name: "Torque", formula: "τ = r × F", category: "Dynamics" },
    { name: "Rotational dynamics", formula: "∑τ = I α", category: "Dynamics" },

    // Statics
    { name: "Force equilibrium", formula: "∑F = 0", category: "Statics" },
    { name: "Moment equilibrium", formula: "∑M = 0", category: "Statics" },
    { name: "Friction limit", formula: "F_f ≤ μ N", category: "Statics" },

    // Thermodynamics & Gas Dynamics
    { name: "Ideal gas (molar)", formula: "p V = n R T", category: "Thermodynamics" },
    { name: "Ideal gas (specific)", formula: "p v = R T", category: "Thermodynamics" },
    { name: "First law (closed)", formula: "ΔU = Q − W", category: "Thermodynamics" },
    { name: "Internal energy", formula: "U = m c_v T", category: "Thermodynamics" },
    { name: "Enthalpy", formula: "h = u + p v", category: "Thermodynamics" },
    { name: "Enthalpy (cp)", formula: "H = m c_p T", category: "Thermodynamics" },
    { name: "Specific heats", formula: "c_p − c_v = R", category: "Thermodynamics" },
    { name: "Adiabatic relation", formula: "p v^γ = const", category: "Thermodynamics" },
    { name: "Isentropic T ratio", formula: "T₂/T₁ = (p₂/p₁)^{(γ−1)/γ}", category: "Thermodynamics" },
    { name: "Isentropic density ratio", formula: "ρ₂/ρ₁ = (p₂/p₁)^{1/γ}", category: "Thermodynamics" },

    // Fluid Mechanics & Aerodynamics
    { name: "Continuity (incompressible)", formula: "A₁ V₁ = A₂ V₂", category: "Fluids & Aero" },
    { name: "Bernoulli", formula: "p + ½ ρ v² + ρ g h = const", category: "Fluids & Aero" },
    { name: "Dynamic pressure", formula: "q = ½ ρ v²", category: "Fluids & Aero" },
    { name: "Reynolds number", formula: "Re = ρ v L / μ", category: "Fluids & Aero" },
    { name: "Speed of sound", formula: "a = √(γ R T)", category: "Fluids & Aero" },
    { name: "Mach number", formula: "M = v / a", category: "Fluids & Aero" },
    { name: "Lift force", formula: "L = ½ ρ v² C_L A", category: "Fluids & Aero" },
    { name: "Drag force", formula: "D = ½ ρ v² C_D A", category: "Fluids & Aero" },
    { name: "Skin friction (turbulent plate)", formula: "C_f ≈ 0.026 Re^{−1/7}", category: "Fluids & Aero" },
    { name: "Stagnation pressure", formula: "p₀/p = (1 + (γ−1) M² / 2)^{γ/(γ−1)}", category: "Fluids & Aero" },
    { name: "Stagnation temperature", formula: "T₀/T = 1 + (γ−1) M² / 2", category: "Fluids & Aero" },
    { name: "Isentropic density", formula: "ρ₀/ρ = (1 + (γ−1) M² / 2)^{1/(γ−1)}", category: "Fluids & Aero" },

    // Orbital Mechanics
    { name: "Vis-viva", formula: "v² = μ (2/r − 1/a)", category: "Orbital Mechanics" },
    { name: "Circular orbit speed", formula: "v_c = √(μ / r)", category: "Orbital Mechanics" },
    { name: "Escape speed", formula: "v_e = √(2 μ / r)", category: "Orbital Mechanics" },
    { name: "Orbital period", formula: "T = 2 π √(a³ / μ)", category: "Orbital Mechanics" },
    { name: "Specific energy", formula: "ε = − μ/(2 a)", category: "Orbital Mechanics" },
    { name: "Specific ang. momentum", formula: "h = √(μ a (1 − e²))", category: "Orbital Mechanics" },
    { name: "Periapsis radius", formula: "r_p = a (1 − e)", category: "Orbital Mechanics" },
    { name: "Apoapsis radius", formula: "r_a = a (1 + e)", category: "Orbital Mechanics" },
    { name: "Hohmann Δv₁", formula: "Δv₁ = √(μ/r₁) (√(2 r₂/(r₁+r₂)) − 1)", category: "Orbital Mechanics" },
    { name: "Hohmann Δv₂", formula: "Δv₂ = √(μ/r₂) (1 − √(2 r₁/(r₁+r₂)))", category: "Orbital Mechanics" },
    { name: "Plane change", formula: "Δv = 2 v sin(Δi/2)", category: "Orbital Mechanics" },
    { name: "Mean motion", formula: "n = √(μ / a³)", category: "Orbital Mechanics" },

    // Atmosphere & Gravity
    { name: "Density", formula: "ρ = p / (R T)", category: "Atmosphere" },
    { name: "ISA lapse (troposphere)", formula: "T = T₀ − L h", category: "Atmosphere" },
    { name: "Pressure vs altitude", formula: "p = p₀ (T/T₀)^{g₀/(R L)}", category: "Atmosphere" },
    { name: "Gravity vs altitude", formula: "g(h) ≈ g₀ (R_E/(R_E+h))²", category: "Atmosphere" },
    { name: "Scale height", formula: "H = R T / (M g)", category: "Atmosphere" },
    { name: "Geopotential height", formula: "H_g = (R_E h)/(R_E + h)", category: "Atmosphere" },
  ];

  const categories: ReadonlyArray<string> = (() => {
    const set = new Set<string>();
    for (const f of FORMULAS) set.add(f.category);
    return ["All", ...Array.from(set).sort()];
  })();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const filteredFormulas: ReadonlyArray<Formula> =
    selectedCategory === "All" ? FORMULAS : FORMULAS.filter((f) => f.category === selectedCategory);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="scientific-calculator" />

      {/* Calculator */}
      <Calculator />

      {/* Constants Card */}
      <Card>
        <CardHeader>
          <CardTitle>Aerospace Constants</CardTitle>
          <CardDescription>Common physical constants for aerospace calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {aerospaceConstants.map((constant, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{constant.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {constant.symbol}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-xs">{constant.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Formulas Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Common Formulas</CardTitle>
              <CardDescription>
                A categorized list of frequently used engineering and aerospace formulas
              </CardDescription>
            </div>
            <div className="md:min-w-[220px]">
              <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFormulas.map((f, idx) => (
              <div key={`${f.name}-${idx}`} className="bg-muted/50 rounded-lg p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{f.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {f.category}
                  </Badge>
                </div>
                <div className="text-accent-foreground font-mono text-xs">{f.formula}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
