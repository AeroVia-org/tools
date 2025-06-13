const EARTH_RADIUS_KM = 6371;

export default function HohmannTransferTheory() {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Hohmann Transfer Theory & Notes</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
        <li>
          A <strong>Hohmann transfer</strong> is an orbital maneuver using two engine impulses (burns) to move between
          two coplanar circular orbits.
        </li>
        <li>It is generally the most fuel-efficient two-burn maneuver for this type of transfer.</li>
        <li>
          The transfer occurs along an elliptical orbit that is tangential to both the initial and final circular
          orbits.
        </li>
        <li>
          <strong>ΔV₁</strong>: First burn (at periapsis or apoapsis of the transfer ellipse) changes the
          spacecraft&apos;s velocity to enter the transfer ellipse from the initial orbit.
        </li>
        <li>
          <strong>ΔV₂</strong>: Second burn (at the opposite apsis of the transfer ellipse) changes velocity again to
          match the final circular orbit.
        </li>
        <li>
          <strong>Altitude vs. Distance:</strong> This calculator supports two input modes:
          <ul className="list-circle mt-1 ml-6 space-y-1">
            <li>
              <strong>Altitude</strong>: Height above Earth&apos;s surface (e.g., 400 km for LEO)
            </li>
            <li>
              <strong>Distance</strong>: Measured from Earth&apos;s center (e.g., 6771 km for LEO)
            </li>
            <li>
              <em>Conversion</em>: Distance = Altitude + Earth radius ({EARTH_RADIUS_KM} km)
            </li>
          </ul>
        </li>
        <li>
          Assumes instantaneous velocity changes (impulsive burns) and neglects atmospheric drag and gravitational
          perturbations.
        </li>
        <li>Calculations are specific to transfers around Earth.</li>
        <li>
          <strong>Transfer time</strong> is half the orbital period of the transfer ellipse.
        </li>
      </ul>
    </div>
  );
}
