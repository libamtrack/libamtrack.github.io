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
| [`converters.beta_from_energy`](API/converters.md#beta_from_energy) | Fully Ported | [AT_PhysicsRoutines.c](https://github.com/libamtrack/library/blob/master/src/AT_PhysicsRoutines.c#L39) |
| [`converters.energy_from_beta`](API/converters.md#energy_from_beta) | Fully Ported | [AT_PhysicsRoutines.c](https://github.com/libamtrack/library/blob/master/src/AT_PhysicsRoutines.c#L55) |
| `converters.energy_from_momentum` | Not Ported | [AT_PhysicsRoutines.c](https://github.com/libamtrack/library/blob/master/src/AT_PhysicsRoutines.c#L90) |
| `converters.momentum_from_energy` | Not Ported | [AT_PhysicsRoutines.c](https://github.com/libamtrack/library/blob/master/src/AT_PhysicsRoutines.c#L68) |

## Stopping Power

Functions for calculating stopping power of particles in materials.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `stopping.calculate_stopping_power` | During Porting | [AT_StoppingPower.c](https://github.com/libamtrack/library/blob/master/src/AT_StoppingPower.c) |
| `stopping.calculate_csda_range` | Not Ported | [AT_StoppingPower.c](https://github.com/libamtrack/library/blob/master/src/AT_StoppingPower.c) |
| `stopping.calculate_mass_stopping_power` | Not Ported | [AT_StoppingPower.c](https://github.com/libamtrack/library/blob/master/src/AT_StoppingPower.c) |
| `stopping.get_stopping_data_from_pstar` | Not Ported | [AT_StoppingPower.c](https://github.com/libamtrack/library/blob/master/src/AT_StoppingPower.c) |

## Electron Range

Functions for electron range calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| [`electron.max_electron_range`](API/electron.md#max_electron_range) | Fully Ported | [AT_ElectronRange.c](https://github.com/libamtrack/library/blob/master/src/AT_ElectronRange.c) |
| `electron.effective_charge_from_energy` | During Porting | [AT_ElectronRange.c](https://github.com/libamtrack/library/blob/master/src/AT_ElectronRange.c) |
| `electron.electron_range_butts` | Not Ported | [AT_ElectronRange.c](https://github.com/libamtrack/library/blob/master/src/AT_ElectronRange.c) |
| `electron.electron_range_tabata` | Not Ported | [AT_ElectronRange.c](https://github.com/libamtrack/library/blob/master/src/AT_ElectronRange.c) |

## Track Structure Models

Functions for track structure calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `track.calculate_radial_dose` | During Porting | [AT_RDD.c](https://github.com/libamtrack/library/blob/master/src/AT_RDD.c) |
| `track.get_rdd_index` | Not Ported | [AT_RDD.c](https://github.com/libamtrack/library/blob/master/src/AT_RDD.c) |
| `track.rdd_katz_point_target` | Not Ported | [AT_RDD.c](https://github.com/libamtrack/library/blob/master/src/AT_RDD.c) |
| `track.rdd_katz_extended_target` | Not Ported | [AT_RDD.c](https://github.com/libamtrack/library/blob/master/src/AT_RDD.c) |
| `track.rdd_geiss` | Not Ported | [AT_RDD.c](https://github.com/libamtrack/library/blob/master/src/AT_RDD.c) |

## Cell Survival Models

Functions for calculating cell survival.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `survival.katz_model` | Not Ported | [AT_KatzModel.c](https://github.com/libamtrack/library/blob/master/src/AT_KatzModel.c) |
| `survival.calculate_survival` | Not Ported | [AT_KatzModel.c](https://github.com/libamtrack/library/blob/master/src/AT_KatzModel.c) |
| `survival.survival_from_dose` | Not Ported | [AT_KatzModel.c](https://github.com/libamtrack/library/blob/master/src/AT_KatzModel.c) |

## Energy Loss Straggling

Functions for energy loss straggling calculations.

| Python Function | Status | C/C++ Source |
|-----------------|--------|--------------|
| `straggling.calculate_vavilov_energy_loss` | Not Ported | [AT_EnergyLoss.c](https://github.com/libamtrack/library/blob/master/src/AT_EnergyLoss.c) |
| `straggling.calculate_landau_energy_loss` | Not Ported | [AT_EnergyLoss.c](https://github.com/libamtrack/library/blob/master/src/AT_EnergyLoss.c) |
| `straggling.energy_loss_after_slab` | Not Ported | [AT_EnergyLoss.c](https://github.com/libamtrack/library/blob/master/src/AT_EnergyLoss.c) |

## Contributing to Function Porting

If you're interested in helping port more functions from libamtrack to pyamtrack, please visit the [pyamtrack GitHub repository](https://github.com/libamtrack/pyamtrack) for more information on how to contribute.

The porting process typically involves:
1. Adding C++ wrapper functions in the pyamtrack source code
2. Binding these functions to Python using pybind11
3. Adding proper type handling for different input types (scalars, lists, numpy arrays)
4. Writing tests to ensure the ported functions work correctly
5. Documenting the new functions

Your contributions would be greatly appreciated!