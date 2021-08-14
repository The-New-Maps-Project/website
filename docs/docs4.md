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

## Algorithm Running Popup

After the "Run Algorithm" button is clicked, the graph of precinct connections will be made and a popup will show over the precinct list that will show data and progress of the browser algorithm.

For each round, an icon on the right will show it's status. A grey circle means it has not yet begun, three dots means it is in progress, and a green circle with a checkmark means it is completed.

The random assignment round will complete before the first iteration of Round One. If subiterations are selected, each district will be randomly assigned one-by-one, like a Round One subiteration.

The popup can be dragged around using the header with a black background. You can terminate the algorithm at any time using the "Terminate" button and be brought to the documenation by clicking the "how it works" text.

Click on a round of the algorithm in the popup to show it's data and graphs.

### Round One

When Round One is running, the % unchanged value of full iterations will be graphed on a line graph in the "Round One" section of the algorithm popup. The number of iterations will also show at the bottom, as well as the current % unchanged. Learn more about how Round One works in the "Algorithm" documentation.

## Round Two

A line graph of the RSD (Relative Standard Deviation) values of Round Two iterations will be graphed in the "Round Two" section of the algorithm popup. A bar graph will also appear underneath displaying the population of each district, updating every iteration of Round Two. The number of iterations and current RSD of district populations will also show.

## Finished

After the algorithm is finished running, the "Done" button in the "Finished" section of the algorithm popup will close out of the algorithm popup. The red "X" in the top right corner of the popup will also close out.