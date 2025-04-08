# Materials

The library provides a comprehensive material system for particle transport calculations, including predefined materials commonly used in particle therapy and radiation physics.

## Overview

Each material is characterized by physical properties, including density, mean ionization potential, and atomic properties.

## Material Properties

Each Material object has the following properties:

- **id** (`int`): Unique identifier for the material
- **name** (`str`): Full name of the material
- **density_g_cm3** (`float`): Density in g/cm³
- **I_eV** (`float`): Mean ionization potential in eV
- **average_A** (`float`): Average mass number
- **average_Z** (`float`): Average atomic number
- **phase** (`int`): Physical state (condensed or gaseous)

Additional properties for advanced calculations:
- **alpha_g_cm2_MeV** (`float`): Fit parameter for power-law representation of stopping power
- **p_MeV** (`float`): Fit parameter for power-law representation of stopping power
- **m_g_cm2** (`float`): Fit parameter for linear representation of fluence changes

## Using Materials

### Creating Material Objects

Materials can be created either by ID or name:

```python
import pyamtrack.materials as materials

# Create by ID
water = materials.Material(1)  # Water, Liquid

# Create by name
aluminum = materials.Material("Aluminum")
```

### Predefined Materials

Common materials are available as module attributes:

```python
import pyamtrack.materials as materials

# Access predefined materials
water = materials.water_liquid    # ID: 1
air = materials.air              # ID: 2
pmma = materials.pmma           # ID: 3
```

### Accessing Properties

```python
# Get material properties
print(f"Water density: {water.density_g_cm3} g/cm³")
print(f"Water I-value: {water.I_eV} eV")
print(f"Water phase: {water.phase}")
```

## Available Materials

You can get information about available materials using several utility functions:

### List All Materials
```python
import pyamtrack.materials as materials

# Get all material IDs
ids = materials.get_ids()

# Get human-readable names
names = materials.get_long_names()

# Get programmatic names (lowercase, underscores)
short_names = materials.get_names()
```

### Common Materials Reference

| Material | ID | Density (g/cm³) | Common Use |
|----------|-------|----------------|------------|
| Water, Liquid | 1 | 1.0 | Reference material, body tissue equivalent |
| Air | 2 | 0.001225 | Atmospheric medium |
| PMMA | 3 | 1.19 | Phantom material |
| Aluminum | 4 | 2.7 | Beam modifiers |

## Error Handling

PyAMTrack includes robust error handling for material operations:

```python
try:
    # Try to create material with invalid ID
    invalid_material = materials.Material(9999)
except ValueError as e:
    print(f"Error: {e}")

try:
    # Try to create material with invalid name
    invalid_material = materials.Material("Invalid Material")
except ValueError as e:
    print(f"Error: {e}")
```

## Using Materials in Calculations

Materials are used throughout pyamtack for various calculations:

```python
import pyamtrack
import pyamtrack.materials as materials

# Calculate electron range in different materials
energy = 100.0  # MeV
range_water = pyamtrack.stopping.electron_range(energy, material=materials.water_liquid)
range_air = pyamtrack.stopping.electron_range(energy, material=materials.air)

print(f"Range in water: {range_water:.2e} m")
print(f"Range in air: {range_air:.2e} m")
```

## Notes

- Material properties are based on standard reference data
- Density values are at standard temperature and pressure where applicable
- The material system supports both simple usage with predefined materials and advanced usage with detailed physical properties

## See Also

- ICRU Report 49: Stopping Powers and Ranges for Protons and Alpha Particles
- NIST Standard Reference Database
- PyAMTrack API Reference for complete material specifications