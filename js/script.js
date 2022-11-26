

const globalState = {
    satelliteData: null,
    sampleSatellites: null,
    table: null,
    worldView: null,
    lineChart: null,
    group: [],
    selection: [],
};

async function loadData() {
    const satData = await d3.json('data/satellites.json');
    // const satSampleData =  await d3.json("data/satellites_sample.json")
    let sampleSize = 200
    let sampleSet = new Set()
    for( let i = 0; i < sampleSize; i++){
      sampleSet.add(satData[Math.floor(Math.random() * sampleSize)])
    }

    const satSampleData = [...sampleSet]
    return [satData, satSampleData];
}

loadData().then(data => {
    console.log(data);

    globalState.satelliteData = data[0]; 
    globalState.sampleSatellites = data[1];
    globalState.table = new SatelliteTable(globalState);
    globalState.worldView = new Worldview(globalState);
    globalState.lineChart = new VisualSatelliteChart(globalState);

});

function updateAllGroup() {
    globalState.table.updateGroup();
    globalState.worldView.updateGroup();
    // globalState.lineChart.updateGroup();
}

function updateAllSelection() {
    console.log("Updating Selection");
    globalState.table.updateSelection();
}
