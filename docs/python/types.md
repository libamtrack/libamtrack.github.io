# pyamtrack — input types and vectorization behavior

This document describes which Python/NumPy types are accepted by `pyamtrack` functions and how `pyamtrack` interprets inputs (scalars, lists, `numpy.ndarray`) and what types it returns.

It specifically covers functions exported by modules (e.g. `pyamtrack.stopping`, `pyamtrack.converters`) that use the shared C++ wrappers in `src/wrapper/`.

---

## 1. Glossary

### Scalar
In `pyamtrack`, a scalar is a Python object of type:
- `float`
- `int`

A scalar is treated as a single value (not as a sequence).

### Array-like
In `pyamtrack`, “array-like” means:
- `list` (Python list)
- `numpy.ndarray`

**Note:** `tuple` is not treated as array-like and will usually raise a `TypeError`.

---

## 2. Input types

### 2.1. Numeric Python values

Most commonly accepted types are:
- `float`
- `int`

Many functions also work with mixed numeric elements inside lists (e.g. `[1, 2.0, 3]`), but this depends on the conversion path.

If an argument is not `float`, `int`, `list`, or `numpy.ndarray`, a type error will be raised.

**Example:**
```py
pyamtrack.stopping.electron_range((50.0,))
# TypeError: Input must be a float, int, list, or 0-D/1-D NumPy array.
```

---

### 2.2. Python lists (`list`)

Many functions accept a list of values and return a vectorized result.

Example:
```py
pyamtrack.stopping.electron_range([50.0, 100.0, 150.0])
# -> returns numpy.ndarray
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
```py
energy = np.array([50.0, 100.0], dtype=np.float64)
pyamtrack.stopping.electron_range(energy)
# -> numpy.ndarray(shape=(2,))
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
energy = np.array([[50.0, 100.0],
                   [150.0, 200.0]], order="C")
materials = np.array([1, 2, 3], dtype=np.int64)
models = np.array([7, 8], dtype=np.int64)

pyamtrack.stopping.electron_range(energy, materials, models, cartesian_product=True)
# -> numpy.ndarray with a shape derived from input shapes
```

---

## 3. Return types (outputs)

### 3.1. Scalar in → scalar out
If all arguments are scalars (`float`/`int`), the result is a scalar (Python `float`).

Example:
```py
pyamtrack.stopping.electron_range(100.0, 1, 7)
# -> float
```

### 3.2. Array-like in → numpy.ndarray out
If at least one argument is a list or `numpy.ndarray` in element-wise mode, the result is usually a 1‑D `numpy.ndarray` with length matching the list/array length.

Example:
```py
pyamtrack.stopping.electron_range([50.0, 100.0], 1, 7)
# -> np.ndarray(shape=(2,))
```

### 3.3. Cartesian product → numpy.ndarray (multi-dimensional)
If `cartesian_product=True`, the result is a `numpy.ndarray` whose size corresponds to the number of argument combinations.

---

## 4. Broadcasting (scalar expansion)

In element-wise mode, if you pass a mix of:
- one argument as a vector (list/ndarray) of length `N`,
- another argument as a scalar,

the scalar will be **expanded** to length `N` (broadcast to 1‑D) and the computation is done element-wise.

Example:
```py
energy = [50.0, 100.0, 150.0]
pyamtrack.stopping.electron_range(energy, material=1, model=7)
# model and material are scalars -> treated like [1, 1, 1] and [7, 7, 7]
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