class Worldview{
/*
TODO
this should show some sample of our satellites, as well as some image of the globe. (maybe it spins?) 
*/
constructor(input_satellites){
    this.satellites = input_satellites;
    

    // basic svg params
    this.width = 300
    this.height = 100
    
    this.config = {
        speed: 0.005,
        verticalTilt: -30,
        horizontalTilt: 0
      }

    let launchDensityScale = d3.scaleLinear()
    // need actual json data to do stuff here, ill plan on something clever here. 
    .domain(this.satellites, (d)=> console.log(d))
    .range(['#fff2cd', '#990000']);

this.renderGlobe();
}

// potential cool visualizaion? http://bl.ocks.org/emeeks/068ef3e4106e155467a3 

renderGlobe(){

    // https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54
    let locations = [];
    let worldDiv = d3.select('#worldView')
    
    console.log('got here')
    worldDiv
    .append('svg')
    .attr('width', width).attr('height', height);
    // const markerGroup = svg.append('g');



    // const projection = d3.geoOrthographic();
    // const initialScale = projection.scale();
    // const path = d3.geoPath().projection(projection);
    // const center = [width/2, height/2];

    // drawGlobe();    
    // drawGraticule();
    // enableRotation();    

    function drawGlobe() {  
        d3.queue()
            .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')          
            // .defer(d3.json, 'locations.json')
            .await((error, worldData, locationData) => {
                svg.selectAll(".segment")
                    .data(topojson.feature(worldData, worldData.objects.countries).features)
                    .enter().append("path")
                    .attr("class", "segment")
                    .attr("d", path)
                    .style("stroke", "#888")
                    .style("stroke-width", "1px")
                    .style("fill", (d, i) => '#e5e5e5')
                    .style("opacity", ".6");
                    // locations = locationData;
                    drawMarkers();                   
            });
    }

    function drawGraticule() {
        const graticule = d3.geoGraticule()
            .step([10, 10]);

        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path)
            .style("fill", "#fff")
            .style("stroke", "#ccc");
    }

    function enableRotation() {
        d3.timer(function (elapsed) {
            projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
            svg.selectAll("path").attr("d", path);
            drawMarkers();
        });
    }        

    function drawMarkers() {
        const markers = markerGroup.selectAll('circle')
            .data(locations);
        markers
            .enter()
            .append('circle')
            .merge(markers)
            .attr('cx', d => projection([d.longitude, d.latitude])[0])
            .attr('cy', d => projection([d.longitude, d.latitude])[1])
            .attr('fill', d => {
                const coordinate = [d.longitude, d.latitude];
                gdistance = d3.geoDistance(coordinate, projection.invert(center));
                return gdistance > 1.57 ? 'none' : 'steelblue';
            })
            .attr('r', 7);

        markerGroup.each(function () {
            this.parentNode.appendChild(this);
        });
    }
}

sampleSatellites(){

}



}