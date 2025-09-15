export default function DeltaVBudgetTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-lg">
      <h3 className="text-foreground mb-2 text-lg font-semibold">Delta-V Budget Theory & Notes</h3>

      <div className="text-muted-foreground space-y-4 text-sm">
        <div>
          <h4 className="text-foreground mb-2 font-medium">Definition</h4>
          <p>
            <strong>Delta-V (Δv)</strong> is the change in velocity required for a spacecraft to perform a maneuver or
            reach a destination. It represents the total velocity change needed throughout a mission and is a key metric
            for mission planning and spacecraft design.
          </p>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Mathematical Foundation</h4>
          <div className="bg-muted/50 rounded-md p-3 font-mono text-xs">
            <div className="mb-2">
              <strong>Tsiolkovsky Rocket Equation:</strong> Δv = vₑ × ln(m₀/m₁)
            </div>
            <div className="mb-2">
              <strong>Where:</strong>
            </div>
            <div className="ml-4 space-y-1">
              <div>vₑ = Effective exhaust velocity (m/s)</div>
              <div>m₀ = Initial mass (wet mass)</div>
              <div>m₁ = Final mass (dry mass)</div>
              <div>ln = Natural logarithm</div>
            </div>
            <div className="mt-3">
              <strong>Total Mission Δv:</strong> Δv_total = Σ(Δv_i) for all mission phases
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Mission Phase Categories</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>
              <span>
                <strong>Launch:</strong> Earth surface to orbit (typically 7,500-9,500 m/s)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
              <span>
                <strong>Transfer:</strong> Orbit-to-orbit maneuvers (varies widely)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
              <span>
                <strong>Orbital:</strong> In-orbit maneuvers, station keeping, plane changes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-orange-500"></span>
              <span>
                <strong>Landing:</strong> Descent and landing maneuvers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span>
              <span>
                <strong>Other:</strong> Attitude control, rendezvous, emergency maneuvers
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Common Delta-V Values</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Launch to LEO:</strong> ~9,400 m/s (Earth surface to 200km orbit)
            </li>
            <li>
              <strong>LEO to GTO:</strong> ~2,400 m/s (Low Earth to Geostationary Transfer Orbit)
            </li>
            <li>
              <strong>GTO to GEO:</strong> ~1,500 m/s (Transfer to Geostationary Orbit)
            </li>
            <li>
              <strong>LEO to Moon:</strong> ~3,200 m/s (Earth orbit to lunar orbit)
            </li>
            <li>
              <strong>Moon Landing:</strong> ~1,800 m/s (Lunar orbit to surface)
            </li>
            <li>
              <strong>LEO to Mars:</strong> ~3,600 m/s (Earth orbit to Mars transfer)
            </li>
            <li>
              <strong>Mars Landing:</strong> ~2,000 m/s (Mars orbit to surface)
            </li>
            <li>
              <strong>Station Keeping:</strong> ~50 m/s/year (GEO satellite maintenance)
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Budget Planning Principles</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Conservative Margins:</strong> Add 10-30% margin for uncertainties
            </li>
            <li>
              <strong>Phase Prioritization:</strong> Critical phases get higher margins
            </li>
            <li>
              <strong>Propellant Reserves:</strong> Maintain emergency reserves
            </li>
            <li>
              <strong>System Limitations:</strong> Consider propulsion system capabilities
            </li>
            <li>
              <strong>Mission Flexibility:</strong> Allow for trajectory optimization
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Complexity Assessment</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
              <span>
                <strong>&lt; 2,000 m/s:</strong> Low complexity (simple missions)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
              <span>
                <strong>2,000-5,000 m/s:</strong> Moderate complexity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-orange-500"></span>
              <span>
                <strong>5,000-10,000 m/s:</strong> High complexity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>
              <span>
                <strong>10,000-20,000 m/s:</strong> Very high complexity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span>
              <span>
                <strong>&gt; 20,000 m/s:</strong> Extreme complexity
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Design Implications</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Propellant Mass:</strong> Higher Δv requires more propellant
            </li>
            <li>
              <strong>Propulsion Systems:</strong> May require multiple engine types
            </li>
            <li>
              <strong>Mission Architecture:</strong> Influences staging and design
            </li>
            <li>
              <strong>Cost and Risk:</strong> Higher complexity increases both
            </li>
            <li>
              <strong>Technology Requirements:</strong> May need advanced propulsion
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Optimization Strategies</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Gravity Assists:</strong> Use planetary flybys to reduce Δv
            </li>
            <li>
              <strong>Aerobraking:</strong> Use atmospheric drag for orbit insertion
            </li>
            <li>
              <strong>Electric Propulsion:</strong> High Isp for long-duration burns
            </li>
            <li>
              <strong>In-Situ Resources:</strong> Refuel at destination
            </li>
            <li>
              <strong>Trajectory Optimization:</strong> Minimize total mission Δv
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Historical Context</h4>
          <p>
            Delta-v budgeting became essential with the space age, starting with early satellite missions. The Apollo
            program demonstrated the importance of careful Δv planning for complex multi-phase missions. Modern missions
            like Mars rovers and deep space probes rely heavily on accurate Δv budgets for mission success.
          </p>
        </div>
      </div>
    </div>
  );
}
