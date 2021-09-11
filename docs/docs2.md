# Map Content & Files

Maps can be visualized, analyzed and drawn from a specific data format in The New Maps Project website. The content of a map will be a collection of precincts, as well as a list of parameters and a set number of districts. 

## Precincts

A **precinct** is referred to as the smallest geographical unit that can be assigned to a district in a map (regardless if it corresponds to actual voting precincts or not). A precinct will have a population, a location (in latitude and longitude), and a district it is assigned to (although it will start off as unassigned, district 0). 

You can add other pieces of information to a precinct as well; these are called "parameters" and are commonly demographic data (like "% Women" or "% Republican"). Read more below.

## Parameters

Parameters are percentage values (between 0 and 1) that are characteristics unique to each precinct. Usually they are demographics like "% Hispanic" or "% Registered Democrat".

You can edit the parameters and their order under "parameters", when you open a map. Click the green plus button to add a parameter, and hover over the gears icon next to each parameter name to change the order (move left or right) or delete a parameter. 

The order of the parameters matter if there are more than one parameters because that it is the order that they will be listed per precinct in the data.

You can analyze the representation, population, and compactness of each parameter when you calculate the map statistics.

**Note:** Parameters MUST be percentage values between 0 and 1 for the calculations to work properly


## Files

The data for a map, which includes precincts and parameters, is imported as a file into The New Maps Project's Editing Suite. The file is always a plain text file (.txt) and the same file format is used for imported and exported files.

## File Format

Data is separated by line and separated by commas in each line (comma separated values). Please note that files are always ".txt" files and NOT ".csv" files.

The first line has data on the number of districts and the parameters. The first value in the first line is a whole number, the number of districts in the map. Each subsequent value in the first line is the name of a parameter, listed in order and separated by commas. 

**First Line Data**

```
    number of districts,parameter 1,parameter 2, ...
```

**Example:**

```
    8,% Democrat,% White,% College Graduate
```

This map will have eight (8) districts, and three parameters in the order of: % Democrat, % White, and % College Graduate. Note that there is no space between the parameter name and the commas.

For each subquent line in the file, every line contains data for one precinct. A precinct has 5 required fields: the name, the district it is assigned to, the latitute, the longitude, and the population. These fields are listed in this order in each line of the file.

If in the first line, the map is specified to have parameters, every precinct MUST list the exact amount of parameter values specified, IN THE ORDER they were specified in the first line

**Data Per Precinct:**

```
    name,district,latitute,longitude,population,param1,param2,...
```

**Example:**

Using the previous example for a map with three parameters: % Democrat, % White, and % College Graduate:

```
    Springfield,2,40.124,-79.438,3451,0.45,0.67,0.16
```

For this line of data, the precinct of Springfield is in District 2, has a location of ( 40.124N , 79.428W ), has a population of 3451, is 45% Democrat, 67% White, and 16% of it's residents have graduated from college.

**NOTE:** District zero is "unassigned". When a group of precincts are not assigned to a district yet, list "0" as the district they are assigned to.

## Importing and Exporting Data

On the homepage, the red "Import Data" button is used to upload text files in the format specified above to view on the map and interact with. 

The blue "Export" button to the left is to download the data for the current map in the homepage after edits and district assignments.

Read more in the "Homepage" section of the documentation