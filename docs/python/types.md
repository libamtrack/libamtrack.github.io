---
sidebar_position: 5
---

# Input types (Python / NumPy) and numerical precision

`pyamtrack` is a Python interface to the C/C++ **libamtrack** library. Many functions accept either a **single number** or a **set of numbers** (a Python list or a NumPy array). Internally, most continuous physical quantities are computed using C/C++ **double precision** (`double`).

This page explains what you can pass to `pyamtrack` functions and how to avoid the most common numerical pitfalls—especially when using `numpy.float32`.

---

## Quick recommendations (safe defaults)

If you only read one section, read this:

- For **single values** (energy, LET, etc.): use Python `float`  
  (example: `150.0`, not `np.float32(150)`).
- For **arrays of values**: use NumPy arrays with `dtype=np.float64`.
- For **IDs** (material IDs, model IDs): use Python `int` or integer NumPy arrays (`np.int32` / `np.int64`).
- Avoid `numpy.float32` / `dtype=np.float32` for inputs to physics calculations unless you really know you can tolerate reduced precision.

---

## 1) What inputs are accepted?

Most numeric functions accept these input forms:

### A. A single number
Use when you want one result.

```python
import pyamtrack
pyamtrack.converters.beta_from_energy(150.0)
```

### B. A list of numbers
Use when you want results for multiple values.

```python
import pyamtrack
energies = [50.0, 100.0, 150.0]
pyamtrack.stopping.electron_range(energies, material=1, model="tabata")
```

### C. A NumPy array (`ndarray`)
Recommended for performance and clarity, especially for longer vectors.

```python
import numpy as np
import pyamtrack

energies = np.asarray([50.0, 100.0, 150.0], dtype=np.float64)
pyamtrack.stopping.electron_range(energies, material=1, model="tabata")
```

**Note:** Some functions require NumPy input arrays to be **1‑dimensional** (a simple vector).

---

## 2) Continuous values vs IDs (different “kinds” of inputs)

In `pyamtrack`, it helps to think of inputs in two categories:

### A. Continuous physical quantities (use float64)
Examples: energies, ranges, stopping power values, etc.

- Recommended dtype for arrays: **`np.float64`**
- Recommended type for scalars: Python **`float`**

### B. Integer identifiers (use integers)
Examples: `material` ID, sometimes model ID.

- Recommended dtype for arrays: **`np.int32`** or **`np.int64`**
- Recommended type for scalars: Python **`int`**

Example (material IDs as an integer array):

```python
import numpy as np
import pyamtrack

energies  = np.asarray([50.0, 100.0, 150.0], dtype=np.float64)
materials = np.asarray([1, 1, 1], dtype=np.int32)

pyamtrack.stopping.electron_range(energies, material=materials, model="tabata")
```

---

## 3) Why `numpy.float32` is not recommended

You will often see NumPy arrays created with `dtype=np.float32` to save memory. However, for `pyamtrack` this can be a bad default.

### What happens
Even though the C/C++ code uses `double`, if you store inputs as `float32`:

- the values are already rounded to about **7 significant digits**,
- and converting that float32 value to C/C++ `double` **cannot recover the lost precision**.

So you can get slightly different results compared to float64 inputs.

### What to do instead
Prefer `float64`:

```python
import numpy as np

# Not recommended for numerically sensitive inputs
x32 = np.asarray([0.1, 0.2, 0.3], dtype=np.float32)

# Recommended
x64 = np.asarray([0.1, 0.2, 0.3], dtype=np.float64)

# If you receive float32 from elsewhere, convert early:
x = np.asarray(x32, dtype=np.float64)
```

---

## 4) NumPy dtype vs C type (quick reference)

This is a short summary based on the NumPy documentation section
“Relationship Between NumPy Data Types and C Data Types”.  
([numpy.org](https://numpy.org/doc/stable/user/basics.types.html?utm_source=openai))

| Recommended NumPy dtype | NumPy “C-like” name | Rough C type | Notes |
|---|---|---|---|
| `np.int32` | *(no single alias on every platform)* | usually `int32_t` | fixed width (portable) |
| `np.int64` | `np.longlong` | `long long` | fixed width (portable) |
| `np.float32` | `np.single` | `float` | ~7 significant digits |
| `np.float64` | `np.double` | `double` | ~15–16 significant digits |

---

## 5) “One value” vs “many values”: how results are returned

Many functions behave like this:

- If you pass a **single value**, you get a **single value** back (Python `float`).
- If you pass a **list** or **NumPy array**, you get a **vector of results** back (often a NumPy array).

Example:

```python
import numpy as np
import pyamtrack

print(pyamtrack.converters.beta_from_energy(150.0))  # scalar -> scalar

arr = np.asarray([50.0, 100.0, 150.0], dtype=np.float64)
print(pyamtrack.converters.beta_from_energy(arr))    # array -> array
```

---

## 6) Practical checklist for users

Before running calculations, quickly check:

1. Are my **continuous values** stored as `float64`?
   - `np.asarray(x, dtype=np.float64)`
2. Are my **ID-like inputs** (materials/models) integers?
   - `np.asarray(ids, dtype=np.int32)` or plain `int`
3. Am I accidentally using `float32` because of upstream data loading?
   - If yes: upcast early to `float64`.

---
