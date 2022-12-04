// import { sliderBottom } from 'd3-simple-slider';
class Worldview {
  constructor(global_state) {
    //importing global parameters
    this.globalState = global_state;
    this.sats = global_state.originalData;
    this.sampleSats = global_state.satelliteData;
    this.animate = true;

    // basic svg params
    this.width = 500;
    this.height = 500;
    this.margin = 20;

    this.fullWidth = 650;

    // initial data choice for drawing the chart and determining scale sizes.
    let scale_data = this.sampleSats;
    this.innerRadius = this.width / 5;
    this.outerRadius = this.width / 2 - this.margin;

    // scales for the radial chart
    this.x = d3
      .scaleUtc()
      .domain([Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1) - 1])
      .range([0, 2 * Math.PI]);

    this.y = d3
      .scaleLinear()
      .domain([
        d3.min(scale_data, (d) => d["Perigee (km)"]),
        d3.max(scale_data, (d) => d["Perigee (km)"]),
      ])
      .range([this.innerRadius, this.outerRadius + 10]);

    // Parameters for and html elements of the radial chart.
    let worldviewsvg = d3
      .select("#worldview")
      .append("svg")
      .attr("id", "satDistance")
      .attr("width", this.fullWidth)
      .attr("height", this.height)
      .attr("viewBox", [
        -this.width / 2 - 50,
        -this.height / 2,
        this.width + 150,
        this.height,
      ])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    let satDistance = d3.select("#satDistance");
    satDistance.append("g").attr("id", "globe");
    satDistance.append("g").attr("id", "x");
    satDistance.append("g").attr("id", "y");
    satDistance.append("g").attr("id", "satellites");

    //construct the visualization
    this.addGlobe();
    this.drawAxis(worldviewsvg);
    this.addSampleSlider();
    this.placeSatellites(scale_data);
    this.addYearSlider(scale_data);
  }

  /** Method for creating the radial chart axis and scales according to global sample data.
   *  Sourced from: https://observablehq.com/@d3/radial-area-chart and adapted to fit our
   * purposes.
   */
  drawAxis(svg) {
    // https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54

    let xAxis = (g) =>
      g
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .call((g) =>
          g
            .selectAll("g")
            .data(this.x.ticks())
            .join("g")
            .each((d, i) => (d.id = "month"))
            .call((g) =>
              g
                .append("path")
                .attr("stroke", "#000")
                .attr("stroke-opacity", 1)
                .attr(
                  "d",
                  (d) => `
              M${d3.pointRadial(this.x(d), this.innerRadius)}
              L${d3.pointRadial(this.x(d), this.outerRadius)}
            `
                )
            )
            .call((g) =>
              g
                .append("path")
                .attr("id", (d) => d.id.id)
                .datum((d) => [d, d3.utcMonth.offset(d, 1)])
                .attr("fill", "none")
                .attr(
                  "d",
                  ([a, b]) => `
              M${d3.pointRadial(this.x(a), this.innerRadius)}
              A${this.innerRadius},${this.innerRadius} 0,0,1 ${d3.pointRadial(
                    this.x(b),
                    this.innerRadius
                  )}
            `
                )
            )
            .call((g) =>
              g
                .append("text")
                .append("textPath")
                .attr("startOffset", 6)
                .attr("xlink:href", (d) => d.id.href)
                .text(d3.utcFormat("%B"))
            )
        );

    let yAxis = (g) =>
      g
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .call((g) =>
          g
            .selectAll("g")
            .data(this.y.ticks().reverse())
            .join("g")
            .attr("fill", "none")
            .call((g) =>
              g
                .append("circle")
                .attr("stroke", "#000")
                .attr("stroke-opacity", 0.2)
                .attr("r", this.y)
            )
            .call((g) =>
              g
                .append("text")
                .attr("y", (d) => -this.y(d))
                .attr("dy", "0.35em")
                .attr("stroke", "#fff")
                .attr("stroke-width", 5)
                .text((x, i) => `${x.toFixed(0)}${i ? "" : " km"}`)
                .clone(true)
                .attr("y", (d) => this.y(d))
                .selectAll(function () {
                  return [this, this.previousSibling];
                })
                .clone(true)
                .attr("fill", "currentColor")
                .attr("stroke", "none")
            )
        );

    svg.select("#x").call(xAxis);

    svg.select("#y").call(yAxis);
  }
  /**Takes a selection of satellite JSON objects and draws them as circles on the radial chart according to their
   * perigee. Satellites are colored by type of orbit. When a satellite is clicked, the chart focuses on satelites in the same orbit.
   */
  placeSatellites(satellites) {
    let svg = d3.select("#satellites");
    let angles = satellites.map((d) => Math.random() * Math.PI * 2);

    let sats = svg
      .selectAll("circle")
      .data(satellites)
      .join("circle")
      .attr("r", 5)
      .attr("opacity", 0.5)
      .attr("class", (d) => d["Class of Orbit"])
      .on("mouseover", (event, d) => {
        this.animate = false;
      })
      // if we have no other filters applied, this sets the filter. Otherwise it additionally filters
      // our already selected Data.
      .on("click", (event, d) => {
        this.globalState.group[6][1] = d["Class of Orbit"];
        updateAllGroup();
      })
      .transition()
      .duration(1000)
      .attr("cx", (d, i) => {
        return Math.cos(angles[i]) * this.y(d["Perigee (km)"]);
      })
      .attr("cy", (d, i) => {
        return Math.sin(angles[i]) * this.y(d["Perigee (km)"]);
      });
  }

  /**Creates the slider under the Radial chart for launch year. Shows all satellites that were launched on the selected year or earlier
   * sourced from: https://bl.ocks.org/johnwalley/raw/e1d256b81e51da68f7feb632a53c3518/?raw=true
   */
  addYearSlider(satellites) {
    d3.select("#satDistance")
      .append("g")
      .append("text")
      .attr("id", "slider-time")
      .attr("transform", "translate(290, -235)")
      .text("");

    let dataTime = this.getLaunchDates(satellites);

    let sliderTime = d3
      .sliderRight()
      .min(d3.min(dataTime))
      .max(d3.max(dataTime))
      .step(1000 * 60 * 60 * 24 * 365)
      .height(400)
      .width(10)
      .tickFormat(d3.timeFormat("%y"))
      .tickValues(dataTime)
      .ticks(10)
      .default(new Date(2022, 1, 0))
      .on("onchange", (val) => {
        d3.select("#slider-time").text(d3.timeFormat("%Y")(val));
        let cuttoffYear = d3.timeFormat("%Y")(val).slice(-4);
        this.globalState.cuttoffYear = cuttoffYear;
        updateAllGroup();
      });

    let gTime = d3
      .select("#satDistance")
      .append("g")
      .attr("id", "time")
      .attr("transform", "translate(290,-215)");

    gTime.call(sliderTime);

    d3.select("#slider-time").text(d3.timeFormat("%Y")(sliderTime.value()));
  }

  /** Method for creating the slider that allows for selection of satellites displayed on the chart.
   * Sourced from: https://bl.ocks.org/johnwalley/raw/e1d256b81e51da68f7feb632a53c3518/?raw=true
   */
  addSampleSlider() {
    d3.select("#satDistance")
    .append("g")
    .append("text")
    .attr("id", "slider-sample")
    .attr("transform", "translate(-290, -235)")
    .text("Sample of Total Satellites");

    let dataTime = [0.05, 0.1, 0.2, 0.5, 1];

    let sliderTime = d3
      .sliderRight()
      .min(d3.min(dataTime))
      .max(d3.max(dataTime))
      .step(10)
      .width(50)
      .height(400)
      .tickFormat(d3.format(".0%"))
      .tickValues(dataTime)
      .ticks(10)
      .default(0.05)
      .marks(dataTime)
      .on("onchange", (val) => {
        updateSample(val);
      });

    let gTime = d3
      .select("#satDistance")
      .append("g")
      .attr("id", "sample")
      .attr("transform", "translate(-290,-215)");

    gTime.call(sliderTime);
  }

  /**Helper method to generalize input launch dates into easier to quantify launch years */
  convertToLaunchDate(satelliteSelection) {
    let launchDate = satelliteSelection["Date of Launch"].slice(-2);
    if (parseInt(launchDate) <= 22) {
      launchDate = "20" + launchDate;
    } else {
      launchDate = "19" + launchDate;
    }
    return new Date(launchDate, 1, 0);
  }
  /** Method that takes in a selection of satellite json objects
   * and generalizes their launch dates into a collection of launch years.
   */
  getLaunchDates(satellites) {
    let cuttoff = new Date(1990, 0, 1);
    let launchYears = new Set();
    for (let i = 0; i < satellites.length; i++) {
      let launchDate = this.convertToLaunchDate(satellites[i]);

      if (launchDate < cuttoff) {
        continue;
      } else {
        launchYears.add(launchDate);
      }
    }
    let launchData = Array.from(launchYears).sort();

    return launchData;
  }

  /**Draws the "globe" in the middle of the radial chart.  */
  addGlobe() {
    let globe = d3
      .select("#globe")
      .append("image")
      .attr("xlink:href", "assets/globe2.png")
      .attr("width", 200)
      .attr("height", 200)
      .attr("transform", "translate(-100, -100)")
      .html("Click here to reset")
      .on("click", (event, d) => {
        this.globalState.selection = []
        this.globalState.cuttoffYear = 2022;
        this.globalState.group = [
          ["Type of Orbit", null],
          ["Date of Launch", null],
          ["Country of Operator/Owner", null],
          ["Purpose", null],
          ["Launch Site", null],
          ["Launch Vehicle", null]
      ];
        
        this.resetSliders(this.globalState.satelliteData);

        updateAllGroup(true);
        
      });
  }

  resetSliders(satelites) {
    d3.select("#time").remove();
    this.addYearSlider(satelites);
  }

  /**Method for changing the visualization when new data is selected */
  redraw(satellites) {
    if (satellites.length < 500) {
      this.animate = true;
    } else {
      this.animate = false;
    }

    this.y.domain([
      d3.min(satellites, (d) => d["Perigee (km)"]),
      d3.max(satellites, (d) => d["Perigee (km)"]),
    ]);
    d3.select("#x").selectAll("g").remove();
    d3.select("#y").selectAll("g").remove();
    let svg = d3.select("#satDistance");
    this.drawAxis(svg);
    this.placeSatellites(satellites);
  }

  /** Helper method for redrawing the visualization based on the status of our filter*/
  updateGroup() {
    this.redraw(applyGrouping());
    this.updateSelection()
  }

  /**Updates the visualization based on new sample size selections.  */
  newSampleUpdate() {
    
    updateAllGroup();
  }

  updateSelection(){
    d3.selectAll("circle")
    .classed("selected", false)
    d3.selectAll("circle")
    .classed("selected", (d)=> {
      for(let i = 0; i < this.globalState.selection.length; i++){
        if(d['Name of Satellite, Alternate Names'] == this.globalState.selection[i]){
          return true;
        }
      }
      
    })
  }
}
