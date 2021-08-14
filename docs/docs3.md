# Homepage

The homepage map editing suite is the centerpiece of The New Maps Project's website. The purpose of it is to visualize, analyze, and draw districts, customizable and optimized to the user's needs. A map is made up of district, parameter, and precinct data, and this data is imported into and exported from the editing suite as a text file. See the "Map Content & Files" section of the documentation for more about map data and file format.

The following paragraphs go over some components of the homepage editing suite. More detail can be found in the subsequent sections of the documentation.

### Import and Export Buttons

Use these buttons to import and export data to and from a text file. The format for these files are all the same. 

Imported data will generally be added to existing data. Exceptions include the first line, and any precints with their exact names duplicated, in which data will be overrided.

Exported data will always export the current state of the data, including the precincts, the districts they are assigned to, and the parameters in order. If the same file is then imported, the data will be identical. However, please note there is no way to specify district color in a file, district color is a editing suite specific feature.

### Parameters Section

On the top left side of the editing suite, all the parameters for the map will be listed in order, from left to right and then from top to bottom.

The cogs icon next to each parameter name gives you options to delete  the parameter (the red "X" button), or swap it in order with the parameter to the left or right (the left and right arrows)

The green "+" button allows you to add a parameter. Specifiy the parameter name, and it will be added to the end of the parameter list.

##


### Precincts List

On the right side, a list of the precincts will show. You can expand each precinct to show parameter info. Click on the name of the precinct shown to be directed to it on the map. Click on the district assignment (or "Unassigned") to assign it to a district.

You can search for a precinct, or click "Edit" to select precincts, where you can batch delete or assign. You can also sort them differently as well. Only the first 100 precinct results are shown.

### On the Map

The precinct will show up as a dot on the map (note that the bottom of the dot is placed where the latitude and longitude of the precint is). The color of the dot is the color of the district it is assigned to (it will be grey if unassigned). Click on the precinct dot on the map, and a info box about the precinct will pop up below the map. You can view parameter info and switch the distict here. 

## Districts

Districts are groupings of precincts. District maps are drawn by a unique grouping of precincts into multiple districts

### Set Districts

Click the green button near the top right that shows how many districts are currentl made (default is 0). Fill in the amount of districts you want to divide your map into, and customize the colors of each district if desired. Click the "Done" button at the bottom of the districts list to set these districts, and don't forget to save changes to the map.

### Manually Assign Precincts to Districts

There are multiple ways to manually assign precincts to districts. You can click on the icon on the map and click the "switch" button in the info box below the map. You can also do it in the precincts list on the right, where you can click the assigned district to reassign it, or click "Edit" to batch select and assign precincts to districts.

### Auto Assign Precincts to Districts

You can use The New Maps Project Algorithm, a simple way to group precincts into districts, on you map. Click the "NMP Algorithm" button near the districts button and the "Import Data" button to select a threshold and run the algorithm. Read more about how it works on [The New Maps Project website](https://thenewmapsproject.org/docs).

We suggest you initially run the algorithm on a set of precincts, then manually edit the map to get a desired result.


## Analysis

To calculate the statistics of the current map drawing, click the grey "Calculate Stats" button below the map area. This button will show up every time changes are made. If this button shows, that means that the stats have either not been calculated yet, or are not up to date.

**ASDPC:** Average Squared Distance to Population Center (a measure of compactness, measured in km).

## Disticts List

On the right side of the calculation results you will see a list of every district. Expand each to see some of it's statistics, for the whole district population as well as for specific parameters.

## Population Statistics

### Population Distribution

You can see basic stats like the total population, average population per district, standard deviation across all districts, outlier districts, and median district population. Click the navy "Graph Data" button to see a bar chart of every district's population graphed, as well as a histogram.

### Compactness (ASDPC)

Average Squared Distance to Population Center (ASDPC) is measured for each district as a measure of compactness. You can once again see some basic statistics regarding the ASDPCs across districts: mean, median, standard deviation, and outliers. Click the "Graph Data" button to see a bar chart and histogram of the ASDPCs of all districts

**Note:** Outliers are considered to be values that are more that two standard deviations from the mean.

### Different Parameters and Representation

At the top of the left side of the calculation results section there is a select menu where you can select either the "Population" or a specific parameter to show statistics for (if you define a parameter). You can view population and ASDPC distribution of each of the parameter demographics as well.

It will also calculate the percent of the entire population of this parameter, as well as the percent of majority districts for the parameter. This difference can used to spot under or overrepresentation in a district mapping. 