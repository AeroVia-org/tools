export default function MachCalculatorTheory() {
  return (
    <div className="border-border bg-card mt-8 rounded-lg border p-6 shadow-lg">
      <h3 className="text-foreground mb-4 text-lg font-semibold">About Mach Number</h3>
      <div className="text-muted-foreground space-y-3 text-sm">
        <p>
          The Mach number (M) is the ratio of an object&apos;s speed to the local speed of sound. It is named after
          Austrian physicist Ernst Mach.
        </p>
        <p>
          The speed of sound varies with altitude due to changes in air temperature and density. At sea level on a
          standard day, the speed of sound is approximately 343 m/s (1,235 km/h).
        </p>
        <p>Flight regimes based on Mach number:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium">Subsonic:</span> M &lt; 0.8
          </li>
          <li>
            <span className="font-medium">Transonic:</span> 0.8 ≤ M &lt; 1.0
          </li>
          <li>
            <span className="font-medium">Supersonic:</span> 1.0 ≤ M &lt; 3.0
          </li>
          <li>
            <span className="font-medium">High Supersonic:</span> 3.0 ≤ M &lt; 5.0
          </li>
          <li>
            <span className="font-medium">Hypersonic:</span> 5.0 ≤ M &lt; 10.0
          </li>
          <li>
            <span className="font-medium">High Hypersonic:</span> M ≥ 10.0
          </li>
        </ul>
        <p>
          This calculator uses the International Standard Atmosphere (ISA) model to determine local air properties at
          the specified altitude.
        </p>
      </div>
    </div>
  );
}
