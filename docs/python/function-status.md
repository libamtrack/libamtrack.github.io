---
sidebar_position: 4
---

# Function Status

## Porting Status Overview

This document provides information about which libamtrack functions have been ported to the pyamtrack Python wrapper. Not all libamtrack functions are currently available in pyamtrack, as the porting process is ongoing.

The tables below show the status of various function groups:
- **Fully Ported**: Function is available and tested in pyamtrack
- **During Porting**: Function is being implemented or tested
- **Not Ported**: Function is available in libamtrack but not yet ported to pyamtrack

## Converters

Functions for converting between different physical quantities.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| [`converters.beta_from_energy`](API/converters.md#beta_from_energy) | Fully Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L68) |
| [`converters.energy_from_beta`](API/converters.md#energy_from_beta) | Fully Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L68) |
| `converters.gamma_from_energy` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L152) |
| `converters.energy_from_gamma` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L112) |
| `converters.energy_from_momentum` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L132) |
| `converters.momentum_from_energy` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L419) |
| `converters.dose_from_fluence` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L446) |
| `converters.fluence_from_dose` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L485) |
| `converters.energy_per_amu_from_energy` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L51) |
| `converters.energy_from_energy_per_amu` | Not Ported | [AT_PhysicsRoutines.h](https://github.com/libamtrack/library/blob/master/include/AT_PhysicsRoutines.h#L59) |

## Stopping Power

Functions for calculating stopping power of particles in materials.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `stopping.mass_stopping_power` | Not Ported | [AT_StoppingPower.h](https://github.com/libamtrack/library/blob/master/include/AT_StoppingPower.h#L151) |
| `electron.max_electron_range` | Not Ported | [AT_ElectronRange.h](https://github.com/libamtrack/library/blob/master/include/AT_ElectronRange.h) |
| `stopping.csda_range` | Not Ported | [AT_StoppingPower.h](https://github.com/libamtrack/library/blob/master/include/AT_DataRange.h#L112) |


## Track Structure Models

Functions for track structure calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `track.calculate_radial_dose` | During Porting | [AT_RDD.h](https://github.com/libamtrack/library/blob/master/include/AT_RDD.h) |
| `track.get_rdd_index` | Not Ported | [AT_RDD.h](https://github.com/libamtrack/library/blob/master/include/AT_RDD.h) |
| `track.rdd_katz_point_target` | Not Ported | [AT_RDD.h](https://github.com/libamtrack/library/blob/master/include/AT_RDD.h) |
| `track.rdd_katz_extended_target` | Not Ported | [AT_RDD.h](https://github.com/libamtrack/library/blob/master/include/AT_RDD.h) |
| `track.rdd_geiss` | Not Ported | [AT_RDD.h](https://github.com/libamtrack/library/blob/master/include/AT_RDD.h) |

## Cell Survival Models

Functions for calculating cell survival.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `survival.katz_model` | Not Ported | [AT_KatzModel.h](https://github.com/libamtrack/library/blob/master/include/AT_KatzModel.h) |
| `survival.calculate_survival` | Not Ported | [AT_KatzModel.h](https://github.com/libamtrack/library/blob/master/include/AT_KatzModel.h) |
| `survival.survival_from_dose` | Not Ported | [AT_KatzModel.h](https://github.com/libamtrack/library/blob/master/include/AT_KatzModel.h) |

## Energy Loss Straggling

Functions for energy loss straggling calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `straggling.calculate_vavilov_energy_loss` | Not Ported | [AT_EnergyLoss.h](https://github.com/libamtrack/library/blob/master/include/AT_EnergyLoss.h) |
| `straggling.calculate_landau_energy_loss` | Not Ported | [AT_EnergyLoss.h](https://github.com/libamtrack/library/blob/master/include/AT_EnergyLoss.h) |
| `straggling.energy_loss_after_slab` | Not Ported | [AT_EnergyLoss.h](https://github.com/libamtrack/library/blob/master/include/AT_EnergyLoss.h) |

## Contributing to Function Porting

If you're interested in helping port more functions from libamtrack to pyamtrack, please visit the [pyamtrack GitHub repository](https://github.com/libamtrack/pyamtrack) for more information on how to contribute.

The porting process typically involves:
1. Adding C++ wrapper functions in the pyamtrack source code
2. Binding these functions to Python using pybind11
3. Adding proper type handling for different input types (scalars, lists, numpy arrays)
4. Writing tests to ensure the ported functions work correctly
5. Documenting the new functions

Your contributions would be greatly appreciated!