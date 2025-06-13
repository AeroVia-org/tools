export default function ReynoldsCalculatorTheory() {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">About Reynolds Number</h3>
      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
        <p>
          The Reynolds number (Re) is a dimensionless quantity that helps predict flow patterns in different fluid flow
          situations. It is defined as the ratio of inertial forces to viscous forces within a fluid.
        </p>

        <div className="rounded-md bg-white p-4 dark:bg-gray-700/30">
          <div className="mb-2 text-center text-lg font-medium text-gray-800 dark:text-gray-100">Re = ρvL/μ = vL/ν</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="text-sm">
              <span className="font-medium">Where:</span>
              <ul className="mt-1 list-disc pl-5">
                <li>ρ = fluid density (kg/m³)</li>
                <li>v = flow velocity (m/s)</li>
                <li>L = characteristic length (m)</li>
                <li>μ = dynamic viscosity (kg/(m·s))</li>
                <li>ν = kinematic viscosity (m²/s)</li>
              </ul>
            </div>
            <div className="text-sm">
              <span className="font-medium">For different geometries, L is:</span>
              <ul className="mt-1 list-disc pl-5">
                <li>Pipe flow: Diameter</li>
                <li>Airfoil: Chord length</li>
                <li>Flat plate: Length from leading edge</li>
                <li>Sphere/cylinder: Diameter</li>
              </ul>
            </div>
          </div>
        </div>

        <p>
          <strong>Flow regimes</strong> based on Reynolds number:
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-100">Internal Flow (pipes, ducts):</h4>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium">Laminar:</span> Re &lt; 2,300
              </li>
              <li>
                <span className="font-medium">Transitional:</span> 2,300 ≤ Re &lt; 4,000
              </li>
              <li>
                <span className="font-medium">Turbulent:</span> Re ≥ 4,000
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-100">External Flow (airfoils, obstacles):</h4>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium">Laminar:</span> Re &lt; 3 × 10⁵
              </li>
              <li>
                <span className="font-medium">Transitional:</span> 3 × 10⁵ ≤ Re &lt; 5 × 10⁵
              </li>
              <li>
                <span className="font-medium">Turbulent:</span> Re ≥ 5 × 10⁵
              </li>
            </ul>
          </div>
        </div>
        <p>
          At higher Reynolds numbers, inertial forces dominate over viscous forces, leading to turbulent flow
          characterized by chaotic, irregular fluid motions. At lower Reynolds numbers, viscous forces are dominant,
          resulting in laminar flow with smooth, ordered fluid motion.
        </p>
      </div>
    </div>
  );
}
