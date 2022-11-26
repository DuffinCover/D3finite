// import { sliderBottom } from 'd3-simple-slider';
class Worldview {


  constructor(global_state) {
    this.globalState = global_state;
    this.sats = global_state.satelliteData;
    this.sampleSats = global_state.sampleSatellites;

    // basic svg params
    this.width = 500;
    this.height = 500;
    this.margin = 20;


    this.innerRadius = this.width / 5;
    this.outerRadius = this.width / 2 - this.margin;

    let scale_data = this.sampleSats;



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
    
    this.addGlobe(scale_data);
    this.drawAxis(worldviewsvg);
    
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
    let angles = satellites.map((d) => Math.random() * Math.PI * 2);
    let purpose = new Set();
    svg
      .selectAll("circle")
      .data(satellites)
      .join("circle")
      .attr("r", 5)
      .attr("opacity", 0.5)
      // .attr("class", (d)=> purpose.add(d["Class of Orbit"]))
      .attr("class", (d) => d["Class of Orbit"])
      .on("mouseover", (event, d)=> {
        console.log(d)
      })
      .on("click", (event, d) => {
        let satSubset = satellites.filter(n=>n["Class of Orbit"] === d["Class of Orbit"])
        this.redraw(satSubset);
      })
      .transition()
      .duration(1000)
      .attr("cx", (d, i) => {
        return Math.cos(angles[i]) * this.y(d["Perigee (km)"]);
      })
      .attr("cy", (d, i) => {
        return Math.sin(angles[i]) * this.y(d["Perigee (km)"]);
      });

    // console.log(purpose)
  }

  addYearSlider(satellites){
    // Found slider code here: https://bl.ocks.org/johnwalley/raw/e1d256b81e51da68f7feb632a53c3518/?raw=true

    d3.select("#worldview")
    .append("div")
    .attr("id", "helper-text")
    .append("p")
    .html("Adjust the slider to see how many satellites were launched up through the selected year.");


    d3.select("#helper-text")
    .append("p")
    .html("Click the Earth to Reset the satellites.");


    // d3.select("#helper-text")
    // .append("p")
    // .html("Select by Launch Year");
    
  
    d3.select("#worldview")
    .append("div")
    .append("p")
    .attr("id", "value-time");  
    
    d3.select("#worldview")
    .append("div")
    .attr("id", "slider-time");

    

    let dataTime = this.getLaunchDates(satellites);

  
    let sliderTime = d3.sliderBottom()
      .min(d3.min(dataTime))
      .max(d3.max(dataTime))
      .step(1000 * 60 * 60 * 24 * 365)
      .width(450)
      .tickFormat(d3.timeFormat('%y'))
      .tickValues(dataTime)
      .ticks(10)
      .default(new Date(2022, 1, 0))
      .on('onchange', val => {
        d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
        let cuttoffYear = d3.timeFormat('%Y')(val).slice(-4)
        let selectedYear = satellites.filter(d=>{
          let thisLaunch = d["Date of Launch"].slice(-2)
          if(thisLaunch <=22){
            thisLaunch = "20" + thisLaunch
          }
          else{
            thisLaunch = "19" + thisLaunch
          }
          return parseInt(thisLaunch) <= parseInt(cuttoffYear)
        }
        )
        let svg = d3.select("#satellites")
        .selectAll("circle")
        .attr("opacity", 0.2)


        this.redraw(selectedYear) 
        // this.changeYearFocus(selectedYear)

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

  addGlobe(satellites) {
    let svg = d3.select("#satDistance").append("g").attr("id", "globe");

    let globe = d3
      .select("#globe")
      // .append("image")
      // .attr('src', 'D3finite/assets/586-5863993_planet-earth-png-nasa-seeing-earth-from-space.png')
      // .attr('width', 200)
      // .attr('height', 200)

      .append("circle")
      .attr("r", this.innerRadius - 10)
      .attr("x", this.height / 2)
      .attr("y", this.width / 2)
      .attr("fill", "teal")
      // .attr("transform", "translate(-250, -250)")
      .html("Click here to reset")
      .on("click",(event, d) => this.redraw(satellites));
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

  changeYearFocus(satellites){
    let svg = d3.select("#satellites")
    svg
    .data(satellites)
      .selectAll("circle")
      .attr("opacity", 0.8)
  }

  updateGroup(){

  }
}