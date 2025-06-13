export default function IsentropicFlowTheory() {
  return (
    <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Isentropic Flow Theory</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">What is Isentropic Flow?</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Isentropic flow is a compressible fluid flow where entropy remains constant. This occurs when:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-300">
            <li>The flow is adiabatic (no heat transfer)</li>
            <li>The flow is reversible (no viscous effects or friction)</li>
            <li>No shock waves are present</li>
            <li>The fluid can be modeled as a perfect gas</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Key Properties and Terminology</h3>
          <ul className="list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-300">
            <li>
              <strong>Stagnation properties</strong>: Values when flow is brought to rest isentropically (denoted with
              subscript ₀)
            </li>
            <li>
              <strong>Area ratio (A/A*)</strong>: Ratio of local area to the critical area where M=1
            </li>
            <li>
              <strong>Mach angle (μ)</strong>: Angle of Mach waves in supersonic flow, calculated as sin⁻¹(1/M)
            </li>
            <li>
              <strong>Prandtl-Meyer function (ν)</strong>: Maximum angle through which supersonic flow can turn in
              expansion
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Applications</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Nozzle Design</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Isentropic flow relations are used in designing rocket and jet engine nozzles to properly expand
              supersonic exhaust flow.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Wind Tunnel Testing</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Used to calculate flow conditions in different parts of supersonic and hypersonic wind tunnels for
              aerodynamic testing.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Supersonic Inlets</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              For designing efficient inlets for supersonic aircraft that slow down air with minimum total pressure
              loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
