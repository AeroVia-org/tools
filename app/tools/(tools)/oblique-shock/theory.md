## Introduction

Oblique shock waves are a fundamental phenomenon in supersonic aerodynamics. Unlike normal shock waves, which are perpendicular to the flow direction, oblique shocks are inclined at an angle. They occur when a supersonic flow (Mach number M₁ > 1) encounters a sharp compressive corner or is deflected by an object, such as a wedge. This deflection forces the streamlines to turn, creating a thin region of abrupt changes in flow properties.

Across an oblique shock, the static pressure, temperature, and density of the gas increase, while the Mach number decreases. However, unlike a normal shock where the downstream flow (M₂) is always subsonic, the flow after an oblique shock can be either supersonic (weak shock) or subsonic (strong shock), depending on the upstream Mach number and the deflection angle. The total temperature (T₀) remains constant across the shock, but the total pressure (p₀) decreases due to the irreversible nature of the shock (entropy increases).

## Key Parameters

- **Upstream Mach Number (M₁):** The Mach number of the flow before encountering the shock. It must be greater than 1.
- **Deflection Angle (θ or δ):** The angle through which the flow is turned by the corner or wedge. This is a primary input for calculations.
- **Wave Angle (β or σ):** The angle the shock wave makes with the direction of the upstream flow. β is always greater than the Mach angle (μ = arcsin(1/M₁)) and less than 90°.
- **Specific Heat Ratio (γ - Gamma):** A property of the gas, typically 1.4 for air.
- **Downstream Mach Number (M₂):** The Mach number of the flow after passing through the shock.

## The θ-β-M Relationship

The relationship between the deflection angle (θ), wave angle (β), and upstream Mach number (M₁) is crucial for analyzing oblique shocks. It is given by the following equation:

**tan(θ) = 2 × cot(β) × [M₁² ⋅ sin²(β) - 1] / [M₁² ⋅ (γ + cos(2β)) + 2]**

For a given M₁ and θ, this equation can have:

- **Two solutions for β:** A smaller β corresponds to a "weak" shock (usually supersonic M₂), and a larger β corresponds to a "strong" shock (usually subsonic M₂). In external aerodynamics, the weak solution is most commonly observed.
- **One solution for β:** This occurs at the maximum deflection angle (θ_max).
- **No real solution for β:** If θ > θ_max, the shock detaches from the corner and forms a curved bow shock ahead of the body.

## Calculating Flow Properties

Once the wave angle β is determined, the properties downstream of the shock can be calculated. These calculations often involve treating the oblique shock as a normal shock with an upstream Mach number equal to the component of M₁ normal to the shock wave (M₁ₙ = M₁ ⋅ sin(β)).

Key property ratios across the shock include:

### Pressure Ratio (p₂/p₁)

**p₂/p₁ = 1 + [2γ / (γ + 1)] × (M₁² ⋅ sin²(β) - 1)**

### Density Ratio (ρ₂/ρ₁)

**ρ₂/ρ₁ = [(γ + 1) × M₁² ⋅ sin²(β)] / [(γ - 1) × M₁² ⋅ sin²(β) + 2]**

### Temperature Ratio (T₂/T₁)

**T₂/T₁ = (p₂/p₁) × (ρ₁/ρ₂)**

### Downstream Mach Number (M₂)

**M₂² = [(1 + ( (γ - 1)/2 ) × M₁² ⋅ sin²(β)) / (γ × M₁² ⋅ sin²(β) - ( (γ - 1)/2 ))] / sin²(β - θ)**

Alternatively, if M₂ₙ (Mach component normal to shock, downstream) is found using normal shock relations for M₁ₙ:

**M₂ = M₂ₙ / sin(β - θ)**

### Total Pressure Ratio (p₀₂/p₀₁)

This ratio is always less than 1, indicating a loss of total pressure.

**p₀₂/p₀₁ = {[( (γ + 1) × M₁² ⋅ sin²(β) ) / ( (γ - 1) × M₁² ⋅ sin²(β) + 2 )] ^ (γ / (γ - 1))} × {[(γ + 1) / ( 2γ × M₁² ⋅ sin²(β) - (γ - 1) )] ^ (1 / (γ - 1))}**

## Applications

Oblique shocks are critical in the design of supersonic vehicles, such as aircraft and missiles. They are used in engine inlets (e.g., wedge-shaped intakes) to compress incoming air efficiently before it enters the combustion chamber. Airfoils designed for supersonic flight also utilize oblique shocks to generate lift and manage drag.

This calculator helps visualize and quantify these complex interactions based on your inputs. The θ-β-M relation is solved numerically to find the wave angle (β), and subsequently, other downstream properties are calculated.
