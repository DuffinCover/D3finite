class Worldview {
  /*
TODO
this should show some sample of our satellites, as well as some image of the globe. (maybe it spins?) 
*/
  constructor(global_state) {
    this.globalState = global_state;
    this.sats = global_state.satelliteData;
    this.sampleSats = global_state.sampleSatellites;

    // basic svg params
    this.width = 500;
    this.height = 500;
    this.margin = 20;

    // placeholders for scales we define in our axis
    this.innerRadius = this.width / 5;
    this.outerRadius = this.width / 2 - this.margin;

    let scale_data = this.sampleSats

    // d3.filter(scale_data)

    this.x = d3
      .scaleUtc()
      .domain([Date.UTC(2016, 0, 1), Date.UTC(2022, 0, 1) - 1])
      .range([0, 2 * Math.PI]);

    this.y = d3
      .scaleLinear()
      .domain([
        d3.min(scale_data, (d) => d["Perigee (km)"]),
        d3.max(scale_data, (d) => d["Perigee (km)"]),
      ])
      .range([this.innerRadius, this.outerRadius]);

    let launchDensityScale = d3
      .scaleLinear()
      // need actual json data to do stuff here, ill plan on something clever here.
      // .domain(this.satellites, (d) => console.log(d))
      .range(["#fff2cd", "#990000"]);

    this.drawAxis();

    this.placeSatellites(scale_data);
  }

  // potential cool visualizaion? http://bl.ocks.org/emeeks/068ef3e4106e155467a3

  drawAxis() {
    // https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54

    // radial chart
    // https://observablehq.com/@d3/radial-area-chart
    // I've adapted the above code for our purposes.
    const svg = d3
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

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);
  }

  placeSatellites(satellites) {
    // http://bl.ocks.org/eesur/2ac63b3d0ece6682a42c0f9d3a6bfabc
    let svg = d3.select("#satDistance").append("g").attr("id", "satellites");
    let purpose = new Set()
    let sats = d3
      .select("#satellites")
      .selectAll("circle")
      .data(satellites)
      .join("circle")
      .attr("cx", (d)=> {
        let date = this.randomDate(new Date(Date.UTC(2016, 0, 1)), new Date(Date.UTC(2022)));
        // console.log(date)
        return this.x(date);
      })
      .attr(
        "cy",
        (d) => this.y(d["Perigee (km)"]))
      .attr("r", 5)
      // .attr("class", (d)=> purpose.add(d["Class of Orbit"]))
      .attr('class', (d)=>d["Class of Orbit"])
      .attr("fill", "red")
      // .attr("transform", "translate(0, -20)")
      .on("click", (event, d)=> console.log(d));

      // console.log(purpose)
  }
//https://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates
  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  
}
