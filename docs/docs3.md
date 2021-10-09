# Editing Suite

The homepage Map Editing Suite is the centerpiece of The New Maps Project's website. The purpose of it is to visualize, analyze, and draw districts, customizable and optimized to the user's needs. A map is made up of district, parameter, and precinct data, and this data is imported into and exported from the Editing Suite as a text file. See the "Map Content & Files" section of the documentation for more about map data and file format.

The following paragraphs go over some components of the homepage Editing Suite. More detail can be found in the subsequent sections of the documentation.

### Import and Export Buttons

Use these buttons to import and export data to and from a text file. The format for these files are all the same. 

Imported data will generally be added to existing data. Exceptions include the first line, and any precints with their exact names duplicated, in which data will be overrided.

Exported data will always export the current state of the data, including the precincts, the districts they are assigned to, and the parameters in order. If the same file is then imported, the data will be identical. However, please note there is no way to specify district color in a file, district color is a Editing Suite specific feature.

### Parameters Section

On the top left side of the Editing Suite, all the parameters for the map will be listed in order, from left to right and then from top to bottom.

The cogs icon next to each parameter name gives you options to delete  the parameter (the red "X" button), or swap it in order with the parameter to the left or right (the left and right arrows)

The green "+" button allows you to add a parameter. Specifiy the parameter name, and it will be added to the end of the parameter list.

### Creating Districts

Near the Import and Export buttons, there is a green button displaying how many districts are created. Click the button to show the districts popup. You can use this to set the amount of districts, as well as the color for each district.

Enter in a number of districts you want to set, and click "Set". This will create the exact amount of districts specified. There are ten available colors for districts, and the new districts will be automatically assigned a color in the order they are listed. Colors for districts can freely be changed by selecting one from the dropdown for each district. At the bottom of the popup, click the "Done" button for all changes to color and amount of districts to take shape. 

All markers on the map for precincts will show as the color of their assigned district, or grey if unassigned (district zero), or will not show if the district assignment is out of range or a specific district is selected to be "viewed alone" (read more about this below). 

If n districts are created, the range of the districts will be from 1 to n, district zero being unassigned.

### "Run Algorithm" Button

The "Run Algorithm" Button will show a popup where settings to run the browser algorithm can be toggled before it is run. The New Maps Project Redistricting Algorithm can be run on a map in the Editing Suite. Please see the "Browser Algorithm" section for details.

### The Visualized Map

The data from the map is plotted on the central map on the hompage. This map is an embedded Google Map and can be zoomed in and out, dragged around, and focused. Every precinct will show on the map as a dot marker, at the latitute and longitude location specified in the imported data. 

Each precinct's marker will be the color of the district it is assigned to, grey if it is not assigned, and invisible if it is out of range or is not in the district that is currently being "viewed alone"

#### Precinct Data

Every marker is clickable, and when a marker is clicked, a small window below the map will show, with information about the clicked precinct such as it's name, assigned district, population, and parameters. Click the "Switch" button to switch it's district.

### Precincts List

The list of precincts will show next to the map. If the total number of precincts is greater than 100, only the first 100 results will show. 

Each precinct entry will show it's name and assigned district. If the name of the precinct is clicked, the map will focus on the location of that precinct. If the assigned district is clicked, a popup to change the district assignment will show.

The "More" button for each precinct will show population and parameter information for the specific precinct

### Search, Sort, and Edit Precincts

The precinct list can be searched and sorted. The default sort is alphabetical from A to Z. Population is sorted in descending order, while districts and all parameters are sorted in ascending order (lower number districts and small parameter populations come first). A district can also be searched for by typing a keyword into the search box and clicking the magnifying glass icon. Only precinct names will be searched for the keyword. Click the magnifying glass icon again to eliminate the keyword search.

When the "Edit" button on top of the precinct list is clicked, precincts can be selected to be assigned or deleted. Click "Delete" or "Assign District" to delete or assign selected districts. "Select All" selects all the precincts in the map, while "Show Selected" will only show the selected precincts in the precincts list. Click the "Edit" button again to exit out of selecting precincts.

### Batch Assign

Batch assigning on the map is assigning precincts by clicking on their markers. Click the "Batch Assign" button on top of the map and choose a district to batch assign to. Now everytime a marker is hovered over, the precinct name will show. Click on the precinct and it will be assigned to the district selected. Click "close" to stop the batch assignment. Batch unassigning is also possible, just select "unassign" when selecting the district to batch assign to.

### Districts List and Viewing Alone

Below the map and the precincts list is a horizontal districts list. Each district will show it's population, color, and have an option to "View Alone"

When a district is viewed alone, only the precincts assigned to that district on the map will show. The element in the districts list will have an option to "Unselect", which will show all other districts again. 

## Analysis

To calculate the statistics of the current map drawing, click the grey "Calculate Stats" button below the map area. A new "Re-Calculate Stats" button will show up every time changes are made. If this button shows, that means that the stats have either not been calculated yet, or are not up to date.

**ASDPC:** Average Squared Distance to Population Center (a measure of compactness, measured in km).

### Disticts List

On the right side of the calculation results you will see a list of every district. Expand each to see some of it's statistics, for the whole district population as well as for specific parameters. The population count of each parameter population will show, not a percentage of total district population.

### Population Statistics

#### Population Distribution

You can see basic stats like the total population, average population per district, standard deviation across all districts, outlier districts, and median district population. Click the navy "Graph Data" button to see a bar chart of every district's population graphed, as well as a histogram. The first bar chart will show each district's population in ascending order. 

For parameters, the graphs will show the percent of the population of each district that is of that parameter, not the absolute population of that parameter.

#### Compactness (ASDPC)

Average Squared Distance to Population Center (ASDPC) is measured for each district as a measure of compactness. You can once again see some basic statistics regarding the ASDPCs across districts: mean, median, standard deviation, and outliers. Click the "Graph Data" button to see a bar chart and histogram of the ASDPCs of all districts

**Note:** Outliers are considered to be values that are more that two standard deviations from the mean.

#### Different Parameters and Representation

At the top of the left side of the calculation results section there is a select menu where you can select either the "Population" or a specific parameter to show statistics for (if you define a parameter). You can view population and ASDPC distribution of each of the parameter demographics as well.

It will also calculate the percent of the entire population of this parameter, as well as the percent of majority districts for the parameter. This difference can used to spot under or overrepresentation in a district mapping. 

### Precinct Statistics

Data about the precincts is given at the bottom of the analysis section in the Editing Suite. This includes the total number of precinct, the mean population per precinct, and the standard deviation of the precinct population sizes.

**Precinct Density Index** is measure of how densely packed precincts are on the map. The distance between the points at the minimum and maximum latitudes at the maximum longitude is computed and averaged with the distance between the points at the minimum and maximum latitude at the *minimum* longitude to compute an average latitude range. The longitude range is also computed in this way, at the mininum and maximum latitudes. The Precinct Density Index is given by:

```
    Precinct Density Index = Total # of precincts / (Latitude Range * Longitude Range) * 100
```

**Population Density Index** uses the same latitude and longitude ranges in calculation:

```
    Population Density Index = Total Population / (Latitude Range * Longitude Range)
```

This value is usually less than the population density of the state, for the state's land area is usually less than the product of the latitude and longitude ranges (thus the state's population density is greater than this index).