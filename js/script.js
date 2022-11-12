

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




loadData().then(data => {
    // console.log(data);
    globalState.satelliteData = data[0]; 
    globalState.sampleSatellites = data[1];
    // let SatTable = new SatelliteTable(data);
    let worldView = new Worldview(globalState);

    globalState.worldView = worldView;
});

