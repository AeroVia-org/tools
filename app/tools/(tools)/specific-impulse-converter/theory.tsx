export default function SpecificImpulseTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-lg">
      <h3 className="text-foreground mb-2 text-lg font-semibold">Specific Impulse Theory & Notes</h3>

      <div className="text-muted-foreground space-y-4 text-sm">
        <div>
          <h4 className="text-foreground mb-2 font-medium">Definition</h4>
          <p>
            <strong>Specific Impulse (Isp)</strong> is a measure of how efficiently a rocket engine uses propellant. It
            represents the impulse (change in momentum) produced per unit of propellant mass consumed.
          </p>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Mathematical Relationships</h4>
          <div className="bg-muted/50 rounded-md p-3 font-mono text-xs">
            <div className="mb-2">
              <strong>Primary Formula:</strong> Isp = F / (ṁ × g₀)
            </div>
            <div className="mb-2">
              <strong>Where:</strong>
            </div>
            <div className="ml-4 space-y-1">
              <div>F = Thrust force (N)</div>
              <div>ṁ = Mass flow rate (kg/s)</div>
              <div>g₀ = Standard gravity = 9.80665 m/s²</div>
            </div>
            <div className="mt-3">
              <strong>Effective Exhaust Velocity:</strong> vₑ = Isp × g₀
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Unit Conversions</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Seconds:</strong> Isp in seconds (most common unit)
            </li>
            <li>
              <strong>m/s:</strong> Effective exhaust velocity = Isp × 9.80665
            </li>
            <li>
              <strong>ft/s:</strong> Effective exhaust velocity in feet per second = Isp × 32.174
            </li>
            <li>
              <strong>km/s:</strong> Effective exhaust velocity in kilometers per second = Isp × 0.00980665
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Physical Interpretation</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>Higher Isp means more efficient propellant usage</li>
            <li>Isp represents the &quot;gas mileage&quot; of a rocket engine</li>
            <li>Directly related to exhaust velocity - faster exhaust = higher Isp</li>
            <li>Affects mission delta-v capability through the rocket equation</li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Performance Categories</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>
              <span>
                <strong>&lt; 200s:</strong> Low performance (cold gas, some monopropellants)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-orange-500"></span>
              <span>
                <strong>200-300s:</strong> Moderate performance (hydrazine, basic bipropellants)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
              <span>
                <strong>300-400s:</strong> Good performance (LOX/RP-1, LOX/LH2)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
              <span>
                <strong>400-500s:</strong> High performance (optimized LOX/LH2)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
              <span>
                <strong>500-1000s:</strong> Very high performance (electric propulsion)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span>
              <span>
                <strong>&gt; 1000s:</strong> Exceptional performance (advanced electric, nuclear)
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Common Applications</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Cold Gas:</strong> 150-200s - Simple, reliable, low thrust
            </li>
            <li>
              <strong>Monopropellant:</strong> 200-250s - Hydrazine for satellites
            </li>
            <li>
              <strong>Bipropellant:</strong> 300-450s - Most launch vehicles and spacecraft
            </li>
            <li>
              <strong>Electric Propulsion:</strong> 1000-5000s - Deep space missions, station keeping
            </li>
            <li>
              <strong>Nuclear Thermal:</strong> 800-1000s - Proposed for Mars missions
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Design Considerations</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>Higher Isp requires more complex engine designs</li>
            <li>Electric propulsion has high Isp but low thrust</li>
            <li>Chemical rockets balance Isp with thrust requirements</li>
            <li>Mission requirements determine optimal Isp range</li>
            <li>Cost and complexity increase with higher performance</li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground mb-2 font-medium">Historical Context</h4>
          <p>
            The concept of specific impulse was developed in the early days of rocketry to compare different propellant
            combinations. It remains one of the most important metrics for evaluating propulsion system performance and
            mission feasibility.
          </p>
        </div>
      </div>
    </div>
  );
}
