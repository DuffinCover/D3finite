# D3finite
Team Project Repo for Datavis 

## Code

### Display Code
1. The general page layout: index.html
2. Styles: styles.css

### Logical Code
The entire visualization is driven by script.js which are:
  1. Satellite radial chart: worldView.js
  2. Satellite Details table: satelliteTable.js
  3. Visual Satellite Chart: visualSatelliteChart.js
  4. Selected Satellite Details: satelliteDetails.js

### Data Sources and Filtering
The date is filtered using python, and is convereted into JSON objects for us to then consume by our visualization. 
1. Filtering and conversion: data-process.py
2. Data file used initially: UCS-Satellite-Database-5-1-2022.csv
3. Data file used by visualization: satellite.json


## Libraries

We used base D3 and Simple Slider - a library all about creating simplistic sliders compatible with D3. Simple Slider source can be found here: https://github.com/johnwalley/d3-simple-slider

## Project Website 

https://duffincover.github.io/D3finite/

## Screencast

The youtubes

## Non-obvious Features (Or - A more complete feature list)
 1. It is included in the directions, but clicking on any satellite on the radial chart will focus the chart to that satellite's orbit. 
