# Connecting Precincts

The procedure in The New Maps Project Algorithm and for packing/cracking districts to determine which precincts are connected to each other. 

### Problems and Goals

To ensure maximum possible continguity in district mappings, it must be known which precincts on a map border each other. However, since The New Maps Project Algorithm represents the location of a precinct by just a point on a map (a latitute and longitude coordinate), there is no way of determining for sure which precincts are bordering each other.

However, inferences can be made as to which precincts are bordering each other by examining their geographical coordinates using an algorithm. Precincts that are inferred to be bordering are said to be **connected**.

A continguous district is defined as a district where all subsets of two precincts from that district are connected through connected precincts. Please note that neither The New Maps Project Redistricting Algorithm nor the Packing/Cracking Districts Algorithm guarantees continguous districts.

## Finding Connected Precincts

Connected precincts are determined using a large grid representing the area of a state, filling in gridspaces with the closest precinct to that gridspace, and then determining connection if two adjacent gridspaces are filled by different precincts.

The approach taken by The New Maps Project to implement this procedure is outlined below:

### The Grid

A two dimensional square grid `n x n` from lowest to highest latitute and longitude of a precinct in the state is constructed, each gridspace representing a distinct coordinate on the map between the coordinate extremities. Gridspaces are divided equally, for both latitude and longitude, each covering an equal rectangular geographic area. The geographic center of the area each gridspace covers is the point that represents the gridspace

### State Boundaries

Another caveat to using coordinate data per precinct is that there is no sure way to determine exact state boundaries. For the process of connecting precincts, gridspaces are not considered to be within state boundaries if they are further away from all precincts than each of their closest precincts. 