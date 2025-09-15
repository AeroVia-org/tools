import {
  FaPlaneDeparture,
  FaWind,
  FaCalculator,
  FaRuler,
  FaTachometerAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Theory() {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <h2 className="text-foreground mb-6 text-2xl font-bold">Aerodynamic Theory</h2>

      <div className="space-y-8">
        {/* Basic Concepts */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaPlaneDeparture className="text-primary" />
            Basic Aerodynamic Concepts
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Lift and drag are the two primary aerodynamic forces acting on an aircraft. Lift is the force that keeps
              the aircraft airborne, while drag opposes the aircraft&apos;s motion through the air. Both forces are
              calculated using similar equations based on the dynamic pressure and aerodynamic coefficients.
            </p>
            <p>The fundamental equations for lift and drag are:</p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div>L = CL × q × S</div>
              <div>D = CD × q × S</div>
              <div>where: q = ½ × ρ × V² (dynamic pressure)</div>
            </div>
            <p>
              Where L is lift force, D is drag force, CL is the lift coefficient, CD is the drag coefficient, q is the
              dynamic pressure, ρ is air density, V is velocity, and S is the wing reference area.
            </p>
          </div>
        </section>

        {/* Lift Coefficient */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaCalculator className="text-primary" />
            Lift Coefficient (CL)
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              The lift coefficient is a dimensionless parameter that characterizes the lift-generating capability of an
              airfoil. It depends primarily on the angle of attack and the airfoil&apos;s geometric characteristics.
            </p>
            <p>In the linear region (before stall), the lift coefficient follows the relationship:</p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div>CL = CL0 + CLα × (α - α0)</div>
            </div>
            <p>
              Where CL0 is the zero-lift angle coefficient, CLα is the lift curve slope (approximately 2π per radian), α
              is the angle of attack, and α0 is the zero-lift angle of attack.
            </p>
            <p>
              Beyond the stall angle, the lift coefficient decreases due to flow separation, and the relationship
              becomes more complex and less predictable.
            </p>
          </div>
        </section>

        {/* Drag Coefficient */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaWind className="text-primary" />
            Drag Coefficient (CD)
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              The drag coefficient represents the drag characteristics of an airfoil and is typically modeled using the
              drag polar equation:
            </p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div>CD = CD0 + CL² / (π × AR × e)</div>
            </div>
            <p>
              Where CD0 is the zero-lift drag coefficient (parasitic drag), AR is the aspect ratio (b²/S), e is the
              Oswald efficiency factor, and CL is the lift coefficient.
            </p>
            <p>This equation shows that drag consists of two components:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Parasitic drag (CD0):</strong> Independent of lift, includes skin friction, form drag, and
                interference drag
              </li>
              <li>
                <strong>Induced drag (CL²/πAR×e):</strong> Proportional to the square of lift coefficient, caused by the
                generation of lift and the creation of trailing vortices
              </li>
            </ul>
          </div>
        </section>

        {/* Aspect Ratio */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaRuler className="text-primary" />
            Aspect Ratio Effects
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>The aspect ratio (AR) is defined as the square of the wingspan divided by the wing area:</p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div>AR = b² / S</div>
            </div>
            <p>Higher aspect ratios generally result in:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Lower induced drag for a given lift coefficient</li>
              <li>Higher maximum lift-to-drag ratio</li>
              <li>Better efficiency for long-range flight</li>
              <li>Reduced stall speed</li>
            </ul>
            <p>
              However, high aspect ratio wings also have disadvantages such as increased structural weight and reduced
              maneuverability.
            </p>
          </div>
        </section>

        {/* Lift-to-Drag Ratio */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaCalculator className="text-primary" />
            Lift-to-Drag Ratio (L/D)
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              The lift-to-drag ratio is a key performance parameter that indicates the aerodynamic efficiency of an
              aircraft. It represents how much lift is generated per unit of drag.
            </p>
            <p>The maximum lift-to-drag ratio occurs at the optimal lift coefficient, which can be calculated as:</p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div>CL_opt = √(CD0 × π × AR × e)</div>
              <div>(L/D)_max = √(π × AR × e) / (2 × √CD0)</div>
            </div>
            <p>
              This shows that maximum L/D ratio increases with aspect ratio and Oswald efficiency factor, and decreases
              with zero-lift drag coefficient.
            </p>
            <p>
              The optimal angle of attack for maximum L/D can be found by converting the optimal lift coefficient back
              to angle of attack using the lift curve slope.
            </p>
          </div>
        </section>

        {/* Stall Speed */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaTachometerAlt className="text-primary" />
            Stall Speed
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Stall speed is the minimum speed at which an aircraft can maintain level flight. It occurs when the
              aircraft reaches its maximum lift coefficient (CLmax).
            </p>
            <p>The stall speed can be calculated from the lift equation:</p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div>V_stall = √(2W / (ρ × S × CLmax))</div>
            </div>
            <p>
              Where W is the aircraft weight, ρ is air density, S is wing area, and CLmax is the maximum lift
              coefficient.
            </p>
            <p>
              Stall speed increases with aircraft weight and decreases with wing area, air density, and maximum lift
              coefficient. This is why aircraft have higher stall speeds at higher altitudes and when carrying more
              weight.
            </p>
          </div>
        </section>

        {/* Limitations and Assumptions */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaExclamationTriangle className="text-primary" />
            Limitations and Assumptions
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              This calculator uses simplified aerodynamic models suitable for preliminary design and educational
              purposes. Several important limitations should be noted:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Linear lift curve:</strong> Assumes a constant lift curve slope of 2π per radian, which is valid
                for thin airfoils at low angles of attack
              </li>
              <li>
                <strong>Simplified stall model:</strong> Post-stall behavior is approximated and may not accurately
                represent real airfoil characteristics
              </li>
              <li>
                <strong>Two-dimensional flow:</strong> Does not account for three-dimensional effects such as wing tip
                vortices and spanwise flow
              </li>
              <li>
                <strong>Reynolds number effects:</strong> Does not consider how Reynolds number affects airfoil
                performance
              </li>
              <li>
                <strong>Compressibility effects:</strong> Assumes incompressible flow, which is valid for speeds below
                approximately Mach 0.3
              </li>
              <li>
                <strong>Clean configuration:</strong> Does not account for flaps, landing gear, or other configuration
                changes
              </li>
            </ul>
            <p>
              For more accurate results, especially for detailed design work, consider using more sophisticated
              aerodynamic analysis tools that account for these effects.
            </p>
          </div>
        </section>

        {/* References */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">References</h3>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              <strong>Anderson, J. D.</strong> (2016). &quot;Fundamentals of Aerodynamics&quot; (6th ed.). McGraw-Hill
              Education.
            </p>
            <p>
              <strong>McCormick, B. W.</strong> (1995). &quot;Aerodynamics, Aeronautics, and Flight Mechanics&quot; (2nd
              ed.). Wiley.
            </p>
            <p>
              <strong>Raymer, D. P.</strong> (2018). &quot;Aircraft Design: A Conceptual Approach&quot; (6th ed.). AIAA
              Education Series.
            </p>
            <p>
              <strong>Abbott, I. H., & von Doenhoff, A. E.</strong> (1959). &quot;Theory of Wing Sections: Including a
              Summary of Airfoil Data&quot;. Dover Publications.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
