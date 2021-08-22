# The Algorithm

The New Maps Project Redistricting Algorithm was created with the purpose of assigning precincts to districts that are as compact, contiguous, and uniformly populated as possible.

This is a documentation of version 2.0.

### Overview

The algorithm is split into different rounds, each round split into different iterations and subiterations.

## Connecting Precincts Round

For the rest of the algorithm to run, it must be known which precincts are bordering each other to ensure the best possible results regarding continuity of districts.

However, since each precinct is represented by a single point on the map, there is no way to determine for sure which precincts border each other. Therefore, inferences must be made. Precincts inferred to be bordering are considered to be **connected** precincts

### Algorithm to Determine Connected Precincts

View the [Connecting Precincts Reference](/documentation/connectingprecincts) in the documentation to learn about the algorithm used to determine connecting precincts. 

## Random Assignment Round

Before Round One, the Algorithm will make sure every precinct is assigned by randomnly assigning every precinct a district in range if it is either not assigned or out of range. (Range is from 1 to n, if there are n districts)

**Note:** in the browser algorithm, if "subiterations" are selected for Round One, then each precinct in the random assignment round will also be assigned one-by-one, with the time interval specified for a Round One subiteration

## Round One

**Goal:** Make the districts compact, continuous, and neatly shaped.

A full iteration of Round One consists of looping over every precinct in the map and calculating the following value for every district relative to that precinct:

```
    d = distance to district population center * district population
```

The precinct will be assigned to the district with the *lowest* `d` value.

For one precinct, this process of calculating `d` value and assigning it to a district is a single **subiteration**, while doing so for every precinct in the map is a **full iteration** of Round One. 

The **percent unchanged** for every iteration of Round One is the percent of the precincts that were already in the district with the lowest `d` value relative to them, and thus did not change district assignment. 

Round One stops when either the percent unchanged for an iteration hits 100% or has occurred in a previous iteration. 

## Round Two

**Goal:** Create districts with as little population variation as possible, while maintaining compact, neatly shaped, and continous districts.

Every iteration of Round Two switches the district of a precinct to lower the **relative standard deviation** or **RSD** of the district populations. 

For each iteration, the pair of bordering districts with the highest population ratio is found. Two districts are **bordering** if a precinct from one is connected to a precinct from the other. Then, from the district with the higher population, pick the precinct that is bordering the other district and is closest to the population center of the other district to switch to the other district.

Keep iterating until there exists an iteration at least two iterations before the current iteration that had the same RSD value, and the previous iteration does NOT equal this value. This means there is a loop in RSD values, and Round Two will terminate. 

Round Two is the final round of the algorithm, after it is done, the algorithm is done running.

### Continuity

There is **no guarantee** that all districts will be continuous after this algorithm is finished running. Although during Round Two, every precinct that is reassigned is connected to the district it is reassigned to, there is a possibility that it may disconnect the original district it was reassigned from. 