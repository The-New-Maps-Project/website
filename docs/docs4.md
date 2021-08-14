# Browser Algorithm Runner

When data is inputed into the homepage Map Editing Suite, The New Maps Project Redistricting Algorithm can be run in the browser to assign the precincts in the map to districts, optimizing population distribution, compactness and continuity.

**Please read the "Algorithm" section of the documentation to understand how the algorithm works:**  [Read Here](/documentation/algorithm)

## Settings

Click the "Run Algorithm" button to show a popup with all the algorithm settings that can be set before running the algorithm. 

### Algorithm Settings

Please refer to the specific section "Settings & Parameters" for the algorithm, and the "Algorithm" section of the documentation for more information about what these settings do

- Subiterations vs Full Iterations for Round One. Full iterations recommended for larger data sets.
- Time between iterations (or subitrations) of Round One and Round Two
- Grid Granularity

### Graphing Settings

Settings for graphs of algorithm iteration data.

- Number of iterations between each plot on the graph, Round One and Round Two

## Running the Algorithm

After the "Run Algorithm" button is clicked, the graph of precinct connections will be made and a popup will show over the precinct list that will show data and progress of the browser algorithm.

For each round, an icon on the right will show it's status. A grey circle means it has not yet begun, three dots means it is in progress, and a green circle with a checkmark means it is completed.

The random assignment round will complete before the first iteration of Round One. If subiterations are selected, each district will be randomly assigned one-by-one, like a Round One subiteration.

The 