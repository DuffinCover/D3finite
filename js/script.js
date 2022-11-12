

const globalState = {
    satelliteData: null,
    sampleSatellites: null,
    table: null,
    worldView: null,
    lineChart: null,
};

async function loadData() {
    const satData = await d3.json('data/satellites.json');
    const satSampleData =  await d3.json("data/satellites_sample.json")

    return [satData, satSampleData];
}
<<<<<<< HEAD
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
=======
>>>>>>> 37112d4be3cf8f3916b8c240045de2c7467c8d6c




loadData().then(data => {
    // console.log(data);
    globalState.satelliteData = data[0]; 
    globalState.sampleSatellites = data[1];
    // let SatTable = new SatelliteTable(data);
    let worldView = new Worldview(globalState);

    globalState.worldView = worldView;
});

