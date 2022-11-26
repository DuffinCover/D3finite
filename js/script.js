

const globalState = {
    satelliteData: null,
    sampleSatellites: null,
    table: null,
    worldView: null,
    lineChart: null,
    group: [],
    selection: [],
    color_pallette: [
        '#f36688', '#da3182', '#9e316b',
        '#bb3ad3', '#684dda', '#5033db',
        '#261a5a', '#1a1044', '#4c5c87',
        '#69809e','#95c5ac'
    ]
};

async function loadData() {
    const satData = await d3.json('data/satellites.json');
    const satSampleData =  await d3.json("data/satellites_sample.json")

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
    //globalState.worldView.updateGroup();
    globalState.lineChart.update();
}

function updateAllSelection() {
    console.log("Updating Selection",globalState.selection);
    globalState.table.updateSelection();
    globalState.lineChart.update();
}

function updateSort() {
    globalState.lineChart.update();
}
