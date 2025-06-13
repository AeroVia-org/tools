export default function ObliqueShockTheory() {
  return (
    <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Understanding Oblique Shock Waves</h2>
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-gray-200">Introduction</h3>
          <p>
            Oblique shock waves are a fundamental phenomenon in supersonic aerodynamics. Unlike normal shock waves,
            which are perpendicular to the flow direction, oblique shocks are inclined at an angle. They occur when a
            supersonic flow (Mach number M₁ &gt; 1) encounters a sharp compressive corner or is deflected by an object,
            such as a wedge. This deflection forces the streamlines to turn, creating a thin region of abrupt changes in
            flow properties.
          </p>
          <p className="mt-2">
            Across an oblique shock, the static pressure, temperature, and density of the gas increase, while the Mach
            number decreases. However, unlike a normal shock where the downstream flow (M₂) is always subsonic, the flow
            after an oblique shock can be either supersonic (weak shock) or subsonic (strong shock), depending on the
            upstream Mach number and the deflection angle. The total temperature (T₀) remains constant across the shock,
            but the total pressure (p₀) decreases due to the irreversible nature of the shock (entropy increases).
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-medium text-gray-800 dark:text-gray-200">Key Parameters</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Upstream Mach Number (M₁):</strong> The Mach number of the flow before encountering the shock. It
              must be greater than 1.
            </li>
            <li>
              <strong>Deflection Angle (θ or δ):</strong> The angle through which the flow is turned by the corner or
              wedge. This is a primary input for calculations.
            </li>
            <li>
              <strong>Wave Angle (β or σ):</strong> The angle the shock wave makes with the direction of the upstream
              flow. β is always greater than the Mach angle (μ = arcsin(1/M₁)) and less than 90°.
            </li>
            <li>
              <strong>Specific Heat Ratio (γ - Gamma):</strong> A property of the gas, typically 1.4 for air.
            </li>
            <li>
              <strong>Downstream Mach Number (M₂):</strong> The Mach number of the flow after passing through the shock.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-medium text-gray-800 dark:text-gray-200">The θ-β-M Relationship</h3>
          <p>
            The relationship between the deflection angle (θ), wave angle (β), and upstream Mach number (M₁) is crucial
            for analyzing oblique shocks. It is given by the following equation:
          </p>
          <div className="my-3 overflow-x-auto rounded-md bg-gray-100 p-3 dark:bg-gray-900">
            <code className="text-sm">tan(θ) = 2 * cot(β) * [M₁² ⋅ sin²(β) - 1] / [M₁² ⋅ (γ + cos(2β)) + 2]</code>
          </div>
          <p>For a given M₁ and θ, this equation can have:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Two solutions for β:</strong> A smaller β corresponds to a &quot;weak&quot; shock (usually
              supersonic M₂), and a larger β corresponds to a &quot;strong&quot; shock (usually subsonic M₂). In
              external aerodynamics, the weak solution is most commonly observed.
            </li>
            <li>
              <strong>One solution for β:</strong> This occurs at the maximum deflection angle (θ<sub>max</sub>).
            </li>
            <li>
              <strong>No real solution for β:</strong> If θ &gt; θ<sub>max</sub>, the shock detaches from the corner and
              forms a curved bow shock ahead of the body.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-medium text-gray-800 dark:text-gray-200">Calculating Flow Properties</h3>
          <p>
            Once the wave angle β is determined, the properties downstream of the shock can be calculated. These
            calculations often involve treating the oblique shock as a normal shock with an upstream Mach number equal
            to the component of M₁ normal to the shock wave (M₁ₙ = M₁ ⋅ sin(β)).
          </p>
          <p className="mt-2">Key property ratios across the shock include:</p>
          <ul className="mt-2 list-disc space-y-3 pl-5">
            <li>
              <strong>Pressure Ratio (p₂/p₁):</strong>
              <div className="my-1 overflow-x-auto rounded-md bg-gray-100 p-2 dark:bg-gray-900">
                <code className="text-xs sm:text-sm">p₂/p₁ = 1 + [2γ / (γ + 1)] * (M₁² ⋅ sin²(β) - 1)</code>
              </div>
            </li>
            <li>
              <strong>Density Ratio (ρ₂/ρ₁):</strong>
              <div className="my-1 overflow-x-auto rounded-md bg-gray-100 p-2 dark:bg-gray-900">
                <code className="text-xs sm:text-sm">
                  ρ₂/ρ₁ = [(γ + 1) * M₁² ⋅ sin²(β)] / [(γ - 1) * M₁² ⋅ sin²(β) + 2]
                </code>
              </div>
            </li>
            <li>
              <strong>Temperature Ratio (T₂/T₁):</strong>
              <div className="my-1 overflow-x-auto rounded-md bg-gray-100 p-2 dark:bg-gray-900">
                <code className="text-xs sm:text-sm">T₂/T₁ = (p₂/p₁) * (ρ₁/ρ₂)</code>
              </div>
            </li>
            <li>
              <strong>Downstream Mach Number (M₂):</strong>
              <div className="my-1 overflow-x-auto rounded-md bg-gray-100 p-2 dark:bg-gray-900">
                <code className="text-xs sm:text-sm">
                  M₂² = [(1 + ( (γ - 1)/2 ) * M₁² ⋅ sin²(β)) / (γ * M₁² ⋅ sin²(β) - ( (γ - 1)/2 ))] / sin²(β - θ)
                </code>
              </div>
              Alternatively, if M₂ₙ (Mach component normal to shock, downstream) is found using normal shock relations
              for M₁ₙ:
              <div className="my-1 overflow-x-auto rounded-md bg-gray-100 p-2 dark:bg-gray-900">
                <code className="text-xs sm:text-sm">M₂ = M₂ₙ / sin(β - θ)</code>
              </div>
            </li>
            <li>
              <strong>Total Pressure Ratio (p₀₂/p₀₁):</strong> This ratio is always less than 1, indicating a loss of
              total pressure.
              <div className="my-1 overflow-x-auto rounded-md bg-gray-100 p-2 dark:bg-gray-900">
                <code className="text-xs sm:text-sm">
                  p₀₂/p₀₁ = {`{[( (γ + 1) * M₁² ⋅ sin²(β) ) / ( (γ - 1) * M₁² ⋅ sin²(β) + 2 )] ^ (γ / (γ - 1))} *`}
                  {` {[(γ + 1) / ( 2γ * M₁² ⋅ sin²(β) - (γ - 1) )] ^ (1 / (γ - 1))}`}
                </code>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-gray-200">Applications</h3>
          <p>
            Oblique shocks are critical in the design of supersonic vehicles, such as aircraft and missiles. They are
            used in engine inlets (e.g., wedge-shaped intakes) to compress incoming air efficiently before it enters the
            combustion chamber. Airfoils designed for supersonic flight also utilize oblique shocks to generate lift and
            manage drag.
          </p>
        </section>

        <p className="pt-4 text-sm text-gray-500 dark:text-gray-400">
          This calculator helps visualize and quantify these complex interactions based on your inputs. The θ-β-M
          relation is solved numerically to find the wave angle (β), and subsequently, other downstream properties are
          calculated.
        </p>
      </div>
    </div>
  );
}
