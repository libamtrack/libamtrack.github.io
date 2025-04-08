---
sidebar_position: 4
---

# Porting Status

## Status Overview

This document provides information about which libamtrack functions have been ported to the pyamtrack Python wrapper. Not all libamtrack functions are currently available in pyamtrack, as the porting process is ongoing.

:::info

The tables below show the status of various function groups:
- ✅ **Fully Ported**: Function is available and tested in pyamtrack
- 🚧 **During Porting**: Function is being implemented or tested
- ❌ **Not Ported**: Function is available in libamtrack but not yet ported to pyamtrack

:::


## Particle Data

Functions for accessing and manipulating particle data.

| Python Module | Status | C/C++ Source |
|-----------------|--------|--------------|
| `particle` | ❌ Not Ported | [AT_ParticleData.h](https://github.com/libamtrack/library/blob/master/include/AT_DataParticle.h#L82) |

## Material Data

Functions for accessing and manipulating material properties.

| Python Module | Status | C/C++ Source |
|-----------------|--------|--------------|
| [`materials`](API/materials.md) | ✅ Fully Ported | [AT_MaterialData.h](https://github.com/libamtrack/library/blob/master/include/AT_DataMaterial.h#L82) |


## Converters

Functions for converting between different physical quantities.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| [`converters.beta_from_energy`](API/converters.md#beta_from_energy) | ✅ Fully Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L68) |
| [`converters.energy_from_beta`](API/converters.md#energy_from_beta) | ✅ Fully Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L68) |
| `converters.gamma_from_energy` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L152) |
| `converters.energy_from_gamma` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L112) |
| `converters.energy_from_momentum` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L132) |
| `converters.momentum_from_energy` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L419) |
| `converters.dose_from_fluence` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L446) |
| `converters.fluence_from_dose` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L485) |
| `converters.energy_per_amu_from_energy` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L51) |
| `converters.energy_from_energy_per_amu` | ❌ Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L59) |

## Stopping Power

Functions for calculating stopping power of ions and protons and range of particles in materials.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `stopping.mass_stopping_power` | ❌ Not Ported | [AT_StoppingPower.h](https://github.com/libamtrack/library/blob/master/include/AT_StoppingPower.h#L151) |
| [`stopping.electron_range`](API/stopping/electron_range.md) | ✅ Fully Ported | [AT_ElectronRange.h](https://github.com/libamtrack/library/blob/master/include/AT_ElectronRange.h#L230) |
| `stopping.csda_range` | ❌ Not Ported | [AT_StoppingPower.h](https://github.com/libamtrack/library/blob/master/include/AT_DataRange.h#L112) |
| `stopping.bortfeld_proton_range` | ❌ Not Ported | [AT_ProtonAnalyticalBeamParameters.h](https://github.com/libamtrack/library/blob/master/include/AT_ProtonAnalyticalBeamParameters.h#L90) |

## Energy Loss Straggling

Functions for energy loss straggling calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `straggling.energy_loss_distribution` | ❌ Not Ported | [AT_EnergyLoss.c](https://github.com/libamtrack/library/blob/master/src/AT_EnergyLoss.c#L362) |

## Scattering

Functions for particle scattering calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `scattering.angle_distribution` | ❌ Not Ported | [AT_MultipleCoulombScattering.h](https://github.com/libamtrack/library/blob/master/include/AT_MultipleCoulombScattering.h#L247) |

## Proton Pencil Beam Models

Functions for proton pencil beam dose and LET calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `proton.bortfeld_dose` | ❌ Not Ported | [AT_ProtonAnalyticalModels.h](https://github.com/libamtrack/library/blob/master/include/AT_ProtonAnalyticalModels.h#L63) |
| `proton.wilkens_let` | ❌ Not Ported | [AT_ProtonAnalyticalModels.h](https://github.com/libamtrack/library/blob/master/include/AT_ProtonAnalyticalModels.h#L106) |

## Track Structure Models

Functions for track structure calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `track.radial_dose` | ❌ Not Ported | [AT_RDD.h](https://github.com/libamtrack/library/blob/master/include/AT_RDD.h) |
| `track.track_width` | ❌ Not Ported | [AT_RDD.h](https://github.com/libamtrack/library/blob/master/include/AT_RDD.h) |

## Detector Response Models

Functions for calculating detector response using various models.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `detector.hcp_response` | ❌ Not Ported | [AT_SuccessiveConvolutions.h](https://github.com/libamtrack/library/blob/master/include/AT_SuccessiveConvolutions.h) |
| `detector.gamma_response` | ❌ Not Ported | [AT_GammaResponse.h](https://github.com/libamtrack/library/blob/master/include/AT_GammaResponse.h) |

## Cell Survival Models

Functions for calculating cell survival.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `survival.katz_cell_survival` | ❌ Not Ported | [AT_KatzModel.h](https://github.com/libamtrack/library/blob/master/include/AT_KatzModel.h#L154) |
| `survival.katz_inact_cross_sect` | ❌ Not Ported | [AT_KatzModel.h](https://github.com/libamtrack/library/blob/master/include/AT_KatzModel.h#L62) |


## Contributing to Function Porting

If you're interested in helping port more functions from libamtrack to pyamtrack, please visit the [pyamtrack GitHub repository](https://github.com/libamtrack/pyamtrack) for more information on how to contribute.

The porting process typically involves:
1. Adding C++ wrapper functions in the pyamtrack source code
2. Binding these functions to Python using pybind11
3. Adding proper type handling for different input types (scalars, lists, numpy arrays)
4. Writing tests to ensure the ported functions work correctly
5. Documenting the new functions

Your contributions would be greatly appreciated!
