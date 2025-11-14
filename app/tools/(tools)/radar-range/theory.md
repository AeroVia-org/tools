The **Radar Range Equation** relates the maximum detection range of a radar system to the characteristics of the transmitter, receiver, antenna, target, and the environment. The standard form for a monostatic radar (same antenna for transmit and receive) is:

## Main Equation

**R_max = [ (P_t × G² × λ² × σ) / ( (4π)³ × S_min ) ] ^ (1/4)**

**Where:**

- **R_max**: Maximum Radar Range (meters)
- **P_t**: Transmitter Power (Watts)
- **G**: Antenna Gain (linear scale, dimensionless) - Assumed identical for transmit and receive
- **λ**: Wavelength of the radar signal (meters)
- **σ**: Target Radar Cross Section (RCS) (square meters, m²) - Effective scattering area of the target
- **S_min**: Minimum Detectable Signal Power (Watts) - Smallest signal power the receiver can reliably detect above noise

## Wavelength Equation

The wavelength (**λ**) is related to the frequency (**f**) by:

**λ = c / f**

Where **c** is the speed of light (approximately 2.998 × 10⁸ m/s).

## Key Assumptions and Notes

- Assumes free space propagation (no atmospheric absorption, refraction, or multipath effects)
- Assumes the target is in the main beam of the antenna
- Does not account for system losses (e.g., transmission line loss, processing loss)
- Represents the theoretical maximum range based purely on power budget; practical range can be limited by other factors (e.g., clutter, jamming, resolution)
- Antenna gain (**G**) is squared because the same antenna is used for transmitting and receiving, applying the gain twice (once for the outgoing wave, once for the incoming echo)
- The **(4π)³** term arises from the spherical spreading of the wave (twice, for transmit and receive) and the antenna aperture formula
