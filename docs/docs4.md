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

- Number of iterations between each plot on the graph, only for Round One and Round Two

## Algorithm Running Popup

After the "Run Algorithm" button is clicked, a popup will show over the precinct list that will show data and the current progress of the browser algorithm.

The rounds shown on the popup are the Connecting Precints Round, Round One, and Round Two. The Connecting Precincts Round will not be visualized on the map. 

For each round, an icon on the right will show it's status. A grey circle means it has not yet begun, three dots means it is in progress, and a green circle with a checkmark means it is completed.

Each round will also have a line graph, depicting a certain value (y-axis) over the number of iterations (x-axis). The Connecting Precincts Round will graph the number changed, Round One will graph percent unchanged, and Round Two will graph relative standard deviation of district populations. In addition, a bar graph will display for Round Two, showing the most up-to-date information on district populations, only while Round Two is running.

The Random Assignment Round will complete before the first iteration of Round One. If subiterations are selected, each district will be randomly assigned one-by-one, like a Round One subiteration. No data from the Random Assignment Round will be graphed.

The popup can be dragged around using the header with a black background. You can terminate the algorithm at any time using the "Terminate" button and be brought to the documenation by clicking the "how it works" text.

Click on a round of the algorithm in the popup to show its data and graphs.

## Connecting Precincts Round

A line graph will appear displaying the relationship between number changed (y-axis), and iteration count (x-axis), updating while the precincts are being connected under the "Connecting Precincts" section of the algorithm popup. Learn more about how the precincts are connected in the "Connecting Precincts" section of the documentation

## Round One

When Round One is running, a line graph showing the % unchanged value of full iterations on the y-axis and the full iteration count on the x-axis will appear under in the "Round One" section of the algorithm popup. Learn more about how Round One works in the "Algorithm" section of the documentation.

## Round Two

A line graph of the RSD (Relative Standard Deviation) of the district populations on the y-axis and iteration count on the x-axis will appear under the "Round Two" section of the algorithm popup. A bar graph will also appear underneath displaying the population of each district, updating only during every iteration of Round Two.

## Finished

After the algorithm is finished running, the "Done" button in the "Finished" section of the algorithm popup will close out of the algorithm popup. The red "X" in the top right corner of the popup will also close out.