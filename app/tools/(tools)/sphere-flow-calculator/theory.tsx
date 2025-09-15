import { FaBook, FaCalculator, FaChartLine, FaEye } from "react-icons/fa";

export default function Theory() {
  return (
    <div className="space-y-8">
      <div className="mb-6 flex items-center gap-3">
        <FaBook className="text-primary text-2xl" />
        <h2 className="text-foreground text-2xl font-bold">Theory & Background</h2>
      </div>

      {/* Introduction */}
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground leading-relaxed">
          Flow around a sphere is one of the fundamental problems in fluid mechanics and aerodynamics. It demonstrates
          key concepts including boundary layer formation, flow separation, wake development, and the dramatic changes
          in drag coefficient with Reynolds number. This tool calculates the aerodynamic characteristics of a sphere in
          various flow regimes.
        </p>
      </div>

      {/* Reynolds Number */}
      <div className="space-y-4">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-semibold">
          <FaCalculator className="text-primary" />
          Reynolds Number
        </h3>
        <div className="bg-card border-border rounded-lg border p-6">
          <p className="text-muted-foreground mb-4">
            The Reynolds number is the fundamental dimensionless parameter that characterizes the flow regime:
          </p>
          <div className="bg-muted/50 rounded-lg p-4 text-center font-mono text-lg">
            <span className="text-primary">Re</span> =<span className="text-secondary"> ρVD/μ</span>
          </div>
          <div className="text-muted-foreground mt-4 space-y-1 text-sm">
            <p>
              <strong>ρ</strong> = Fluid density (kg/m³)
            </p>
            <p>
              <strong>V</strong> = Flow velocity (m/s)
            </p>
            <p>
              <strong>D</strong> = Sphere diameter (m)
            </p>
            <p>
              <strong>μ</strong> = Dynamic viscosity (Pa·s)
            </p>
          </div>
          <p className="text-muted-foreground mt-4">
            The Reynolds number represents the ratio of inertial forces to viscous forces. Low Reynolds numbers indicate
            viscous-dominated flow, while high Reynolds numbers indicate inertia-dominated flow.
          </p>
        </div>
      </div>

      {/* Flow Regimes */}
      <div className="space-y-4">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-semibold">
          <FaEye className="text-primary" />
          Flow Regimes
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Stokes Flow */}
          <div className="bg-card border-border rounded-lg border p-4">
            <h4 className="text-foreground mb-2 font-semibold">Stokes Flow (Re &lt; 1)</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Creeping flow where viscous forces dominate. No flow separation occurs.
            </p>
            <div className="bg-muted/50 rounded p-3 font-mono text-sm">
              C<sub>D</sub> = 24/Re
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Drag coefficient inversely proportional to Reynolds number
            </p>
          </div>

          {/* Subcritical Flow */}
          <div className="bg-card border-border rounded-lg border p-4">
            <h4 className="text-foreground mb-2 font-semibold">Subcritical Flow (1 &lt; Re &lt; 1000)</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Laminar boundary layer with gradual separation. Wake formation begins.
            </p>
            <div className="bg-muted/50 rounded p-3 font-mono text-sm">
              C<sub>D</sub> ≈ 0.4
            </div>
            <p className="text-muted-foreground mt-2 text-xs">Drag coefficient becomes relatively constant</p>
          </div>

          {/* Critical Flow */}
          <div className="bg-card border-border rounded-lg border p-4">
            <h4 className="text-foreground mb-2 font-semibold">Critical Flow (1000 &lt; Re &lt; 200,000)</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Transition from laminar to turbulent boundary layer. Drag crisis occurs.
            </p>
            <div className="bg-muted/50 rounded p-3 font-mono text-sm">
              C<sub>D</sub> drops from 0.4 to 0.2
            </div>
            <p className="text-muted-foreground mt-2 text-xs">Dramatic reduction in drag coefficient</p>
          </div>

          {/* Supercritical Flow */}
          <div className="bg-card border-border rounded-lg border p-4">
            <h4 className="text-foreground mb-2 font-semibold">Supercritical Flow (Re &gt; 200,000)</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Turbulent boundary layer with delayed separation. Smaller wake.
            </p>
            <div className="bg-muted/50 rounded p-3 font-mono text-sm">
              C<sub>D</sub> ≈ 0.2
            </div>
            <p className="text-muted-foreground mt-2 text-xs">Lower drag coefficient maintained</p>
          </div>
        </div>
      </div>

      {/* Drag Coefficient Correlations */}
      <div className="space-y-4">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-semibold">
          <FaChartLine className="text-primary" />
          Drag Coefficient Correlations
        </h3>

        <div className="bg-card border-border rounded-lg border p-6">
          <h4 className="text-foreground mb-4 font-semibold">Empirical Correlations Used</h4>

          <div className="space-y-4">
            {/* Stokes Flow */}
            <div className="border-primary border-l-4 pl-4">
              <h5 className="text-foreground font-medium">Stokes Flow (Re &lt; 0.1)</h5>
              <div className="bg-muted/50 my-2 rounded p-3 font-mono text-sm">
                C<sub>D</sub> = 24/Re
              </div>
              <p className="text-muted-foreground text-sm">
                Exact solution for creeping flow. Derived from Stokes&apos; equations.
              </p>
            </div>

            {/* Oseen Correction */}
            <div className="border-secondary border-l-4 pl-4">
              <h5 className="text-foreground font-medium">Oseen Correction (0.1 &lt; Re &lt; 1)</h5>
              <div className="bg-muted/50 my-2 rounded p-3 font-mono text-sm">
                C<sub>D</sub> = (24/Re) × (1 + 3Re/16)
              </div>
              <p className="text-muted-foreground text-sm">
                First-order correction to Stokes solution accounting for inertial effects.
              </p>
            </div>

            {/* Schiller-Naumann */}
            <div className="border-accent border-l-4 pl-4">
              <h5 className="text-foreground font-medium">Schiller-Naumann (1 &lt; Re &lt; 1000)</h5>
              <div className="bg-muted/50 my-2 rounded p-3 font-mono text-sm">
                C<sub>D</sub> = (24/Re) × (1 + 0.15Re<sup>0.687</sup>) + 0.42/(1 + 42500/Re<sup>1.16</sup>)
              </div>
              <p className="text-muted-foreground text-sm">
                Comprehensive correlation covering transition from Stokes to Newton&apos;s regime.
              </p>
            </div>

            {/* Critical Region */}
            <div className="border-destructive border-l-4 pl-4">
              <h5 className="text-foreground font-medium">Critical Region (1000 &lt; Re &lt; 200,000)</h5>
              <div className="bg-muted/50 my-2 rounded p-3 font-mono text-sm">
                C<sub>D</sub> = 0.4 - 0.2 × (log₁₀(Re) - 4.5)/0.5
              </div>
              <p className="text-muted-foreground text-sm">Linear interpolation through the drag crisis region.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pressure Distribution */}
      <div className="space-y-4">
        <h3 className="text-foreground text-xl font-semibold">Pressure Coefficient Distribution</h3>

        <div className="bg-card border-border rounded-lg border p-6">
          <p className="text-muted-foreground mb-4">
            The pressure coefficient (C<sub>p</sub>) describes the pressure distribution around the sphere:
          </p>

          <div className="bg-muted/50 mb-4 rounded-lg p-4 text-center font-mono text-lg">
            <span className="text-primary">
              C<sub>p</sub>
            </span>{" "}
            =
            <span className="text-secondary">
              {" "}
              (p - p<sub>∞</sub>)/(½ρV²)
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
              <div>
                <h5 className="text-foreground font-medium">Stagnation Point (θ = 0°)</h5>
                <p className="text-muted-foreground text-sm">
                  C<sub>p</sub> = 1 (maximum pressure)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-secondary mt-2 h-2 w-2 rounded-full"></div>
              <div>
                <h5 className="text-foreground font-medium">Equator (θ = 90°)</h5>
                <p className="text-muted-foreground text-sm">
                  C<sub>p</sub> = -5/4 (minimum pressure in potential flow)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-accent mt-2 h-2 w-2 rounded-full"></div>
              <div>
                <h5 className="text-foreground font-medium">
                  Wake Region (θ &gt; θ<sub>sep</sub>)
                </h5>
                <p className="text-muted-foreground text-sm">
                  C<sub>p</sub> ≈ -0.5 (constant pressure in separated region)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separation and Wake */}
      <div className="space-y-4">
        <h3 className="text-foreground text-xl font-semibold">Flow Separation and Wake Formation</h3>

        <div className="bg-card border-border rounded-lg border p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-foreground mb-3 font-semibold">Separation Angle</h4>
              <p className="text-muted-foreground mb-3 text-sm">
                The angle where the boundary layer separates from the sphere surface:
              </p>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>
                  • <strong>Stokes Flow:</strong> No separation (θ<sub>sep</sub> = 180°)
                </li>
                <li>
                  • <strong>Subcritical:</strong> θ<sub>sep</sub> ≈ 120°
                </li>
                <li>
                  • <strong>Critical:</strong> θ<sub>sep</sub> ≈ 100°
                </li>
                <li>
                  • <strong>Supercritical:</strong> θ<sub>sep</sub> ≈ 80°
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Wake Characteristics</h4>
              <p className="text-muted-foreground mb-3 text-sm">Wake length and structure depend on Reynolds number:</p>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>
                  • <strong>Low Re:</strong> Long, laminar wake
                </li>
                <li>
                  • <strong>Medium Re:</strong> Vortex shedding begins
                </li>
                <li>
                  • <strong>High Re:</strong> Turbulent wake, shorter length
                </li>
                <li>
                  • <strong>Very High Re:</strong> Compact turbulent wake
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="space-y-4">
        <h3 className="text-foreground text-xl font-semibold">Aerospace Applications</h3>

        <div className="bg-card border-border rounded-lg border p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-foreground mb-3 font-semibold">Re-entry Vehicles</h4>
              <p className="text-muted-foreground text-sm">
                Spherical capsules experience varying drag coefficients during atmospheric re-entry as Reynolds number
                changes with altitude and velocity.
              </p>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Parachutes</h4>
              <p className="text-muted-foreground text-sm">
                Parachute canopies can be approximated as spheres for preliminary drag calculations and deployment
                analysis.
              </p>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Ballistics</h4>
              <p className="text-muted-foreground text-sm">
                Projectiles and bullets experience sphere-like drag characteristics, especially in the transonic regime.
              </p>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Sports Aerodynamics</h4>
              <p className="text-muted-foreground text-sm">
                Golf balls, baseballs, and other spherical objects in sports exhibit complex flow patterns affecting
                their trajectories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Limitations */}
      <div className="space-y-4">
        <h3 className="text-foreground text-xl font-semibold">Limitations and Assumptions</h3>

        <div className="bg-card border-border rounded-lg border p-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-warning mt-2 h-2 w-2 rounded-full"></div>
              <div>
                <h5 className="text-foreground font-medium">Steady Flow Assumption</h5>
                <p className="text-muted-foreground text-sm">
                  Calculations assume steady, uniform flow. Unsteady effects like vortex shedding are not included in
                  the drag coefficient correlations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-warning mt-2 h-2 w-2 rounded-full"></div>
              <div>
                <h5 className="text-foreground font-medium">Smooth Surface</h5>
                <p className="text-muted-foreground text-sm">
                  Assumes perfectly smooth sphere surface. Surface roughness significantly affects transition to
                  turbulent flow and drag characteristics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-warning mt-2 h-2 w-2 rounded-full"></div>
              <div>
                <h5 className="text-foreground font-medium">Infinite Domain</h5>
                <p className="text-muted-foreground text-sm">
                  Assumes sphere in infinite fluid domain. Wall effects and finite domain constraints are not
                  considered.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-warning mt-2 h-2 w-2 rounded-full"></div>
              <div>
                <h5 className="text-foreground font-medium">Temperature Effects</h5>
                <p className="text-muted-foreground text-sm">
                  Fluid properties are calculated at specified temperature, but compressibility effects are not included
                  for high-speed flows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="space-y-4">
        <h3 className="text-foreground text-xl font-semibold">References</h3>

        <div className="bg-card border-border rounded-lg border p-6">
          <div className="text-muted-foreground space-y-2 text-sm">
            <p>
              • Clift, R., Grace, J.R., & Weber, M.E. (1978). <em>Bubbles, Drops, and Particles</em>. Academic Press.
            </p>
            <p>
              • Schiller, L., & Naumann, A. (1933).{" "}
              <em>Über die grundlegenden Berechnungen bei der Schwerkraftaufbereitung</em>. Z. Ver. Deutsch. Ing., 77,
              318-320.
            </p>
            <p>
              • White, F.M. (2011). <em>Fluid Mechanics</em> (7th ed.). McGraw-Hill.
            </p>
            <p>
              • Anderson, J.D. (2017). <em>Fundamentals of Aerodynamics</em> (6th ed.). McGraw-Hill.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
