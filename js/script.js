
async function loadData() {
    const satData = await d3.json('data/satellites.json');
    return satData;
}

const globalState = {
    satelliteData: null,
    sampleSatellites: null,
    table: null,
    worldView: null,
    lineChart: null,
};


loadData().then(data => {
    console.log(data);
    globalState.satelliteData = data; 
    // let SatTable = new SatelliteTable(data);
    let worldView = new Worldview(data);

    globalState.worldView = worldView;
});

