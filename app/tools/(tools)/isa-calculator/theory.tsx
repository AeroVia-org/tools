export default function IsaCalculatorTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <h3 className="text-foreground mb-4 text-lg font-semibold">About the ISA Model</h3>
      <div className="text-muted-foreground space-y-3 text-sm">
        <p>
          The International Standard Atmosphere (ISA) is an idealized model representing average atmospheric conditions
          (temperature, pressure, density) at different altitudes. It provides a common reference for aviation,
          aerospace engineering, and meteorology.
        </p>
        <p>Key features of the ISA model:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Defines standard sea level conditions: Temperature 15°C (288.15 K), Pressure 1013.25 hPa (101325 Pa),
            Density 1.225 kg/m³.
          </li>
          <li>
            Divides the atmosphere into layers with defined temperature lapse rates (how temperature changes with
            altitude):
            <ul className="list-circle mt-1 ml-4 space-y-1 text-xs">
              <li>
                <strong>Troposphere (0-11km):</strong> Temperature decreases linearly at 6.5°C/km from 15°C at sea level
                to -56.5°C at the tropopause.
              </li>
              <li>
                <strong>Tropopause (11-20km):</strong> Constant temperature layer at -56.5°C.
              </li>
              <li>
                <strong>Stratosphere I (20-32km):</strong> Temperature increases at 1.0°C/km.
              </li>
              <li>
                <strong>Stratosphere II (32-47km):</strong> Temperature increases at 2.8°C/km up to -2.5°C.
              </li>
              <li>
                <strong>Stratopause (47-51km):</strong> Constant temperature layer at -2.5°C.
              </li>
              <li>
                <strong>Mesosphere I (51-71km):</strong> Temperature decreases at 2.8°C/km.
              </li>
              <li>
                <strong>Mesosphere II (71-84.85km):</strong> Temperature decreases at 2.0°C/km to -86.2°C.
              </li>
            </ul>
          </li>
          <li>Assumes dry air, constant chemical composition, and gravity that only varies with altitude.</li>
          <li>Provides equations to calculate properties at any given geometric altitude up to 86 km.</li>
        </ul>
        <p>
          This calculator implements the ISA model equations to find atmospheric properties based on a given altitude,
          pressure, or temperature. Inversions (calculating altitude from pressure or temperature) may have limitations,
          especially in isothermal layers.
        </p>
      </div>
    </div>
  );
}
