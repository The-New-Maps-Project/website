# Connecting Precincts

This is the algorithm used determine which precincts are deemed to be "connected" to each other. 

### Problems and Goals

To ensure maximum possible continuity in district mappings, it must be known which precincts on a map border each other. However, since The New Maps Project Algorithm represents the location of a precinct by just a point on a map (a latitute and longitude coordinate), there is no way of determining for sure which precincts are bordering each other.

However, inferences can be made as to which precincts are bordering each other by examining their geographical coordinates using an algorithm. Precincts that are inferred to be bordering are said to be **connected**.

A continuous district is defined as a district where all subsets of two precincts assigned to that district are connected through connected precincts. Please note that neither The New Maps Project Redistricting Algorithm nor the Packing/Cracking Districts Algorithm guarantees continuous districts.

## Finding Connected Precincts

Connected precincts are determined using a large grid representing the area of a state, filling in gridspaces with the closest precinct to that gridspace, and then determining connection if two adjacent gridspaces are filled by different precincts.

The approach taken by The New Maps Project to implement this procedure is outlined below:

### The Grid

A two dimensional square grid `n x n` from lowest to highest latitute and longitude of a precinct in the state is constructed, each gridspace representing a distinct coordinate on the map between the coordinate extremities. Gridspaces are divided equally, for both latitude and longitude, each covering an equal rectangular geographic area. The geographic center of the area each gridspace covers is the point that represents the gridspace.

The value `n` is referred to as the **grid granularity**.

### State Boundaries

Another caveat to using coordinate data per precinct is that there is no sure way to determine exact state boundaries. For the process of connecting precincts, gridspaces are not considered to be within state boundaries if they are further away from all precincts than each of their closest precincts. 

### Filling in the Grid

Each gridspace is unassigned at the start. First, gridspaces that contain the coordinates of precincts will be assigned that precinct. 

A basic floodfill algorithm is then used to fill the rest of grid in. A fundamental filling of one space checks the four adjacent spaces to it on the grid to see if it can be filled with the same precinct as the original gridspace. A adjacent gridspace will not be filled under these conditions:

1. It is already filled by the same precinct
2. The gridspace center is further away from the precinct than its closest precinct (likely out of state boundaries)
3. It is filled by another precinct, but that precinct is closer to that gridspace center
4. It is outside the grid

If, like in condition 3, the adjacent precinct is already filled by another precinct, connect the two precincts, because they occupy adjacent gridspaces.

### Iterations

Each iteration in this process will loop over the entire grid to fill in adjacent gridspaces of each gridspace that has already been filled (so unfilled gridspaces are not checked per iteration). If a gridspace cannot fill any of its adjacent gridspaces, because they all meet the above criteria, the gridspace is said to be unchanged. All other gridspaces checked during that iteration, with at least one adjacent gridspace being filled, are considered to be **changed**. To connect precincts, the algorithms will continue iterating until the changed precincts in an iteration is equal to zero