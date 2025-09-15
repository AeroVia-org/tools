export default function NormalShockTheory() {
  return (
    <div className="border-border bg-card mt-6 rounded-lg border p-4 shadow-lg sm:p-6">
      <h2 className="text-foreground mb-4 text-xl font-semibold">Normal Shock Theory</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-foreground mb-2 text-lg font-medium">What is a Normal Shock Wave?</h3>
          <p className="text-muted-foreground">
            A normal shock wave is a thin, nearly discontinuous region where flow properties change abruptly. It occurs
            when:
          </p>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5">
            <li>Supersonic flow (M₁ &gt; 1) transitions to subsonic flow (M₂ &lt; 1)</li>
            <li>The shock front is perpendicular to the flow direction</li>
            <li>Properties change significantly across a very short distance</li>
          </ul>
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-lg font-medium">Key Normal Shock Properties</h3>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5">
            <li>Supersonic flow (M₁ &gt; 1) becomes subsonic (M₂ &lt; 1)</li>
            <li>Static pressure increases (p₂ &gt; p₁)</li>
            <li>Static temperature increases (T₂ &gt; T₁)</li>
            <li>Density increases (ρ₂ &gt; ρ₁)</li>
            <li>Total pressure decreases (p₀₂ &lt; p₀₁) due to entropy generation</li>
            <li>Total temperature remains constant (T₀₂ = T₀₁)</li>
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-foreground mb-2 text-lg font-medium">Applications</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="border-border bg-card rounded-lg border p-3 shadow-sm">
            <h4 className="text-foreground text-md font-medium">Supersonic Inlets</h4>
            <p className="text-muted-foreground mt-1 text-sm">
              Normal shocks occur in supersonic aircraft inlets, slowing airflow to subsonic speeds for the engine.
            </p>
          </div>
          <div className="border-border bg-card rounded-lg border p-3 shadow-sm">
            <h4 className="text-foreground text-md font-medium">Wind Tunnels</h4>
            <p className="text-muted-foreground mt-1 text-sm">
              Used in supersonic wind tunnel design and for experimental measurements of supersonic flow.
            </p>
          </div>
          <div className="border-border bg-card rounded-lg border p-3 shadow-sm">
            <h4 className="text-foreground text-md font-medium">Pitot Tubes</h4>
            <p className="text-muted-foreground mt-1 text-sm">
              Pitot tubes in supersonic flow create normal shocks, allowing Mach number determination from pressure
              measurements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
