# Maps

Every new district drawing your create is a new "map". You will see a list of your created maps when you sign in. Simply click on "Open" to open the map. To switch to a new map, click the "Switch Map" text in the page header. 

**Important:** All changes must be saved to a map. Click the blue "Save" button in the top right corner to save all the changes to a map.

## Precincts

The New Maps Project Map Analysis site refers to the smallest geographical unit that can be assigned to a district in a map drawing. A precinct will have a population, a location (in latitude and longitude), and a district it is assigned to (although it will start off as unassigned). 

You can add other pieces of information to a precinct as well; these are called "parameters" and are commonly demographic data (like "% Women" or "% Republican") Read more about parameters below.

### Importing Precincts

Add precincts by importing data using a text file. Click the red "Import Data" button to do so. The file is a plain text file (.txt), and each precinct should be on a separate line. Each precinct will have its data separated by commas, in the following order:

```
    name,population,latitude,longitude,parameter1,parameter2,...
```

Parameter values are optional, but if you use them, they must be in the correct order. See more about parameters below.

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

## Parameters

Parameters are percentage values (between 0 and 1) that are characteristics unique to each precinct. Usually they are demographics like "% Hispanic" or "% Registered Democrat".

You can edit the parameters and their order under "parameters", when you open a map. Click the green plus button to add a parameter, and hover over the gears icon next to each parameter name to change the order (move left or right) or delete a parameter. 

The order of the parameters matter if there are more than one parameters because that it is the order that they will be listed per precinct in the imported data file. 

You can analyze the representation, population, and compactness of each parameter when you calculate the map statistics.

**Note:** Parameters MUST be percentage values between 0 and 1 for the calculations to work properly

## Analysis

To calculate the statistics of the current map drawing, click the grey "Calculate Stats" button below the map area. This button will show up every time changes are made. If this button shows, that means that the stats have either not been calculated yet, or are not up to date.

**ASDPC:** Average Squared Distance to Population Center (a measure of compactness, measured in km).

## Disticts List

On the right side of the calculation results you will see a list of every district. Expand each to see some of it's statistics, for the whole district population as well as for specific parameters.

## 