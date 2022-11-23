// import { sliderBottom } from 'd3-simple-slider';
class Worldview {


  constructor(global_state) {
    this.globalState = global_state;
    this.sats = global_state.satelliteData;
    this.sampleSats = ''//global_state.sampleSatellites;
    this.satAngles =''

    //take a smaller sample size of our data to initally display
    let sampleSize = 200
    let sampleArray = []
    for( let i = 0; i < sampleSize; i++){
      sampleArray.push(this.sats[Math.floor(Math.random() * sampleSize)])
    }
    this.sampleSats = sampleArray

    // basic svg params
    this.width = 500;
    this.height = 500;
    this.margin = 20;


    this.innerRadius = this.width / 5;
    this.outerRadius = this.width / 2 - this.margin;


    let angles = this.sats.map((d) => Math.random() * Math.PI * 2);
    // console.log(angles)
    let angleSets = {};
    for (let i = 0; i < this.sats.length; i++){
    //   // console.log(this.sats[i])
    //   // console.log(angles[i])
    let cosparName = this.sats[i]["COSPAR Number"]
    // console.log(cosparName)
      angleSets[cosparName] = angles[i];
    }
    // console.log(Object.keys(angleSets).length);
    this.satAngles = angleSets;




    let scale_data = this.sampleSats;

    // d3.filter(scale_data)

    this.x = d3
      .scaleUtc()
      .domain([Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1) - 1])
      .range([0, 2 * Math.PI]);

    this.y = d3
      .scaleLinear()
      .domain([
        d3.min(scale_data,  (d) => d["Perigee (km)"]),
        d3.max(scale_data, (d) => d["Perigee (km)"]),
      ])
      .range([this.innerRadius, this.outerRadius + 10]);

    let launchDensityScale = d3
      .scaleLinear()
      // need actual json data to do stuff here, ill plan on something clever here.
      // .domain(this.satellites, (d) => console.log(d))
      .range(["#fff2cd", "#990000"]);
    
    let worldviewsvg = d3
    .select("#worldview")
    .append("svg")
    .attr("id", "satDistance")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("viewBox", [
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    ])
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round");


    let satDistance = d3.select("#satDistance");
    satDistance.append("g").attr("id", 'x')
    satDistance.append("g").attr("id", 'y')
    satDistance.append("g").attr("id", "satellites")
    

    this.drawAxis(worldviewsvg);
    this.addGlobe();
    this.placeSatellites(scale_data)
    this.addYearSlider(scale_data);
  }

  // potential cool visualizaion? http://bl.ocks.org/emeeks/068ef3e4106e155467a3

  drawAxis(svg) {
    // https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54

    // radial chart
    // https://observablehq.com/@d3/radial-area-chart
    // I've adapted the above code for our purposes.

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

  placeSatellites(satellites) {


    // http://bl.ocks.org/eesur/2ac63b3d0ece6682a42c0f9d3a6bfabc
    let svg = d3.select("#satellites");
    // let angles = satellites.map((d) => Math.random() * Math.PI * 2);
    let purpose = new Set();
    svg
      .selectAll("circle")
      .data(satellites)
      .join("circle")
      .attr("r", 5)
      // .attr("class", (d)=> purpose.add(d["Class of Orbit"]))
      .attr("class", (d) => d["Class of Orbit"])
      .on("click", (event, d) => {
        let satSubset = satellites.filter(n=>n["Class of Orbit"] === d["Class of Orbit"])
        this.redraw(satSubset);
      })
      .transition()
      .duration(1000)
      .attr("cx", (d, i) => {
        return Math.cos(this.satAngles[d["COSPAR Number"]]) * this.y(d["Perigee (km)"]);
      })
      .attr("cy", (d, i) => {
        return Math.sin(this.satAngles[d["COSPAR Number"]]) * this.y(d["Perigee (km)"]);
      });

    // console.log(purpose)
  }

  addYearSlider(satellites){
    // Found slider code here: https://bl.ocks.org/johnwalley/raw/e1d256b81e51da68f7feb632a53c3518/?raw=true
    // console.log(satellites)
    d3.select("#worldview")
    .append("div")
    .append("p")
    .attr("id", "value-time");
    
    
    d3.select("#worldview")
    .append("div")
    .attr("id", "slider-time");

    

    let dataTime = this.getLaunchDates(satellites);
    // let dataTime = d3.range(0, 10).map(function(d) {
    //   return new Date(1995 + d, 10, 3);
    // });
  
    let sliderTime = d3.sliderBottom()
      .min(d3.min(dataTime))
      .max(d3.max(dataTime))
      .step(1000 * 60 * 60 * 24 * 365)
      .width(450)
      .tickFormat(d3.timeFormat('%y'))
      .tickValues(dataTime)
      .ticks(10)
      .default(new Date(1998, 0, 1))
      .on('onchange', val => {
        d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
        let cuttoffYear = d3.timeFormat('%Y')(val).slice(-2)
        let selectedYear = satellites.filter(d=>parseInt(d["Date of Launch"].slice(-2)) <= parseInt(cuttoffYear)
          // console.log(this.convertToLaunchDate(d))
        )
        this.redraw(selectedYear)

      });
  
    let gTime = d3
      .select('div#slider-time')
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)');
  
    gTime.call(sliderTime);
  
    d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
  }

  convertToLaunchDate(satelliteSelection){
    let launchDate = satelliteSelection["Date of Launch"].slice(-2);
    if(parseInt(launchDate) <= 22){
      launchDate = "20" + launchDate;
    }
    else{
      launchDate = "19" + launchDate;
    }
    return new Date(launchDate, 1, 0);
  }

  getLaunchDates(satellites){
    let cuttoff = new Date(1990, 0, 1);
    let launchYears = new Set();
    for(let i = 0; i < satellites.length; i++){
      let launchDate = this.convertToLaunchDate(satellites[i])
        
      if(launchDate < cuttoff){
        continue;
      }
      else{
        launchYears.add(launchDate);
      }
           
    }
    let launchData = Array.from(launchYears).sort();

   return launchData
  }

  addGlobe() {
    let svg = d3.select("#satDistance").append("g").attr("id", "globe");

    let globe = d3
      .select("#globe")
      .append("circle")
      .attr("r", this.innerRadius - 10)
      .attr("cx", this.height / 2)
      .attr("cy", this.width / 2)
      .attr("fill", "teal")
      .attr("transform", "translate(-250, -250)")
      .on("click",(event, d) => this.redraw(this.sats));
  }
  //https://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates
  randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  redraw(satellites){
    this.y
    .domain([
      d3.min(satellites, (d) => d["Perigee (km)"]),
      d3.max(satellites, (d) => d["Perigee (km)"]),
    ])
    d3.select("#x").selectAll("g").remove();
    d3.select("#y").selectAll("g").remove();
    let svg = d3.select("#satDistance")
    this.drawAxis(svg);
    this.placeSatellites(satellites);
  }
}