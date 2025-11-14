## Basic Aerodynamic Concepts

Lift and drag are the two primary aerodynamic forces acting on an aircraft. Lift is the force that keeps the aircraft airborne, while drag opposes the aircraft's motion through the air. Both forces are calculated using similar equations based on the dynamic pressure and aerodynamic coefficients.

The fundamental equations for lift and drag are:

**L = CL × q × S**  
**D = CD × q × S**  
**where: q = ½ × ρ × V² (dynamic pressure)**

Where L is lift force, D is drag force, CL is the lift coefficient, CD is the drag coefficient, q is the dynamic pressure, ρ is air density, V is velocity, and S is the wing reference area.

## Lift Coefficient (CL)

The lift coefficient is a dimensionless parameter that characterizes the lift-generating capability of an airfoil. It depends primarily on the angle of attack and the airfoil's geometric characteristics.

In the linear region (before stall), the lift coefficient follows the relationship:

**CL = CL0 + CLα × (α - α0)**

Where CL0 is the zero-lift angle coefficient, CLα is the lift curve slope (approximately 2π per radian), α is the angle of attack, and α0 is the zero-lift angle of attack.

Beyond the stall angle, the lift coefficient decreases due to flow separation, and the relationship becomes more complex and less predictable.

## Drag Coefficient (CD)

The drag coefficient represents the drag characteristics of an airfoil and is typically modeled using the drag polar equation:

**CD = CD0 + CL² / (π × AR × e)**

Where CD0 is the zero-lift drag coefficient (parasitic drag), AR is the aspect ratio (b²/S), e is the Oswald efficiency factor, and CL is the lift coefficient.

This equation shows that drag consists of two components:

- **Parasitic drag (CD0):** Independent of lift, includes skin friction, form drag, and interference drag
- **Induced drag (CL²/πAR×e):** Proportional to the square of lift coefficient, caused by the generation of lift and the creation of trailing vortices

## Aspect Ratio Effects

The aspect ratio (AR) is defined as the square of the wingspan divided by the wing area:

**AR = b² / S**

Higher aspect ratios generally result in:

- Lower induced drag for a given lift coefficient
- Higher maximum lift-to-drag ratio
- Better efficiency for long-range flight
- Reduced stall speed

However, high aspect ratio wings also have disadvantages such as increased structural weight and reduced maneuverability.

## Lift-to-Drag Ratio (L/D)

The lift-to-drag ratio is a key performance parameter that indicates the aerodynamic efficiency of an aircraft. It represents how much lift is generated per unit of drag.

The maximum lift-to-drag ratio occurs at the optimal lift coefficient, which can be calculated as:

**CL_opt = √(CD0 × π × AR × e)**  
**(L/D)\_max = √(π × AR × e) / (2 × √CD0)**

This shows that maximum L/D ratio increases with aspect ratio and Oswald efficiency factor, and decreases with zero-lift drag coefficient.

The optimal angle of attack for maximum L/D can be found by converting the optimal lift coefficient back to angle of attack using the lift curve slope.

## Stall Speed

Stall speed is the minimum speed at which an aircraft can maintain level flight. It occurs when the aircraft reaches its maximum lift coefficient (CLmax).

The stall speed can be calculated from the lift equation:

**V_stall = √(2W / (ρ × S × CLmax))**

Where W is the aircraft weight, ρ is air density, S is wing area, and CLmax is the maximum lift coefficient.

Stall speed increases with aircraft weight and decreases with wing area, air density, and maximum lift coefficient. This is why aircraft have higher stall speeds at higher altitudes and when carrying more weight.

## Limitations and Assumptions

This calculator uses simplified aerodynamic models suitable for preliminary design and educational purposes. Several important limitations should be noted:

- **Linear lift curve:** Assumes a constant lift curve slope of 2π per radian, which is valid for thin airfoils at low angles of attack
- **Simplified stall model:** Post-stall behavior is approximated and may not accurately represent real airfoil characteristics
- **Two-dimensional flow:** Does not account for three-dimensional effects such as wing tip vortices and spanwise flow
- **Reynolds number effects:** Does not consider how Reynolds number affects airfoil performance
- **Compressibility effects:** Assumes incompressible flow, which is valid for speeds below approximately Mach 0.3
- **Clean configuration:** Does not account for flaps, landing gear, or other configuration changes

For more accurate results, especially for detailed design work, consider using more sophisticated aerodynamic analysis tools that account for these effects.

## References

- **Anderson, J. D.** (2016). "Fundamentals of Aerodynamics" (6th ed.). McGraw-Hill Education.
- **McCormick, B. W.** (1995). "Aerodynamics, Aeronautics, and Flight Mechanics" (2nd ed.). Wiley.
- **Raymer, D. P.** (2018). "Aircraft Design: A Conceptual Approach" (6th ed.). AIAA Education Series.
- **Abbott, I. H., & von Doenhoff, A. E.** (1959). "Theory of Wing Sections: Including a Summary of Airfoil Data". Dover Publications.
