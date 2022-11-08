class Worldview {
  /*
TODO
this should show some sample of our satellites, as well as some image of the globe. (maybe it spins?) 
*/
  constructor(input_satellites) {
    this.satellites = input_satellites;

    // basic svg params
    this.width = 300;
    this.height = 100;

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
    console.log("entered renderGlobe");

    let svg = d3
      .select("#worldview")
      .append("svg")
      .attr("id", "circle")
      .attr("width", this.width)
      .attr("height", this.height);

    svg
    .enter()
      .append("circle")
      .attr("cx", 25)
      .attr("cy", 25)
      .attr("r", 25)
      .style("fill", "purple");

    console.log("made it past where i should be adding a circle");
  }

  sampleSatellites() {}

  placeSatellites() {
    // http://bl.ocks.org/eesur/2ac63b3d0ece6682a42c0f9d3a6bfabc
  }
}
