export default function PropellantMassFractionTheory() {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Propellant Mass Fraction Theory & Notes
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
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
