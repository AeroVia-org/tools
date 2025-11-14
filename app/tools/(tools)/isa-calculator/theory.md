The International Standard Atmosphere (ISA) is an idealized model representing average atmospheric conditions (temperature, pressure, density) at different altitudes. It provides a common reference for aviation, aerospace engineering, and meteorology.

## Key features of the ISA model:

- Defines standard sea level conditions: Temperature 15°C (288.15 K), Pressure 1013.25 hPa (101325 Pa), Density 1.225 kg/m³.

- Divides the atmosphere into layers with defined temperature lapse rates (how temperature changes with altitude):
  - **Troposphere (0-11km):** Temperature decreases linearly at 6.5°C/km from 15°C at sea level to -56.5°C at the tropopause.
  - **Tropopause (11-20km):** Constant temperature layer at -56.5°C.
  - **Stratosphere I (20-32km):** Temperature increases at 1.0°C/km.
  - **Stratosphere II (32-47km):** Temperature increases at 2.8°C/km up to -2.5°C.
  - **Stratopause (47-51km):** Constant temperature layer at -2.5°C.
  - **Mesosphere I (51-71km):** Temperature decreases at 2.8°C/km.
  - **Mesosphere II (71-84.85km):** Temperature decreases at 2.0°C/km to -86.2°C.

- Assumes dry air, constant chemical composition, and gravity that only varies with altitude.

- Provides equations to calculate properties at any given geometric altitude up to 86 km.

This calculator implements the ISA model equations to find atmospheric properties based on a given altitude, pressure, or temperature. Inversions (calculating altitude from pressure or temperature) may have limitations, especially in isothermal layers.
