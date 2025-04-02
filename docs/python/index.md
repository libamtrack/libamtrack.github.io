# pyamtrack

pyamtrack is a Python wrapper for the libamtrack library, making it easier to access and use libamtrack's functionality directly from Python.

## Stable Release Information

The last stable release of pyamtrack is **0.14.0** (released on **2022-10-03**). However, this version has several limitations:
- It is only available as a binary wheel package for **Linux** (no support for Windows or macOS).
- There is no documentation describing the available functions or how to use them.

To install the stable release, run:
```bash
pip install pyamtrack
```

## Ongoing Development

A new version of pyamtrack is currently being developed, addressing these limitations. The new release will include:
- Support for **Linux, Windows, and macOS** (for Python >= 3.9).
- Full documentation detailing all available functions, their usage, and example applications.

The work is still in progress, and the latest **alpha release** can be installed via:
```bash
pip install --pre pyamtrack
```
*(Use at your own risk, as many things may still be broken.)*

## Installing Directly from GitHub

If you want to use the latest development version of pyamtrack directly from the GitHub repository, you can install it using the following command:
```bash
pip install git+https://github.com/libamtrack/pyamtrack.git
```

### Important Notes:
- **Compiler Requirement**: Since pyamtrack is a wrapper over C++/C code, installing it directly from the GitHub repository may require a C++ compiler to be installed on your system.
- **GSL Dependency**: The GNU Scientific Library (GSL) must be installed locally for the build process to succeed. On Linux, you can typically install it using your package manager, e.g.,:
  ```bash
  sudo apt-get install libgsl-dev
  ```
  On macOS, you can use Homebrew:
  ```bash
  brew install gsl
  ```
  For Windows, you may need to install GSL manually or use a package manager like vcpkg.

### Usage Example

Here's a quick example demonstrating how to use pyamtrack (ongoing development release):
```python
import pyamtrack

print(pyamtrack.beta_from_energy(150))
```