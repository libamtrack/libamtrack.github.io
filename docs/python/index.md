# Introduction

pyamtrack is a Python wrapper for the libamtrack library, making it easier to access and use libamtrack's functionality directly from Python.

## Quick Installation

To install the latest development release of pyamtrack (recommended), run:
```bash
pip install --pre pyamtrack
```

**Note**: The development release may contain experimental features and changes that are still under testing. Use it with caution.

For more detailed installation instructions, including installing from the GitHub repository, refer to the [Installation Guide](installation.md).

## Usage Example

Here's a quick example demonstrating how to use pyamtrack:
```python
import pyamtrack

print(pyamtrack.beta_from_energy(150))
```