# Energy to Beta

The `pyamtrack.converters.beta_from_energy` function calculates the relativistic speed (beta) of a particle based on its energy per nucleon.

## Function Purpose

The `pyamtrack.converters.beta_from_energy` function computes the relative speed of a particle (`beta = v/c`), where `v` is the particle's velocity and `c` is the speed of light.

## Input Parameters

- **`input`**: The energy of the particle per nucleon in MeV/u. The function accepts the following types:
  - A single value as a `float` or `int`.
  - A `numpy.ndarray` of energy values.
  - A Python `list` of energy values.

## Output

- The function returns the calculated beta value(s) as:
  - A `float` for a single input value.
  - A `numpy.ndarray` for a NumPy array input.
  - A Python `list` for a list input.

## Notes

- The input energy must be non-negative. Negative energy values are invalid and will cause `np.nan` to be returned.
- The function supports both scalar and vectorized operations, making it efficient for batch calculations.

## Example Usage

### Single Value Input
```python
import pyamtrack

energy = 150.0  # MeV/u
beta = pyamtrack.converters.beta_from_energy(energy)
print(f"Beta: {beta}")
```

### NumPy Array Input
```python
import pyamtrack
import numpy as np

energies = np.array([10.0, 50.0, 100.0, 500.0])  # MeV/u
betas = pyamtrack.converters.beta_from_energy(energies)
print(f"Betas: {betas}")
```

### Python List Input
```python
import pyamtrack

energies = [10.0, 50.0, 100.0, 500.0]  # MeV/u
betas = pyamtrack.converters.beta_from_energy(energies)
print(f"Betas: {betas}")
```

### Edge Cases
- **Zero Energy**:
  ```python
  beta = pyamtrack.converters.beta_from_energy(0.0)
  print(f"Beta for zero energy: {beta}")  # Output: 0.0
  ```
- **Empty Input**:
  ```python
  betas = pyamtrack.converters.beta_from_energy([])
  print(f"Beta for empty input: {betas}")  # Output: []
  ```

## Error Handling

- If the input is not a valid type (`float`, `int`, `numpy.ndarray`, or `list`), the function raises a `ValueError` or `RuntimeError`.
- Example:
  ```python
  try:
      beta = pyamtrack.converters.beta_from_energy("invalid")
  except ValueError as e:
      print(f"Error: {e}")
  ```
