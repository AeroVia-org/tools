export default function OrbitalCalculatorTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-lg">
      <h3 className="text-foreground mb-2 text-lg font-semibold">Calculation Notes & Theory</h3>
      <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
        <li>Calculations are for circular orbits around Earth.</li>
        <li>Assumes a perfectly spherical Earth with standard gravitational parameter (μ = GM) and radius.</li>
        <li>
          Does not account for atmospheric drag, gravitational anomalies, or perturbations from other celestial bodies
          (like the Moon or Sun).
        </li>
        <li>
          <strong>Velocity</strong> is the tangential speed required to maintain the circular orbit, calculated as v =
          √(μ / r), where r is the orbital radius (Earth radius + altitude).
        </li>
        <li>
          <strong>Period</strong> is the time taken to complete one full orbit, calculated as T = 2π √(r³ / μ).
        </li>
      </ul>
    </div>
  );
}
