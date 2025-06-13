export default function RadarRangeTheory() {
  const radarEquationText = "R_max = [ (P_t * G² * λ² * σ) / ( (4π)³ * S_min ) ] ^ (1/4)";
  const wavelengthEquationText = "λ = c / f";

  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">Radar Range Equation Theory</h3>
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
        <p>
          The <strong>Radar Range Equation</strong> relates the maximum detection range of a radar system to the
          characteristics of the transmitter, receiver, antenna, target, and the environment. The standard form for a
          monostatic radar (same antenna for transmit and receive) is:
        </p>

        {/* Display equation as simple text */}
        <p className="my-4 text-center font-mono text-sm sm:text-base">{radarEquationText}</p>

        <p>Where:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-mono font-semibold">
              R<sub>max</sub>
            </span>
            : Maximum Radar Range (meters)
          </li>
          <li>
            <span className="font-mono font-semibold">
              P<sub>t</sub>
            </span>
            : Transmitter Power (Watts)
          </li>
          <li>
            <span className="font-mono font-semibold">G</span>: Antenna Gain (linear scale, dimensionless) - Assumed
            identical for transmit and receive.
          </li>
          <li>
            <span className="font-mono font-semibold">λ</span>: Wavelength of the radar signal (meters)
          </li>
          <li>
            <span className="font-mono font-semibold">σ</span>: Target Radar Cross Section (RCS) (square meters, m²) -
            Effective scattering area of the target.
          </li>
          <li>
            <span className="font-mono font-semibold">
              S<sub>min</sub>
            </span>
            : Minimum Detectable Signal Power (Watts) - Smallest signal power the receiver can reliably detect above
            noise.
          </li>
        </ul>

        <p>
          The wavelength (<span className="font-mono font-semibold">λ</span>) is related to the frequency (
          <span className="font-mono font-semibold">f</span>) by:
        </p>
        {/* Display equation as simple text */}
        <p className="my-4 text-center font-mono text-sm sm:text-base">{wavelengthEquationText}</p>
        <p>
          Where <span className="font-mono font-semibold">c</span> is the speed of light (approximately 2.998 × 10⁸
          m/s).
        </p>

        <h4 className="text-md pt-2 font-semibold text-gray-700 dark:text-gray-200">Key Assumptions and Notes:</h4>
        <ul className="list-disc space-y-1 pl-5">
          <li>Assumes free space propagation (no atmospheric absorption, refraction, or multipath effects).</li>
          <li>Assumes the target is in the main beam of the antenna.</li>
          <li>Does not account for system losses (e.g., transmission line loss, processing loss).</li>
          <li>
            Represents the theoretical maximum range based purely on power budget; practical range can be limited by
            other factors (e.g., clutter, jamming, resolution).
          </li>
          <li>
            Antenna gain (<span className="font-mono font-semibold">G</span>) is squared because the same antenna is
            used for transmitting and receiving, applying the gain twice (once for the outgoing wave, once for the
            incoming echo).
          </li>
          <li>
            The <span className="font-mono font-semibold">(4π)³</span> term arises from the spherical spreading of the
            wave (twice, for transmit and receive) and the antenna aperture formula.
          </li>
        </ul>
      </div>
    </div>
  );
}
