# Packing & Cracking Districts in the Browswer

This browser feature will run on the maps in the Editing Suite, with the purpose of maximizing or minimizing a certain parameter in a selected district, while keeping the district relatively continuous and compact, and keeping the district populations relatively uniform.

## Goal

Maximize or minimize a parameter in a specific district while preserving as much compactness continuity, and population uniformity (for all the districts) as possible. Please note that there is **no guarantee** of continuity, or improved or unchanged compactness (measured by ASDPC), or improved or unchanged population uniformity (measured by RSD).

The Packing/Cracking Algorithm was created for this purpose

## The Packing/Cracking Algorithm

This algorithm attempts to achieve the goals outlined above by repeatedly adding or remvoing a precinct to or from the district in focus. Each precincted added or removed is an iteration.

The district being packed/cracked is said to be **in focus** or **focused**, as well as the parameter trying to be minimize or maximized.

The district will attempt to lose a precinct if its population is over the average district population and attempt to gain a precinct if it is under the average.

## Losing a Preinct

The precinct furthest from the population center of the district in focus that fits the following criteria will be chosen to remove from that district:

1. Must be in the district in focus
2.  Must be on the border of the district in focus (connected to at least one precinct NOT in the district in focus)
3. At least one district it borders has a lesser population than the district in focus
4. Its value of the focused parameter is higher if cracking, or lower if packing than the average value of that parameter in the focused district.

This precinct will be reassigned from the focused district to the district it borders with the lowest population.

## Gaining a Precinct

The precinct closest to the popualtion center of the district in focus that fits the following criteria will be chosen to add to that district.

1. Must NOT be in the district in focus
2. Must be bordering the district in focus (connected to at least one precinct in the district in focus)
3. The district it is in has a greater population than the district in focus
4. Its value of the focused parameter is lower if cracking, or higher if packing than the average value of that parameter in the focused district.

This precinct will be reassigned from its original district to the focused district.

## Finishing

If on any iteration, gaining or losing, there does not exist a precinct that meets all the criteria for that iteration, the Packing/Cracking Algorithm automatically terminates.