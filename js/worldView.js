class Worldview {
  /*
TODO
this should show some sample of our satellites, as well as some image of the globe. (maybe it spins?) 
*/
  constructor(input_satellites) {
    this.satellites = input_satellites;

    // basic svg params
    this.width = 500;
    this.height = 500;
    this.margin = 20;

    this.config = {
      speed: 0.005,
      verticalTilt: -30,
      horizontalTilt: 0,
    };

    let launchDensityScale = d3
      .scaleLinear()
      // need actual json data to do stuff here, ill plan on something clever here.
      .domain(this.satellites, (d) => console.log(d))
      .range(["#fff2cd", "#990000"]);

    this.renderGlobe();
    
    // this.placeSatellites();
  }

  // potential cool visualizaion? http://bl.ocks.org/emeeks/068ef3e4106e155467a3

  renderGlobe() {
    // https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54

    // radial chart
    // https://observablehq.com/@d3/radial-area-chart
    const svg = d3
      .select("#worldview")
      .append("svg")
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

    let innerRadius = this.width / 5;
    let outerRadius = this.width / 2 - this.margin;

    let sampleSats = this.sampleSatellites();
    console.log(sampleSats)

    let x = d3
      .scaleUtc()
      .domain([Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1) - 1])
      .range([0, 2 * Math.PI]);

    let y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.minmin), d3.max(data, (d) => d.maxmax)])
      // .domain([500, 40000])
      .range([innerRadius, outerRadius]);

    

    let xAxis = (g) =>
      g
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .call((g) =>
          g
            .selectAll("g")
            .data(x.ticks())
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
              M${d3.pointRadial(x(d), innerRadius)}
              L${d3.pointRadial(x(d), outerRadius)}
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
              M${d3.pointRadial(x(a), innerRadius)}
              A${innerRadius},${innerRadius} 0,0,1 ${d3.pointRadial(
                    x(b),
                    innerRadius
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
            .data(y.ticks().reverse())
            .join("g")
            .attr("fill", "none")
            .call((g) =>
              g
                .append("circle")
                .attr("stroke", "#000")
                .attr("stroke-opacity", 0.2)
                .attr("r", y)
            )
            .call((g) =>
              g
                .append("text")
                .attr("y", (d) => -y(d))
                .attr("dy", "0.35em")
                .attr("stroke", "#fff")
                .attr("stroke-width", 5)
                .text((x, i) => `${x.toFixed(0)}${i ? "" : " km"}`)
                .clone(true)
                .attr("y", (d) => y(d))
                .selectAll(function () {
                  return [this, this.previousSibling];
                })
                .clone(true)
                .attr("fill", "currentColor")
                .attr("stroke", "none")
            )
        );

    // svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);
  }

  async sampleSatellites() {
    const satSampleData = await d3.json("data/satellites_sample.json");
    return satSampleData;
  }

  placeSatellites() {
    // http://bl.ocks.org/eesur/2ac63b3d0ece6682a42c0f9d3a6bfabc
  }
}
