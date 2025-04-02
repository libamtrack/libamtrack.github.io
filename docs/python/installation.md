---
sidebar_position: 2
---

# How to install

pyamtrack can be installed as a Python package, and it is available in two main forms: a stable release and an ongoing development version.
The wrapper source code is hosted in following repository: https://github.com/libamtrack/pyamtrack.git

## Recommended: Development Release

The latest development release includes new features and improvements. To install it, run:
```bash
pip install --pre pyamtrack
```

**Caution**: The development release may contain experimental features and changes that are still under testing. Use it with care, especially in production environments.

## Stable Release

The last stable release of pyamtrack is **0.14.0** (released on **2022-10-03**). However, this version has several limitations:
- It is only available as a binary wheel package for **Linux** (no support for Windows or macOS).
- There is no documentation describing the available functions or how to use them.

To install the stable release, run:
```bash
pip install pyamtrack
```

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