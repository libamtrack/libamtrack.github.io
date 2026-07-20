---
sidebar_position: 5
---
# Data Types

This document describes which Python/NumPy types are accepted by `pyamtrack` functions and how `pyamtrack` interprets inputs (scalars, lists, `numpy.ndarray`) and what types it returns.

---

## 1. Glossary

### Scalar
In `pyamtrack`, a scalar is a Python object of type:
- `float`
- `int`
- `np.float64` / `np.float32`

A scalar is treated as a single value (not as a sequence).

### Array-like
In `pyamtrack`, “array-like” means:
- `list` (Python list)
- `numpy.ndarray`

**Note:** `tuple` and `set` is not treated as array-like and will usually raise a `TypeError`. `NOT IMPLEMENTED YET`

**Note:** `0-d numpy.ndarray` and `0-d python lists` are treated as arrays-like type not scalars

---

### Special floating values
`NaN` and `±inf` are accepted as scalar/array inputs and are forwarded to the underlying kernels. Outputs follow IEEE‑754 semantics and the specific model implementation; in practice, `NaN` inputs yield `NaN` outputs, and `inf` inputs may yield `NaN`.

```python
import pyamtrack # first we import the library
```

```python
range_m = pyamtrack.stopping.electron_range(E_MeV = float("nan"))
# float("nan) -> NaN (undefined)
# range_m -> NaN
```

```python
range_m = pyamtrack.stopping.electron_range(E_MeV = -1 / float('inf'))
# -1 / x_MeV -> -0.0
# range_m -> 0.0  (zero-energy electron has zero range)
```

## 2. Input types

### 2.1. Numeric Python values

Most commonly accepted types are:
- `float`
- `int`
- `np.float64/32`  

Many functions also work with mixed numeric elements inside lists (e.g. `[1, 2.0, 3]`), but this depends on the conversion path.

If an argument is not `float`, `int`, `list`, or `numpy.ndarray`, a `TypeError` will be raised.

**Example:**

```python
import pyamtrack # first we import necessary libraries
import numpy as np 
```

```py
pyamtrack.stopping.electron_range((50.0,))
# TypeError: Input must be a float, int, list, or 0-D/1-D NumPy array.
```


```python

range_m = pyamtrack.stopping.electron_range(E_MeV = 50.0)
# E_MeV = 50.0 (float) -> range_m = 0.2537 (float)

```
```python
range_m = pyamtrack.stopping.electron_range(E_MeV = 1)
# E_MeV = 1 (int, promoted to double internally) -> range_m = 0.0044 (float)
```
```python
range_m = pyamtrack.stopping.electron_range(E_MeV = np.float64(50.0))
# E_MeV = 50.0 (np.float64) -> range_m = 0.2537 (Python float, NOT np.float64)

```

---

### 2.2. Python lists (`list`)

Many functions accept a list of values and return a vectorized result.

Example:

```python
import pyamtrack # first we import the library
```


```py
E_MeV = [50.0, 100.0, 150.0]
range_m = pyamtrack.stopping.electron_range(E_MeV = E_MeV)
# E_MeV -> [50.0, 100.0, 150.0] MeV
# range_m -> numpy.ndarray([0.2537, 0.4245, 0.5689])  (shape (3,), dtype float64)
# range_m[i] corresponds to E_MeV[i], same order preserved
```

#### List lengths in multi-argument functions
For functions that take multiple arguments (e.g. `electron_range(energy, material, model)`), if you pass lists in more than one argument, their lengths must match in “element-wise” mode.

If they do not match:
- `ValueError: Incompatible lists/arrays size`

---

### 2.3. NumPy arrays (`numpy.ndarray`)

`pyamtrack` accepts `numpy.ndarray`, but the wrappers have important constraints depending on the execution mode.

#### Floating-point precision (dtype) and casting

Most `pyamtrack` numerical kernels are implemented in C/C++ and operate on **double precision** (`float64`) values. As a result, `numpy.ndarray` inputs are typically **cast to `float64`** (C++ `double`) by the binding/wrapper layer before computation.

This has a few important consequences:

- Passing `float32`, `float16`, or other floating dtypes usually **does not preserve the original precision** during computation; values are converted to `float64` first.
- The conversion may require an **implicit copy** of the input array, which can increase memory use and reduce performance for large arrays.
- If you need strict control over dtype/precision for performance or memory reasons, be aware that the current `pyamtrack` API is effectively **`float64`-centric** for floating-point computations.

**Recommendation:** when using NumPy arrays, prefer explicit `float64` inputs to make the conversion behavior obvious:

```python
x = np.asarray(x, dtype=np.float64)
```

#### 2.3.1. Element-wise mode (“zip-style” vectorization)
In element-wise mode (`wrap_multiargument_function`), NumPy arrays must be:
- **one-dimensional (1-D)**

If `ndim != 1`:
- `ValueError: Input NumPy array must be 1-D.`

Dtype:
- values are typically cast to `double` (float64) in the wrapper
- if the dtype cannot be cast:
  - `TypeError: 1-D NumPy array dtype cannot be cast to double or input is not suitable.`

Example:

```python
import pyamtrack # first we import the library
```


```py
E_MeV = np.array([50.0, 100.0], dtype=np.float64)
range_m = pyamtrack.stopping.electron_range(E_MeV = E_MeV)
# range_m -> numpy.ndarray([0.2537, 0.4245])  (shape=(2,), dtype=float64)
```

#### 2.3.2. Cartesian product mode (combinatorics)
In cartesian product mode (`wrap_cartesian_product_function`), NumPy arrays:
- may be multi-dimensional (e.g. `(2,2)`, `(10,10,10)`),
- but must be **C-contiguous** (row-major contiguous in memory).

If an array is not C-contiguous:
- `ValueError: NDArray must be C-contiguous. Use numpy.ascontiguousarray(your_array) before passing it.`

In this mode, input ndarrays are flattened to 1-D for generating combinations, while the original shape is recorded for shaping the output (depending on the wrapper).

Example:
```py
import pyamtrack
import numpy as np
```

```python
energy_MeV = np.array([[50.0, 100.0],
                        [150.0, 200.0]], order="C")   # 4 energy values (flattened), MeV
material = np.array([1, 2, 3], dtype=np.int64)         # 3 material IDs
model = ['tabata', 'waligorski']                       # 2 models (Python list, NOT a NumPy array!)

range_m = pyamtrack.stopping.electron_range(
    energy_MeV = energy_MeV,
    material = material,
    model = model,
    cartesian_product = True,
)
# range_m.shape -> (4, 3, 2)
# range_m[i, j, k] = electron_range(E_MeV.flat[i], material_id[j], model_id[k])
# total combinations = 4 * 3 * 2 = 24
```

---

## 3. Return types (outputs)

### 3.1. Scalar in → scalar out
If all arguments are scalars (`float`/`int`), the result is a scalar (Python `float`).

Example:

```python
import pyamtrack # first we import the library
```

```py
range_m = pyamtrack.stopping.electron_range(E_MeV = 100.0, material_id = 1, model_id = 7)
# range_m -> 0.4245 (Python float)
```

### 3.2. Array-like in → numpy.ndarray out
If at least one argument is a list or `numpy.ndarray` in element-wise mode, the result is usually a 1‑D `numpy.ndarray` with length matching the list/array length.

Example:
```py
E_MeV = [50.0, 100.0]
range_m = pyamtrack.stopping.electron_range(E_MeV = E_MeV, material_id = 1, model_id = 7)
# material_id=1 and model_id=7 stay scalar -> broadcast to match E_MeV's length
# range_m -> np.ndarray([0.2537, 0.4245])  (shape=(2,), dtype=float64)
```

### 3.3. Cartesian product → numpy.ndarray (multi-dimensional)
If `cartesian_product=True`, the result is a `numpy.ndarray` whose size corresponds to the number of argument combinations.

Example:

```py
import pyamtrack
import numpy as np
```

```py

E_MeV = np.array([50.0, 100.0])           # 2 energies
material_id = [1, 2, 3]                   # 3 materials
model_id = [7, 8]                         # 2 models

range_m = pyamtrack.stopping.electron_range(
    E_MeV=E_MeV,
    material_id=material_id,
    model_id=model_id,
    cartesian_product=True,
)

print(range_m.shape)
# (2, 3, 2)

# Interpretation:
# range_m[i, j, k] = electron_range(E_MeV[i], material_id[j], model_id[k])
# total combinations = 2 * 3 * 2 = 12
```

---

## 4. Broadcasting (scalar expansion)

In element-wise mode, if you pass a mix of:
- one argument as a vector (list/ndarray) of length `N`,
- another argument as a scalar,

the scalar will be **expanded** to length `N` (broadcast to 1‑D) and the computation is done element-wise.

Example:
```py
E_MeV = [50.0, 100.0, 150.0]
range_m = pyamtrack.stopping.electron_range(E_MeV = E_MeV, material_id = 1, model_id = 7)
# material_id=1, model_id=7 broadcast internally to:
#   material_id = [1, 1, 1], model_id = [7, 7, 7]
# equivalent to:
#   electron_range(E_MeV=50.0,  material_id=1, model_id=7)
#   electron_range(E_MeV=100.0, material_id=1, model_id=7)
#   electron_range(E_MeV=150.0, material_id=1, model_id=7)
# range_m -> np.ndarray([0.2537, 0.4245, 0.5689])
```

---

## 5. Errors and exceptions

Below are typical exceptions raised by the wrappers:

### 5.1. Unsupported argument type
**TypeError**:
- `Input must be a float, int, list, or 0-D/1-D NumPy array.`
- `Input must be a float, int, list, or NumPy array.` (cartesian product mode)

Typical causes:
- passing `tuple`, `dict`, user-defined objects, `None`, etc.

### 5.2. Incompatible list/array lengths in element-wise mode
**ValueError**:
- `Incompatible lists/arrays size`

### 5.3. Wrong ndarray dimensionality in element-wise mode
**ValueError**:
- `Input NumPy array must be 1-D.`

### 5.4. Non C-contiguous ndarray in cartesian product mode
**ValueError**:
- `NDArray must be C-contiguous. Use numpy.ascontiguousarray(your_array) before passing it.`

### 5.5. Dtype cannot be cast to double
**TypeError**:
- `1-D NumPy array dtype cannot be cast to double or input is not suitable.`

---

## 6. Practical recommendations

1. If you have a `tuple`, convert it to a list:
   ```py
   x = (1.0, 2.0)
   x = list(x)
   ```

2. If you have multi-dimensional NumPy data and use `cartesian_product=True`, ensure it is C-contiguous:
   ```py
   x = np.ascontiguousarray(x)
   ```

3. If a function in element-wise mode complains about `1-D`, use `.ravel()` or `.reshape(-1)`:
   ```py
   x = np.asarray(x).ravel()
   ```

---

## 7. “Element-wise” vs “Cartesian product” — quick comparison

| Mode | Purpose | How it combines arguments | Typical output |
|------|---------|----------------------------|----------------|
| element-wise | zip-style vectorization | (a[i], b[i], c[i]) | 1-D `np.ndarray` |
| cartesian product | combinations | all combinations of arguments | N-D `np.ndarray` |