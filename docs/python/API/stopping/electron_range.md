# Electron Range

The `electron_range` function calculates the maximum distance that electrons can travel in a material before losing all their energy. This calculation can be performed using various theoretical and empirical models.

## Function Purpose

Calculate the maximum electron range in a material using different stopping power models. This is essential for:
- Radiation therapy treatment planning
- Shielding calculations
- Detector design
- Radiation protection

## Input Parameters

- **`input`**: The electron energy in MeV. The function accepts:
  - A single value as `float` or `int`
  - A `numpy.ndarray` of energy values
  - A Python `list` of energy values

- **`material`** (optional): The material through which the electrons travel. Can be specified as:
  - An integer ID (e.g., `1` for water)
  - A [`Material`](../materials.md) object
  - Defaults to `1` (liquid water)
  See the [Materials documentation](../materials.md) for detailed information about available materials.

- **`model`** (optional): The stopping power model to use. Can be specified as:
  - A string name (e.g., `"tabata"`)
  - An integer ID (e.g., `7` for Tabata model)
  - Defaults to `"tabata"`

### Available Models

| Model Name | ID | Description |
|------------|------|-------------|
| `"butts_katz"` | 2 | Butts & Katz model, suitable for track structure calculations |
| `"waligorski"` | 3 | Waligorski model, optimized for radiobiology applications |
| `"geiss"` | 4 | Geiss model, focused on heavy ion interactions |
| `"scholz"` | 5 | Original Scholz model |
| `"edmund"` | 6 | Edmund model |
| `"tabata"` | 7 | Tabata model (default), widely used empirical model |
| `"scholz_new"` | 8 | Updated Scholz model with improved accuracy |

## Output

The function returns the calculated range(s) in meters as:
- A `float` for a single input value
- A `numpy.ndarray` for NumPy array input
- A Python `list` for list input

## Notes

- The range values represent the maximum distance electrons can travel in the material
- Different models may give varying results due to different theoretical approaches
- Model variations typically stay within physically reasonable bounds
- The function supports vectorized operations for efficient batch calculations
- Results scale correctly with energy (higher energy = longer range)
- All models work with all available materials

## Example Usage

### Basic Usage with Default Model
```python
import pyamtrack

energy = 100.0  # MeV
range_m = pyamtrack.stopping.electron_range(energy)
print(f"Range in water: {range_m:.2e} m")
```

### Using Different Materials
```python
import pyamtrack
from pyamtrack import materials

energy = 100.0  # MeV

# Using material ID
range_water = pyamtrack.stopping.electron_range(
    energy, 
    material=1  # water
)

# Using Material object
range_air = pyamtrack.stopping.electron_range(
    energy,
    material=materials.air
)

print(f"Range in water: {range_water:.2e} m")
print(f"Range in air: {range_air:.2e} m")
```

### Using Different Models
```python
import pyamtrack

energy = 100.0  # MeV

# Using model name
range_tabata = pyamtrack.stopping.electron_range(
    energy,
    model="tabata"
)

# Using model ID
range_scholz = pyamtrack.stopping.electron_range(
    energy,
    model=5  # scholz model
)

print(f"Range (Tabata): {range_tabata:.2e} m")
print(f"Range (Scholz): {range_scholz:.2e} m")
```

### Batch Calculations
```python
import pyamtrack
import numpy as np

energies = np.array([10.0, 50.0, 100.0, 500.0])  # MeV
ranges = pyamtrack.stopping.electron_range(energies)
print(f"Ranges: {ranges}")
```

## Error Handling

The function includes comprehensive error checking:

```python
import pyamtrack

try:
    # Invalid material
    range_invalid = pyamtrack.stopping.electron_range(
        100.0,
        material="invalid"
    )
except TypeError as e:
    print(f"Material error: {e}")

try:
    # Invalid model
    range_invalid = pyamtrack.stopping.electron_range(
        100.0,
        model="invalid_model"
    )
except RuntimeError as e:
    print(f"Model error: {e}")
```

## See Also

- [Materials Documentation](../materials.md) - Details about available materials
- ICRU Report 37 - Stopping Powers for Electrons and Positrons
- The Physics of Radiation Therapy (F.M. Khan) - Chapter on electron interactions
- Original model papers:
  - Tabata et al. (1972)
  - Butts and Katz (1967)
  - Scholz and Kraft (1994)