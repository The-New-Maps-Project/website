# The Algorithm

The New Maps Project Redistricting Algorithm was created with the purpose of assigning precincts to districts that are as compact, contiguous, and uniformly populated as possible.

### Overview

The algorithm is split into different rounds, each round split into different iterations and subiterations.

### Definitions

**Connected Precincts:** Two precincts are deemed "connected" if there exists a point within state lines where no other precincts are closer to that point than the two precincts in question.

**Connuity:** A district is considered continuous if there exists a path through connected districts between every pair of precincts from that district

**Grid Granularity:** The number of rows and columns made in the grid to determine connected precincts.

### Caveats

With a list of precincts, each with only latitute and longitude data, there is no sure way to determine whether two precincts are indeed connected, by the definition above. There are two reasons why:

1. Not every point in the plane can be checked to see if it satisfies the above criteria for two connected precincts
2. There is no way of determining for sure which areas are within state lines and which areas are outside of state lines with just a list of precinct locations.

However, inferences and estimates can be made to maximize the accuracy of deeming two precincts connected


## Determining Connected Precincts

To try to determine **connected precincts**, a large n x n grid must be created, from lowest to highest latitute and longitude of the precincts in the map. Each space in the grid represents a small range of latitute and longitute values.

All gridspaces that contain precincts are initially filled with the precinct they contain. Then, a process of eliminating gridspaces outside of state lines begins

### Eliminating Gridspaces Outside State Lines

Starting from the top of the grid, going from left to right, every gridspace in the first row is considered outside state boundaries until the first precinct filled gridspace is reached. For each subsequent row, going from left to right, the gridspaces are eliminated until a precinct filled gridspace is reached or the number of gridspaces eliminated in that row is equal to the number of gridspaces eliminated in the previous row. This is repeated for the next row until a row *begins* with a precinct filled gridspace. 

Then the same process is repeated starting at the top of the grid from right to left. Then starting from the bottom, form left to right, then from right to left. 

### Finding Connections

Each precinct filled gridspace will start to flood fill the remaining gridspaces, assigning each filled gridspace with a precinct. If during the flood fill a gridspace is already filled by another precinct, it will be assigned to whichever precinct is closest to the center of the gridsapce. When every gridspace is filled, precincts are considered connected if there exists two adjacent gridspaces that are each assigned to one of those two precincts.

## Random Assignment Round

Before Round One, the Algorithm will make sure every precinct is assigned by randomnly assigning every precinct a district in range if it is either not assigned or out of range.

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

For each iteration, the pair of bordering districts with the highest population ratio is found. Two districts are bordering if a precinct from one is connected to a precinct from the other. Then, from the district with the higher population, pick the precinct that is bordering the other district and is closest to the population center of the other district to switch to the other district.

Keep iterating until the **RSD** starts increasing instead of decreasing