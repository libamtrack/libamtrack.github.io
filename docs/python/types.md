---
sidebar_position: 5
---

# Types: scalars, lists, NumPy arrays (and float32 precision)

Most `pyamtrack` numerical functions are backed by C/C++ code and exposed through **nanobind**.
To make the API convenient, many functions accept:

- Python scalars (`float`, `int`)
- Python sequences (`list`, sometimes nested lists)
- NumPy arrays (`numpy.ndarray` / `ndarray`)

This page explains what you can pass, what output you should expect, and why you should **avoid `numpy.float32`** for numerically sensitive work.

---

## 1. Numeric scalars

In most places where a parameter is documented as `float` (or `float | int`), you can pass:

- `float` (Python’s float is a C `double`)
- `int` (will be converted and used where appropriate)

Example:

```python
import pyamtrack

pyamtrack.converters.beta_from_energy(150)       # int OK
pyamtrack.converters.beta_from_energy(150.0)     # float OK
```

Many wrapped functions internally convert scalar inputs to C++ `double` using `nb::cast<double>(...)`. 

---

## 2. Lists (vectorized “element-wise” calls)

Many multi-argument functions are wrapped so that you can pass **Python lists** and get **vectorized** results.
The wrapper checks whether an argument is a Python `list` and then applies the computation element-by-element.

Example:

```python
import pyamtrack

energies = [50.0, 100.0, 150.0]
r = pyamtrack.stopping.electron_range(energies, material=1, model="tabata")
# typically returns a NumPy array of float64 results
```

### Broadcasting scalars against lists/arrays
If at least one argument is list/array, scalar arguments are broadcast to match the vector length. 

---

## 3. NumPy arrays / ndarrays

### 3.1 Floating inputs (energies, continuous parameters, etc.)
For many numeric inputs (e.g. energies), you can pass a NumPy array.
Internally, wrappers cast ndarray inputs to a `double`-based view, i.e. values are consumed as **C++ `double`**. 
Recommended:

```python
import numpy as np
import pyamtrack

energy = np.asarray([50.0, 100.0, 150.0], dtype=np.float64)
r = pyamtrack.stopping.electron_range(energy, material=1, model="tabata")
```

### 3.2 Integer-coded inputs (IDs like `material` and `model`)
Some parameters are IDs (e.g. `material`, `model`) and accept:

- scalar `int`
- Python list of ints / objects (depending on parameter)
- NumPy arrays **with integer dtype**

The library checks integer dtypes explicitly: `int8/16/32/64` and `uint8/16/32/64`.
Example (material IDs as an int array):

```python
import numpy as np
import pyamtrack

energies = np.asarray([50.0, 100.0, 150.0], dtype=np.float64)
materials = np.asarray([1, 1, 1], dtype=np.int32)  # integer dtype required for ID arrays

r = pyamtrack.stopping.electron_range(energies, material=materials, model="tabata")
```

If you pass a NumPy array for an ID parameter but it is **not** an integer dtype, some wrappers will reject it.

---

## 4. 0-D arrays and 1-D arrays

Some wrappers accept **0-D** or **1-D** arrays (for vectorized evaluation).
For certain vectorized wrappers, NumPy array inputs are required to be **1-D** (otherwise a `ValueError` is raised). 

If you have higher-dimensional arrays, flatten them explicitly if that matches your intent:

```python
x = np.asarray(x)
x1d = x.reshape(-1)   # or x.ravel()
```

---

## 5. IMPORTANT: avoid `numpy.float32` (precision loss)

Even though `numpy.float32` values are *convertible* to C++ `double`, using float32 can silently reduce precision.

### Why?
- `numpy.float32` stores only ~7 decimal digits of precision.
- When you pass a float32 into `pyamtrack`, it is converted and used as a C++ `double`.
- But conversion **cannot restore precision that was already lost** when the value was stored as float32.

So if you start with float32 inputs (scalar or array), you may see differences compared to float64/Python-float inputs—especially in calculations sensitive to small relative errors.

### What to do instead
Prefer:
- Python `float` (scalar)
- `numpy.float64` (arrays)

Examples:

```python
import numpy as np

# Bad (may lose precision before conversion to C double)
x_bad = np.float32(0.1)
arr_bad = np.asarray([0.1, 0.2, 0.3], dtype=np.float32)

# Good
x_good = float(0.1)
arr_good = np.asarray([0.1, 0.2, 0.3], dtype=np.float64)

# If you receive float32 data, upcast early:
arr = np.asarray(arr_bad, dtype=np.float64)
```

### Rule of thumb
If a parameter represents a *continuous physical quantity* (energy, LET, stopping power inputs, etc.),
use **float64 / Python float** unless you have a strong reason not to.

---

## 6. Notes on return types

Many functions return:
- a Python `float` for scalar inputs
- a NumPy array (`float64`) for vectorized inputs
- and sometimes nested lists / arrays when using cartesian-product evaluation

See the docstring of each function for the exact behavior (for example, `stopping.electron_range` describes returning either a scalar or a NumPy array depending on input). 