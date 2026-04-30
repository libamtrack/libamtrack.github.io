---
sidebar_position: 6
---

# Type Conversion Tables for Ported Functions

This page shows input/output type conversions for all fully ported functions in pyamtrack.

---

## `converters.beta_from_energy`

Converts kinetic energy to relativistic beta.

| Python Input | → C Input | → C Output | → Python Output |
|---|---|---|---|
| `float` (energy in MeV) | `double` | `double` | `float` |
| `list` of floats | `double*` array | `double*` array | `np.ndarray` (float64) |
| `np.ndarray` (float64) | `double*` array | `double*` array | `np.ndarray` (float64) |

**Example:**
```python
import numpy as np
import pyamtrack

# Scalar
beta = pyamtrack.converters.beta_from_energy(150.0)

# Array
energies = np.linspace(10.0, 1000.0, 100, dtype=np.float64)
betas = pyamtrack.converters.beta_from_energy(energies)
```

---

## `converters.energy_from_beta`

Converts relativistic beta to kinetic energy.

| Python Input | → C Input | → C Output | → Python Output |
|---|---|---|---|
| `float` (beta value) | `double` | `double` | `float` |
| `list` of floats | `double*` array | `double*` array | `np.ndarray` (float64) |
| `np.ndarray` (float64) | `double*` array | `double*` array | `np.ndarray` (float64) |

**Example:**
```python
import numpy as np
import pyamtrack

# Scalar
energy = pyamtrack.converters.energy_from_beta(0.5)

# Array
betas = np.linspace(0.1, 0.9, 50, dtype=np.float64)
energies = pyamtrack.converters.energy_from_beta(betas)
```

---

## `stopping.electron_range`

Calculates electron range in materials using various models.

| Python Input | → C Input | → C Output | → Python Output |
|---|---|---|---|
| `float` (energy in MeV) | `double` | `double` | `float` |
| `list` of floats | `double*` array | `double*` array | `np.ndarray` (float64) |
| `np.ndarray` (float64) | `double*` array | `double*` array | `np.ndarray` (float64) |
| `int` (material ID) | `int` | — | — |
| `str` (model name) | `char*` | — | — |

**Example:**
```python
import numpy as np
import pyamtrack

# Scalar
range_cm = pyamtrack.stopping.electron_range(150.0, material=1, model="tabata")

# Array (recommended for plots)
energies = np.linspace(10.0, 1000.0, 500, dtype=np.float64)
ranges = pyamtrack.stopping.electron_range(energies, material=1, model="tabata")
```

---

## `materials` module functions

Access and query material properties.

| Python Input | → C Input | → C Output | → Python Output |
|---|---|---|---|
| `int` (material ID) | `int` | — | — |
| `str` (material name) | `char*` | — | — |
| `int` (property ID) | `int` | `double` / `int` | `float` / `int` |
| `list` of ints | `int*` array | `double*` / `int*` array | `np.ndarray` |

**Example:**
```python
import pyamtrack

# Query material property
density = pyamtrack.materials.get_density(1)  # material ID 1

# List available materials
materials = pyamtrack.materials.list_materials()
```
