# Particles

The library provides a comprehensive particle system for particle transport calculations, including predefined particles commonly used in particle therapy and radiation physics.

## Overview

Each particle is characterized by physical properties, including its identifier, element name and acronym, mass number (`A`), and atomic number (`Z`).

## Particle Properties

Each Particle object has the following properties:

- **id** (`int`): Unique identifier for the particle
- **element_name** (`str`): Name of the particle element
- **A** (`int`): Mass number
- **Z** (`float`): Atomic number
- **I_eV_per_Z** (`float`): Ionization energy per proton
- **density_g_cm3** (`float`): Density \[g/cm3\] 
- **element_acronym** (`str`): Acronym of the particle element
- **atomic_weight** (`float`): Atomic weight - average mass of element’s isotopes

## Using Particles

### Creating Particle Objects
There are a few ways a particle object can be created:
- Using predefined particle constants

    ```python
    import pyamtrack.particles
    carbon = pyamtrack.particles.C
    ```

- Using a particle code (Z*1000 + A)
    ```python
    carbon = pyamtrack.particles.Particle.from_number(6012)
    ```
- Using nuclide notation string (e.g., "12C")
    ```python
    carbon = pyamtrack.particles.Particle.from_string("12C")
    ```

- Using atomic number (Z) directly
    ```python
    carbon = pyamtrack.particles.Particle(6)
    ```
    Warning!!! Particle created this way will have A parameter set to None. It should represent only the atomic nucleus.

### Passing particles as function arguments

You can pass a `Particle` object directly as an argument:

```python
import pyamtrack.stopping as stp
import pyamtrack.particles

particle_carbon = particles.C
results_carbon = stp.stopping_power(energies, particle=particle_carbon, material=1)
```

But there are other ways:
- Nuclide notation string (e.g., "12C")
    ```python
    import pyamtrack.stopping as stp
    import pyamtrack.particles

    particle_carbon = "12C"
    results_carbon = stp.stopping_power(energies, particle=particle_carbon, material=1)
    ```

- Particle code (A*1000 + Z)
    ```python
    import pyamtrack.stopping as stp
    import pyamtrack.particles

    particle_carbon = 6012
    results_carbon = stp.stopping_power(energies, particle=particle_carbon, material=1)
    ```