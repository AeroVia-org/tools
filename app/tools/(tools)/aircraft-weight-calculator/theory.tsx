import {
  FaBalanceScale,
  FaPlaneDeparture,
  FaCalculator,
  FaRuler,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";

export default function Theory() {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <h2 className="text-foreground mb-6 text-2xl font-bold">Aircraft Weight & Mission Analysis</h2>

      <div className="space-y-8">
        {/* Basic Concepts */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaBalanceScale className="text-primary" />
            Weight Breakdown Fundamentals
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Aircraft weight analysis underpins sizing, performance, and mission planning. The takeoff weight (W₀) is
              the sum of four primary components.
            </p>
            <p>The basic weight equation is:</p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div>W₀ = Wₑ + W_f + Wₚ + W_c</div>
              <div>where:</div>
              <div> W₀ = Takeoff weight</div>
              <div> Wₑ = Empty weight (structure + systems)</div>
              <div> W_f = Fuel weight (mission + reserves)</div>
              <div> Wₚ = Payload weight (passengers + cargo)</div>
              <div> W_c = Crew weight</div>
            </div>
            <p>
              Fractions vary by aircraft type and mission. Constraints like MTOW, MZFW, and maximum usable fuel further
              bound feasible combinations.
            </p>
          </div>
        </section>

        {/* Weight Fractions */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaCalculator className="text-primary" />
            Weight Fraction Analysis
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Weight fractions are dimensionless ratios that express each weight component as a percentage of takeoff
              weight. These fractions are crucial for aircraft design and performance analysis.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Empty Weight Fraction (Wₑ/W₀)</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Commercial airliners: ~45–50%</li>
                  <li>• Business jets: ~50–55%</li>
                  <li>• Military fighters: ~55–65%</li>
                  <li>• General aviation: ~60–70%</li>
                  <li>• UAVs: ~65–75%</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Fuel Weight Fraction (W_f/W₀)</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Short range: ~15–25%</li>
                  <li>• Medium range: ~25–35%</li>
                  <li>• Long range: ~35–45%</li>
                  <li>• Ferry: ~40–50%</li>
                  <li>• Endurance: ~20–30%</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Payload Weight Fraction (Wₚ/W₀)</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Commercial airliners: ~20–30%</li>
                  <li>• Cargo aircraft: ~30–40%</li>
                  <li>• Business jets: ~10–20%</li>
                  <li>• Military transport: ~15–25%</li>
                  <li>• General aviation: ~5–15%</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Crew Weight Fraction (W_c/W₀)</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Single pilot: ~2–3%</li>
                  <li>• Two pilots: ~3–5%</li>
                  <li>• Commercial crew: ~4–6%</li>
                  <li>• Military crew: ~3–7%</li>
                  <li>• UAVs: ~0–2%</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Analysis */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaChartLine className="text-primary" />
            Mission Model & Range–Payload Analysis
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              We model missions with simple segments: pre-cruise (taxi/takeoff/climb), cruise, post-cruise
              (descent/approach/landing), and reserves. Cruise and loiter use Breguet relations; other segments are
              represented by multiplicative fuel fractions.
            </p>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="mb-2 font-semibold">Range–Payload Diagram Structure</h4>
              <div className="space-y-2 text-sm">
                <p>The range–payload diagram (the “elbow chart”) shows the trade-off between payload and range:</p>
                <div className="space-y-1 font-mono text-xs">
                  <div>
                    <strong>A–B:</strong> Maximum payload (horizontal)
                  </div>
                  <div>• Operates at MZFW limit (structure-bound)</div>
                  <div>• Payload constant, range increases by adding fuel</div>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div>
                    <strong>B–C:</strong> Payload–range trade-off (descending)
                  </div>
                  <div>• Operates at MTOW (weight-bound)</div>
                  <div>• Range increases by trading payload for fuel</div>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div>
                    <strong>C–D:</strong> Maximum (ferry) range (horizontal)
                  </div>
                  <div>• Zero payload, maximum fuel capacity</div>
                  <div>• Ferry flight configuration</div>
                  <div>• Limited by fuel tank capacity</div>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="mb-2 font-semibold">Range Equation</h4>
              <div className="space-y-1 font-mono text-sm">
                <div>R = (V/c) × (L/D) × ln(Wᵢ/Wf)</div>
                <div>where:</div>
                <div> R = Range</div>
                <div> V = Cruise velocity</div>
                <div> c = Specific fuel consumption</div>
                <div> L/D = Lift-to-drag ratio</div>
                <div> Wᵢ = Initial weight (start of cruise)</div>
                <div> Wf = Final weight (end of cruise)</div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="mb-2 font-semibold">Endurance (Loiter) Equation</h4>
              <div className="space-y-1 font-mono text-sm">
                <div>E = (1/c) × (L/D) × ln(Wᵢ/Wf)</div>
              </div>
            </div>

            <p>Range increases with:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Higher cruise velocity (V)</li>
              <li>Better aerodynamic efficiency (L/D)</li>
              <li>Lower fuel consumption (c)</li>
              <li>Higher fuel fraction (Wₓ/W₀)</li>
            </ul>

            <p>
              We combine segment effects with multiplicative fuel fractions: f_total = f_pre × f_cruise × f_post ×
              f_res. This is simple yet captures the key trade-offs for preliminary sizing.
            </p>
          </div>
        </section>

        {/* Aircraft Type Characteristics */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaPlaneDeparture className="text-primary" />
            Aircraft Type Characteristics
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Different aircraft types have distinct weight fraction characteristics based on their design mission and
              operational requirements.
            </p>

            <div className="space-y-4">
              <div className="border-border border-l-4 pl-4">
                <h4 className="font-semibold">Commercial Airliners</h4>
                <p className="text-xs">
                  Optimized for passenger transport with high payload fractions. Empty weight fraction is moderate due
                  to structural requirements for passenger comfort and safety.
                </p>
              </div>

              <div className="border-border border-l-4 pl-4">
                <h4 className="font-semibold">Business Jets</h4>
                <p className="text-xs">
                  Designed for long-range executive transport. Higher empty weight fraction due to luxury amenities, but
                  excellent fuel efficiency for extended range.
                </p>
              </div>

              <div className="border-border border-l-4 pl-4">
                <h4 className="font-semibold">Military Fighters</h4>
                <p className="text-xs">
                  High empty weight fraction due to advanced avionics, weapons systems, and structural requirements for
                  high-performance flight.
                </p>
              </div>

              <div className="border-border border-l-4 pl-4">
                <h4 className="font-semibold">Helicopters</h4>
                <p className="text-xs">
                  Unique weight distribution due to rotor system complexity. Higher empty weight fraction but excellent
                  payload capability for short-range missions.
                </p>
              </div>

              <div className="border-border border-l-4 pl-4">
                <h4 className="font-semibold">General Aviation</h4>
                <p className="text-xs">
                  Simple, lightweight designs with high empty weight fractions. Limited payload capacity but excellent
                  efficiency for personal and training use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Design Iteration Process */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaRuler className="text-primary" />
            Design Iteration Process
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Aircraft weight analysis is an iterative process that begins with mission requirements and evolves through
              multiple design cycles.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Mission Definition</h4>
                  <p className="text-xs">Define payload, range, and performance requirements</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Initial Weight Estimate</h4>
                  <p className="text-xs">Use statistical correlations to estimate takeoff weight</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Component Sizing</h4>
                  <p className="text-xs">Size engines, fuel tanks, and structural components</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Weight Calculation</h4>
                  <p className="text-xs">Calculate actual component weights and total weight</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold">Convergence Check</h4>
                  <p className="text-xs">Compare estimated vs. calculated weight, iterate if needed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Integration */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaTachometerAlt className="text-primary" />
            Performance Integration
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Aircraft weight directly affects all aspects of performance, making weight analysis integral to
              comprehensive aircraft design.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Takeoff Performance</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Higher weight requires longer takeoff distance</li>
                  <li>• Wing loading affects stall speed</li>
                  <li>• Thrust-to-weight ratio determines climb capability</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Cruise Performance</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Weight affects optimal cruise altitude</li>
                  <li>• Fuel consumption increases with weight</li>
                  <li>• Range decreases with higher weight</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Landing Performance</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Higher weight increases landing distance</li>
                  <li>• Approach speed increases with weight</li>
                  <li>• Brake energy requirements scale with weight</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Structural Design</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Higher weight requires stronger structure</li>
                  <li>• Wing loading affects wing design</li>
                  <li>• Landing gear sizing depends on weight</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Constraint & Regulatory Considerations */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaExclamationTriangle className="text-primary" />
            Constraints, Reserves & Safety
          </h3>
          <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>Weight analysis must respect structural and operational constraints and include regulatory reserves.</p>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Maximum Takeoff Weight (MTOW)</h4>
                <p className="text-xs">
                  Certified limit that cannot be exceeded. If computed TOW &gt; MTOW, fuel is reduced first, then
                  payload until feasible, as reflected in the range–payload curve and warnings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Center of Gravity Limits</h4>
                <p className="text-xs">
                  Weight distribution must maintain center of gravity within certified limits for safe flight
                  characteristics and controllability.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">MZFW & Max Fuel</h4>
                <p className="text-xs">
                  MZFW limits (empty + payload). Max fuel capacity limits usable fuel. Both affect the A–B, B–C, and C–D
                  segments of the range–payload diagram.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Reserve Fuel</h4>
                <p className="text-xs">
                  Modeled as a loiter reserve (minutes) using Breguet endurance. Real regulations (VFR/IFR, alternates,
                  weather) vary by jurisdiction and operation.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Payload Limitations</h4>
                <p className="text-xs">
                  Maximum payload capacity limited by structural strength, performance requirements, and operational
                  considerations.
                </p>
              </div>
            </div>
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
              This calculator uses simplified models suitable for preliminary design and educational purposes. Several
              important limitations should be noted:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Statistical correlations:</strong> Weight fractions are based on historical data and may not
                apply to novel aircraft configurations
              </li>
              <li>
                <strong>Mission simplification:</strong> Real missions involve complex flight profiles with multiple
                phases and varying conditions
              </li>
              <li>
                <strong>Performance integration:</strong> Does not account for detailed aerodynamic, propulsion, or
                structural analysis
              </li>
              <li>
                <strong>Regulatory compliance:</strong> Simplified reserve fuel and safety margin calculations
              </li>
              <li>
                <strong>Technology effects:</strong> Does not account for advanced materials, systems, or propulsion
                technologies
              </li>
              <li>
                <strong>Operational factors:</strong> Simplified treatment of maintenance, operational, and
                environmental considerations
              </li>
            </ul>
            <p>
              For detailed design work, especially for certification and production aircraft, consider using more
              sophisticated analysis tools and detailed component weight estimation methods.
            </p>
          </div>
        </section>

        {/* References */}
        <section>
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">References</h3>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              <strong>Raymer, D. P.</strong> (2018). &quot;Aircraft Design: A Conceptual Approach&quot; (6th ed.). AIAA
              Education Series.
            </p>
            <p>
              <strong>Roskam, J.</strong> (1985). &quot;Airplane Design&quot; (8 vols.). DARcorporation.
            </p>
            <p>
              <strong>Torenbeek, E.</strong> (2013). &quot;Advanced Aircraft Design: Conceptual Design, Analysis and
              Optimization of Subsonic Civil Airplanes&quot;. Wiley.
            </p>
            <p>
              <strong>Gudmundsson, S.</strong> (2014). &quot;General Aviation Aircraft Design: Applied Methods and
              Procedures&quot;. Butterworth-Heinemann.
            </p>
            <p>
              <strong>FAA.</strong> (2012). &quot;FAR Part 25: Airworthiness Standards: Transport Category
              Airplanes&quot;. Federal Aviation Administration.
            </p>
            <p>
              <strong>EASA.</strong> (2012). &quot;CS-25: Certification Specifications for Large Aeroplanes&quot;.
              European Aviation Safety Agency.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
