export default function PropellantMassFractionTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-lg">
      <h3 className="text-foreground mb-2 text-lg font-semibold">Propellant Mass Fraction Theory & Notes</h3>
      <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
        <li>
          The <strong>Propellant Mass Fraction (PMF)</strong> is a measure of the vehicle&apos;s performance, indicating
          how much of the total mass is propellant.
        </li>
        <li>
          It is defined as the ratio of the propellant mass (<code>m_p</code>) to the initial (total) mass (
          <code>m_0</code>) of the vehicle.
        </li>
        <li>
          Formula: <code>PMF = m_p / m_0 = m_p / (m_s + m_p)</code>, where <code>m_s</code> is the structural mass (dry
          mass).
        </li>
        <li>A higher PMF generally means a more efficient design, as more mass is dedicated to fuel than structure.</li>
        <li>
          This value is crucial for calculating the performance capabilities using the Tsiolkovsky rocket equation.
        </li>
      </ul>
    </div>
  );
}
