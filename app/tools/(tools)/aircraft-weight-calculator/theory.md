## Weight Breakdown Fundamentals

Aircraft weight analysis underpins sizing, performance, and mission planning. The takeoff weight (W₀) is the sum of four primary components.

The basic weight equation is:

**W₀ = Wₑ + W_f + Wₚ + W_c**

**where:**

- W₀ = Takeoff weight
- Wₑ = Empty weight (structure + systems)
- W_f = Fuel weight (mission + reserves)
- Wₚ = Payload weight (passengers + cargo)
- W_c = Crew weight

Fractions vary by aircraft type and mission. Constraints like MTOW, MZFW, and maximum usable fuel further bound feasible combinations.

## Weight Fraction Analysis

Weight fractions are dimensionless ratios that express each weight component as a percentage of takeoff weight. These fractions are crucial for aircraft design and performance analysis.

### Empty Weight Fraction (Wₑ/W₀)

- Commercial airliners: ~45–50%
- Business jets: ~50–55%
- Military fighters: ~55–65%
- General aviation: ~60–70%
- UAVs: ~65–75%

### Fuel Weight Fraction (W_f/W₀)

- Short range: ~15–25%
- Medium range: ~25–35%
- Long range: ~35–45%
- Ferry: ~40–50%
- Endurance: ~20–30%

### Payload Weight Fraction (Wₚ/W₀)

- Commercial airliners: ~20–30%
- Cargo aircraft: ~30–40%
- Business jets: ~10–20%
- Military transport: ~15–25%
- General aviation: ~5–15%

### Crew Weight Fraction (W_c/W₀)

- Single pilot: ~2–3%
- Two pilots: ~3–5%
- Commercial crew: ~4–6%
- Military crew: ~3–7%
- UAVs: ~0–2%

## Mission Model & Range–Payload Analysis

We model missions with simple segments: pre-cruise (taxi/takeoff/climb), cruise, post-cruise (descent/approach/landing), and reserves. Cruise and loiter use Breguet relations; other segments are represented by multiplicative fuel fractions.

### Range–Payload Diagram Structure

The range–payload diagram (the "elbow chart") shows the trade-off between payload and range:

**A–B:** Maximum payload (horizontal)

- Operates at MZFW limit (structure-bound)
- Payload constant, range increases by adding fuel

**B–C:** Payload–range trade-off (descending)

- Operates at MTOW (weight-bound)
- Range increases by trading payload for fuel

**C–D:** Maximum (ferry) range (horizontal)

- Zero payload, maximum fuel capacity
- Ferry flight configuration
- Limited by fuel tank capacity

### Range Equation

**R = (V/c) × (L/D) × ln(Wᵢ/Wf)**

**where:**

- R = Range
- V = Cruise velocity
- c = Specific fuel consumption
- L/D = Lift-to-drag ratio
- Wᵢ = Initial weight (start of cruise)
- Wf = Final weight (end of cruise)

### Endurance (Loiter) Equation

**E = (1/c) × (L/D) × ln(Wᵢ/Wf)**

Range increases with:

- Higher cruise velocity (V)
- Better aerodynamic efficiency (L/D)
- Lower fuel consumption (c)
- Higher fuel fraction (Wₓ/W₀)

We combine segment effects with multiplicative fuel fractions: f_total = f_pre × f_cruise × f_post × f_res. This is simple yet captures the key trade-offs for preliminary sizing.

## Aircraft Type Characteristics

Different aircraft types have distinct weight fraction characteristics based on their design mission and operational requirements.

### Commercial Airliners

Optimized for passenger transport with high payload fractions. Empty weight fraction is moderate due to structural requirements for passenger comfort and safety.

### Business Jets

Designed for long-range executive transport. Higher empty weight fraction due to luxury amenities, but excellent fuel efficiency for extended range.

### Military Fighters

High empty weight fraction due to advanced avionics, weapons systems, and structural requirements for high-performance flight.

### Helicopters

Unique weight distribution due to rotor system complexity. Higher empty weight fraction but excellent payload capability for short-range missions.

### General Aviation

Simple, lightweight designs with high empty weight fractions. Limited payload capacity but excellent efficiency for personal and training use.

## Design Iteration Process

Aircraft weight analysis is an iterative process that begins with mission requirements and evolves through multiple design cycles.

1. **Mission Definition** - Define payload, range, and performance requirements
2. **Initial Weight Estimate** - Use statistical correlations to estimate takeoff weight
3. **Component Sizing** - Size engines, fuel tanks, and structural components
4. **Weight Calculation** - Calculate actual component weights and total weight
5. **Convergence Check** - Compare estimated vs. calculated weight, iterate if needed

## Performance Integration

Aircraft weight directly affects all aspects of performance, making weight analysis integral to comprehensive aircraft design.

### Takeoff Performance

- Higher weight requires longer takeoff distance
- Wing loading affects stall speed
- Thrust-to-weight ratio determines climb capability

### Cruise Performance

- Weight affects optimal cruise altitude
- Fuel consumption increases with weight
- Range decreases with higher weight

### Landing Performance

- Higher weight increases landing distance
- Approach speed increases with weight
- Brake energy requirements scale with weight

### Structural Design

- Higher weight requires stronger structure
- Wing loading affects wing design
- Landing gear sizing depends on weight

## Constraints, Reserves & Safety

Weight analysis must respect structural and operational constraints and include regulatory reserves.

### Maximum Takeoff Weight (MTOW)

Certified limit that cannot be exceeded. If computed TOW > MTOW, fuel is reduced first, then payload until feasible, as reflected in the range–payload curve and warnings.

### Center of Gravity Limits

Weight distribution must maintain center of gravity within certified limits for safe flight characteristics and controllability.

### MZFW & Max Fuel

MZFW limits (empty + payload). Max fuel capacity limits usable fuel. Both affect the A–B, B–C, and C–D segments of the range–payload diagram.

### Reserve Fuel

Modeled as a loiter reserve (minutes) using Breguet endurance. Real regulations (VFR/IFR, alternates, weather) vary by jurisdiction and operation.

### Payload Limitations

Maximum payload capacity limited by structural strength, performance requirements, and operational considerations.

## Limitations and Assumptions

This calculator uses simplified models suitable for preliminary design and educational purposes. Several important limitations should be noted:

- **Statistical correlations:** Weight fractions are based on historical data and may not apply to novel aircraft configurations
- **Mission simplification:** Real missions involve complex flight profiles with multiple phases and varying conditions
- **Performance integration:** Does not account for detailed aerodynamic, propulsion, or structural analysis
- **Regulatory compliance:** Simplified reserve fuel and safety margin calculations
- **Technology effects:** Does not account for advanced materials, systems, or propulsion technologies
- **Operational factors:** Simplified treatment of maintenance, operational, and environmental considerations

For detailed design work, especially for certification and production aircraft, consider using more sophisticated analysis tools and detailed component weight estimation methods.

## References

- **Raymer, D. P.** (2018). "Aircraft Design: A Conceptual Approach" (6th ed.). AIAA Education Series.
- **Roskam, J.** (1985). "Airplane Design" (8 vols.). DARcorporation.
- **Torenbeek, E.** (2013). "Advanced Aircraft Design: Conceptual Design, Analysis and Optimization of Subsonic Civil Airplanes". Wiley.
- **Gudmundsson, S.** (2014). "General Aviation Aircraft Design: Applied Methods and Procedures". Butterworth-Heinemann.
- **FAA.** (2012). "FAR Part 25: Airworthiness Standards: Transport Category Airplanes". Federal Aviation Administration.
- **EASA.** (2012). "CS-25: Certification Specifications for Large Aeroplanes". European Aviation Safety Agency.
