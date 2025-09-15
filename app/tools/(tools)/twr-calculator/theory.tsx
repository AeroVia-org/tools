export default function TWRTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-lg">
      <h3 className="text-foreground mb-2 text-lg font-semibold">Thrust-to-Weight Ratio Theory & Notes</h3>
      <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
        <li>
          The <strong>Thrust-to-Weight Ratio (TWR)</strong> is a dimensionless parameter that compares the thrust force
          produced by an engine to the weight of the vehicle.
        </li>
        <li>
          It is defined as the ratio of thrust (<code>T</code>) to weight (<code>W</code>):{" "}
          <code>TWR = T / W = T / (m × g)</code>
        </li>
        <li>
          Where <code>m</code> is the mass of the vehicle and <code>g</code> is the gravitational acceleration (9.80665
          m/s² on Earth).
        </li>
        <li>
          <strong>TWR &gt; 1:</strong> The vehicle can accelerate vertically upward and hover in place.
        </li>
        <li>
          <strong>TWR = 1:</strong> The vehicle can hover but cannot accelerate vertically upward.
        </li>
        <li>
          <strong>TWR &lt; 1:</strong> The vehicle cannot hover or take off vertically; it requires horizontal motion
          for lift (like airplanes).
        </li>
        <li>
          For rockets, TWR typically ranges from 1.2 to 2.0 at liftoff, allowing for acceleration against gravity and
          atmospheric drag.
        </li>
        <li>
          For aircraft, TWR is usually much less than 1, as they rely on aerodynamic lift rather than thrust for
          vertical support.
        </li>
        <li>
          Higher TWR values provide better acceleration and maneuverability but require more powerful engines and more
          fuel consumption.
        </li>
        <li>
          The TWR changes during flight as fuel is consumed and mass decreases, often improving throughout the flight
          for rockets.
        </li>
      </ul>
    </div>
  );
}
