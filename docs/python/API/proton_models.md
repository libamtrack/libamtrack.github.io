# Proton Analytical Models

The `pyamtrack.proton_models` module provides analytical models for calculating
depth-dependent proton dose and linear energy transfer (LET). These models are
useful for inspecting proton-beam depth profiles and for simplified analytical
studies in proton therapy.


## Common Input Conventions

Both functions accept scalar values, Python lists, and NumPy arrays for their
numeric arguments.

- `depth_cm` is the depth in the material, measured in centimetres.
- `energy_MeV` is the initial proton kinetic energy in MeV.
- `energy_spread_fraction` is the relative standard deviation of the beam
  energy. For example, `0.01` represents a 1% energy spread.
- `material` can be a material ID or a
  [`Material`](materials.md) object. The default material is liquid water
  (`material=1`).

By default, vector inputs are evaluated elementwise. Scalar arguments are
broadcast to the length of the first list or array argument, while all
non-scalar arguments must have compatible lengths. A vectorized calculation
returns a NumPy array.

Set `cartesian_product=True` to evaluate every combination of iterable
arguments. The returned array has dimensions corresponding to the iterable
arguments.

## Bortfeld Dose

### `dose_bortfeld`

The `dose_bortfeld` function calculates absorbed dose at a specified depth
using the analytical Bortfeld approximation of the proton Bragg curve.

```python
import pyamtrack

pyamtrack.proton_models.dose_bortfeld(
    depth_cm,
    fluence_cm2,
    energy_MeV,
    energy_spread_fraction=0.01,
    material=1,
    eps=0.03,
    cartesian_product=False,
)
```

### Parameters

- **`depth_cm`** (`float`, `list`, or NumPy array): Depth in the material
  `[cm]`. Values must be non-negative.
- **`fluence_cm2`** (`float`, `list`, or NumPy array): Proton fluence
  `[1/cm²]`. Dose scales linearly with fluence; use a non-negative physical
  fluence.
- **`energy_MeV`** (`float`, `list`, or NumPy array): Initial proton energy
  `[MeV]`. Values must be in the inclusive range `[0.1, 10000.0]`.
- **`energy_spread_fraction`** (`float`, `list`, or NumPy array, optional):
  Relative energy spread. Values must be in `(0, 1)`. The wrapper converts
  this fraction internally to an energy standard deviation in MeV.
- **`material`** (`int`, `Material`, list, or NumPy array, optional): Material
  ID or material object. The default is `1`, liquid water.
- **`eps`** (`float`, `list`, or NumPy array, optional): Fraction of primary
  fluence assigned to the nuclear-interaction tail. Values must be in `[0, 1)`.
  The default is `0.03`.
- **`cartesian_product`** (`bool`, optional): If `True`, evaluate all
  combinations of iterable arguments. The default is `False`, which uses
  elementwise evaluation.

### Return Value

The function returns dose in **Gy**:

- a Python `float` when all arguments are scalars;
- a NumPy array when at least one argument is a list or NumPy array.

### Example

The following example calculates a dose profile for a 150 MeV proton beam in
liquid water:

```python
import numpy as np
import pyamtrack

depth_cm = np.linspace(0.0, 17.0, 500)

dose_Gy = pyamtrack.proton_models.dose_bortfeld(
    depth_cm=depth_cm,
    fluence_cm2=1e8,
    energy_MeV=150.0,
    energy_spread_fraction=0.01,
    material=pyamtrack.materials.water_liquid,
    eps=0.03,
)

print(dose_Gy.shape)
print(f"Maximum dose: {dose_Gy.max():.3g} Gy")
```

## Wilkens LET

### `let_wilkens`

The `let_wilkens` function calculates depth-dependent proton LET using the
analytical model of Wilkens and Oelfke. It supports both dose-averaged and
track-averaged LET.

```python
import pyamtrack

pyamtrack.proton_models.let_wilkens(
    depth_cm,
    energy_MeV,
    energy_spread_fraction=0.01,
    material=1,
    averaging="dose",
    cartesian_product=False,
)
```

### Parameters

- **`depth_cm`** (`float`, `list`, or NumPy array): Depth in the material
  `[cm]`. Values must be non-negative.
- **`energy_MeV`** (`float`, `list`, or NumPy array): Initial proton energy
  `[MeV]`. Values must be in the inclusive range `[0.1, 10000.0]`.
- **`energy_spread_fraction`** (`float`, `list`, or NumPy array, optional):
  Relative energy spread. Values must be in `(0, 1)`. The default is `0.01`.
- **`material`** (`int`, `Material`, list, or NumPy array, optional): Material
  ID or material object. The default is `1`, liquid water.
- **`averaging`** (`str` or `Averaging`, optional): LET averaging convention:
  - `"dose"` or `pyamtrack.proton_models.Averaging.DOSE` calculates
    dose-averaged LET (`LET_d`).
  - `"track"` or `pyamtrack.proton_models.Averaging.TRACK` calculates
    track-averaged LET (`LET_t`).

  String values are case-insensitive. The default is `"dose"`.
- **`cartesian_product`** (`bool`, optional): If `True`, evaluate all
  combinations of iterable arguments. The default is `False`, which uses
  elementwise evaluation.

### Dose-Averaged and Track-Averaged LET

Dose-averaged LET (`LET_d`) gives greater weight to tracks contributing more
dose and is commonly used in radiobiological analyses. Track-averaged LET
(`LET_t`) is the fluence-weighted mean of the stopping power.

For the same beam parameters, `LET_d` is generally greater than or equal to
`LET_t`, with the difference becoming more noticeable near the Bragg peak.

### Return Value

The function returns LET in **keV/µm**:

- a Python `float` when all arguments are scalars;
- a NumPy array when at least one argument is a list or NumPy array.

### Example

The two averaging conventions can be compared for the same proton beam:

```python
import numpy as np
import pyamtrack

depth_cm = np.linspace(0.0, 17.0, 500)
material = pyamtrack.materials.water_liquid

let_d_keV_um = pyamtrack.proton_models.let_wilkens(
    depth_cm=depth_cm,
    energy_MeV=150.0,
    energy_spread_fraction=0.01,
    material=material,
    averaging="dose",
)

let_t_keV_um = pyamtrack.proton_models.let_wilkens(
    depth_cm=depth_cm,
    energy_MeV=150.0,
    energy_spread_fraction=0.01,
    material=material,
    averaging=pyamtrack.proton_models.Averaging.TRACK,
)

index_10cm = np.abs(depth_cm - 10.0).argmin()
print(f"LET_d at 10 cm: {let_d_keV_um[index_10cm]:.3g} keV/µm")
print(f"LET_t at 10 cm: {let_t_keV_um[index_10cm]:.3g} keV/µm")
```

## Cartesian-Product Evaluation

Elementwise evaluation is useful when corresponding values are already paired.
For example, the first depth is evaluated with the first energy:

```python
import pyamtrack

depths_cm = [2.0, 8.0]
energies_MeV = [100.0, 150.0]

let_elementwise = pyamtrack.proton_models.let_wilkens(
    depths_cm,
    energies_MeV,
    averaging="track",
)
```

To evaluate every depth at every energy, use `cartesian_product=True`:

```python
import pyamtrack

let_all_combinations = pyamtrack.proton_models.let_wilkens(
    depths_cm,
    energies_MeV,
    averaging="track",
    cartesian_product=True,
)

print(let_all_combinations.shape)  # (2, 2)
```

The same option is available for `dose_bortfeld`, including its fluence,
energy-spread, material, and `eps` arguments.

## Validation and Errors

The functions raise an error when:

- a depth is negative;
- `energy_MeV` is outside `[0.1, 10000.0]`;
- `energy_spread_fraction` is outside `(0, 1)`;
- `eps` is outside `[0, 1)` for `dose_bortfeld`;
- a material ID is invalid;
- vector inputs have incompatible lengths in elementwise mode;
- an invalid value is supplied for `averaging`.

Material names such as `"water_liquid"` are not accepted directly as function
arguments. Use the corresponding material ID or a `Material` object instead:

```python
import pyamtrack
from pyamtrack import materials

water = materials.water_liquid
dose = pyamtrack.proton_models.dose_bortfeld(
    depth_cm=10.0,
    fluence_cm2=1e8,
    energy_MeV=150.0,
    material=water,
)
```

## References

- T. Bortfeld, “An analytical approximation of the Bragg curve for therapeutic
  proton beams,” *Medical Physics*, 24(12), 2024–2033 (1997).
- J. J. Wilkens and U. Oelfke, “Analytical linear energy transfer calculations
  for proton therapy,” *Medical Physics*, 30(5), 806–815 (2003).

See also:

- [Materials](materials.md)
- [Python installation](../installation.md)
- [Function porting status](../function-status.md)
