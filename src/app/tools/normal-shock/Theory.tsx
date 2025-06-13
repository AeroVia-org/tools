export default function NormalShockTheory() {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Normal Shock Theory</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">What is a Normal Shock Wave?</h3>
          <p className="text-gray-600 dark:text-gray-300">
            A normal shock wave is a thin, nearly discontinuous region where flow properties change abruptly. It occurs
            when:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-300">
            <li>Supersonic flow (M₁ &gt; 1) transitions to subsonic flow (M₂ &lt; 1)</li>
            <li>The shock front is perpendicular to the flow direction</li>
            <li>Properties change significantly across a very short distance</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Key Normal Shock Properties</h3>
          <ul className="list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-300">
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
        <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Applications</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Supersonic Inlets</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Normal shocks occur in supersonic aircraft inlets, slowing airflow to subsonic speeds for the engine.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Wind Tunnels</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Used in supersonic wind tunnel design and for experimental measurements of supersonic flow.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Pitot Tubes</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Pitot tubes in supersonic flow create normal shocks, allowing Mach number determination from pressure
              measurements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
