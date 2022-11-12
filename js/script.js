async function loadData() {
    const satData = await d3.json('data/satellites.json');

    return satData;
}
loadData().then(data => {
    console.log(data);
<<<<<<< Updated upstream
=======
    globalState.satelliteData = data[0]; 
    globalState.sampleSatellites = data[1];
    let SatTable = new SatelliteTable(globalState);
    let worldView = new Worldview(globalState);
    let chart = new VisualSatelliteChart(globalState);

    globalState.worldView = worldView;
});
>>>>>>> Stashed changes

    let SatTable = new SatelliteTable(data);
    
});